from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from ..pong_game import PongGame
import asyncio
import logging # for debug
from ..func import fetch_player_name, store_game_result

logger = logging.getLogger('game')

async def set_cache(key, value, timeout=DEFAULT_TIMEOUT):
	cache.set(key, value, timeout)
	while cache.get(key) != value:
		await asyncio.sleep(0.01)



class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.valid = False
		self.player_id = 0
		self.game_id = str(self.scope['url_route']['kwargs']['game_id'])
		self.user_token = str(self.scope['url_route']['kwargs']['user_token'])
		self.is_tournament = bool(self.scope['url_route']['kwargs']['is_tournament'])
		self.player_name = ["player1", "player2"]
		if not cache.get("game" + self.game_id):
			await self.close(code=4002)
			return
		active_connections = cache.get("game" + self.game_id, 0)

		if active_connections >= 3:
			await self.close(code=4002)
			return

		new_connections = active_connections + 1
		await set_cache("game" + self.game_id, new_connections, 1500)
		await self.channel_layer.group_add(
			self.game_id,
			self.channel_name
		)
		await self.accept()

		self.player_id = int(active_connections)
		if self.user_token == 'guest':
			self.is_tournament = False
			if self.player_id == 2:
				await self.channel_layer.group_send(
					self.game_id,
					{
						'type': 'init_playername',
					}
				)
			# The cache should be set if the guest is the first connection
			else:
				await set_cache("game_player_name" + self.game_id, self.player_name, 1500)
		else:
			player_name = fetch_player_name(self.user_token)
			if not player_name:
				await self.close(code=4002)
				return
			self.player_name[self.player_id - 1] = player_name
			if self.player_id == 1:
				await set_cache("game_player_name" + self.game_id, self.player_name, 1500)
			else:
				self.player_name[0] = cache.get("game_player_name" + self.game_id, [])[0]
				await set_cache("game_player_name" + self.game_id, self.player_name, 1500)
				await self.channel_layer.group_send(
					self.game_id,
					{
						'type': 'init_playername',
					}
				)

		self.valid = True
		if self.player_id == 1:
			self.game_state = PongGame()
		if self.player_id == 2:
			await self.channel_layer.group_send(
				self.game_id,
				{
					'type': 'start_game_loop',
				}
			)

	async def game_loop(self):
		while True:
			message = self.game_state.to_json()
			message_dict = json.loads(message)
			message_dict['player_id'] = 1
			message_dict['player_names'] = self.player_name
			message = json.dumps(message_dict)
			await self.send(text_data=message)
			message_dict['player_id'] = 2
			message = json.dumps(message_dict)
			await self.channel_layer.group_send(
				self.game_id,
				{
					'type': 'game_send',
					'message': message
				}
			)
			await asyncio.sleep(0.016)  # 16ms for approximately 60fps
			if self.game_state.score[0] >= 11 or self.game_state.score[1] >= 11:
				if self.is_tournament:
					await self.channel_layer.group_send(
						self.game_id,
						{
							'type': 'succ_tournament',
						}
					)
					break
				else:
					await self.channel_layer.group_send(
						self.game_id,
						{
							'type': 'succ_normal',
							'message': message
						}
					)
					break

	async def disconnect(self, close_code):
		active_connections = cache.get("game" + self.game_id, 0)
		if close_code != 4101 and close_code != 4102:
			await self.channel_layer.group_send(
				self.game_id,
				{
					'type': 'opponent_disconnect',
				}
			)
		elif active_connections != 0 and self.valid:
			cache.delete("game" + self.game_id)

		await self.channel_layer.group_discard(
			self.game_id,
			self.channel_name
		)
		if hasattr(self, 'game_task'):
			self.game_task.cancel()

	async def receive(self, text_data):
		if cache.get("game" + self.game_id, 0) == 0:
			await self.close(code=4442)
		if int(cache.get("game" + self.game_id)) < 3:
			return
		# data sync
		if self.player_id == 1:
			game_data = json.loads(text_data)
			self.game_state.game_loop(game_data['paddle_pos'], self.player_id)
		else:
			await self.channel_layer.group_send(
				self.game_id,
				{
					'type': 'game_update',
					'message': text_data
				}
			)

	# when player 2 connects, start the loop
	async def start_game_loop(self, event):
		if self.player_id == 1:
			self.game_task = asyncio.create_task(self.game_loop())

	# player 1 loop	
	async def game_update(self, event):
		if self.player_id == 1:
			message = event['message']
			game_data = json.loads(message)
			self.game_state.game_loop(game_data['paddle_pos'], 2)

	# player 2 sending data
	async def game_send(self, event):
		if self.player_id == 2:
			message = event['message']
			await self.send(text_data=message)
			# logger.info(f"Sent to player 2: {message}")

	async def init_playername(self, event):
		if self.player_id == 1:
			self.player_name = cache.get("game_player_name" + self.game_id, [])

	async def opponent_disconnect(self, event):
		await self.close(code=4441)

	async def succ_normal(self, event):
		if self.player_id == 1:
			data = json.loads(event['message'])
			store_game_result(self.player_name, data['score'])
		await self.close(code=4101)

	async def succ_tournament(self, event):
		await self.close(code=4102)

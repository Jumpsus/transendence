from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from ..pong_game import PongGame
import asyncio, requests
from ..func import store_game_result


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
		self.user_name = ["guest", "guest"]
		if not cache.get("game" + self.game_id):
			await self.close(code=4002)
			return
		active_connections = cache.get("game" + self.game_id, 0)

		if active_connections >= 3:
			await self.close(code=4002)
			return

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
				await set_cache("game_user_name" + self.game_id, self.user_name, 1500)
		else:
			player_name = await self.fetch_user()
			if not player_name:
				await self.close(code=4002)
				return
			self.player_name[self.player_id - 1] = player_name
			if self.player_id == 1:
				await set_cache("game_player_name" + self.game_id, self.player_name, 1500)
				await set_cache("game_user_name" + self.game_id, self.user_name, 1500)
			else:
				self.player_name[0] = cache.get("game_player_name" + self.game_id, [])[0]
				self.user_name[0] = cache.get("game_user_name" + self.game_id, [])[0]
				await set_cache("game_player_name" + self.game_id, self.player_name, 1500)
				await set_cache("game_user_name" + self.game_id, self.user_name, 1500)
				await self.channel_layer.group_send(
					self.game_id,
					{
						'type': 'init_playername',
					}
				)

		self.valid = True
		new_connections = active_connections + 1
		await set_cache("game" + self.game_id, new_connections, 1500)
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
				message = self.game_state.to_json()
				if self.is_tournament:
					await self.channel_layer.group_send(
						self.game_id,
						{
							'type': 'succ_tournament',
							'message': message
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

		if active_connections >= 3 and self.player_id == 0:
			return
		if close_code != 4101 and close_code != 4102:
			await self.channel_layer.group_send(
				self.game_id,
				{	
					'type': 'opponent_disconnect',
				}
			)
		elif active_connections != 0 and self.valid:
			cache.delete("game" + self.game_id)
			cache.delete("game_player_name" + self.game_id)
			cache.delete("game_user_name" + self.game_id)

		await self.channel_layer.group_discard(
			self.game_id,
			self.channel_name
		)
		if hasattr(self, 'game_task'):
			self.game_task.cancel()

	async def receive(self, text_data):
		if cache.get("game" + self.game_id, 0) == 0:
			await self.close(code=4442)
			return
		if cache.get("game" + self.game_id, 0) < 3:
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

	async def init_playername(self, event):
		if self.player_id == 1:
			self.player_name = cache.get("game_player_name" + self.game_id, [])
			self.user_name = cache.get("game_user_name" + self.game_id, [])

	async def opponent_disconnect(self, event):
		await self.close(code=4441)

	async def succ_normal(self, event):
		data = json.loads(event['message'])
		if self.player_id == 1:
			store_game_result(self.user_name, data['score'])
		if data['score'][0] >= 11:
			await self.close(code=4101)
		else:
			await self.close(code=4111)


	async def succ_tournament(self, event):
		data = json.loads(event['message'])
		if self.player_id == 1:
			store_game_result(self.user_name, data['score'])
		if data['score'][0] >= 11:
			await self.close(code=4102)
		else:
			await self.close(code=4112)

	# Used to get user's tag and username:
	async def fetch_user(self):
		url = "http://user-management:8000/user/getinfo"
		headers = {
			"Authorization": "Bearer " + self.user_token,
		}
		response = requests.get(url, headers=headers)

		if response.status_code == 200:
			data = response.json()
			self.user_name[self.player_id - 1] = data['username']
			if len(data['tag']) == 0:
				return data['username']
			return data['tag']
		else:
			return None

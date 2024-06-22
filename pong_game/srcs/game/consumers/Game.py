from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from ..pong_game import PongGame
import requests, asyncio

async def set_cache(key, value, timeout=DEFAULT_TIMEOUT):
	cache.set(key, value, timeout)
	while cache.get(key) != value:
		await asyncio.sleep(0.01)

def fetch_player_name(token):
	url = "http://user-management:8000/user/getinfo"
	headers = {
		"Authorization": "Bearer " + token,
	}
	response = requests.get(url, headers=headers)

	if response.status_code == 200:
		data = response.json()
		if len(data['tag']) == 0:
			return data['username']
		return data['tag']
	else:
		return None

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.valid = False
		self.player_id = 0
		self.game_id = str(self.scope['url_route']['kwargs']['game_id'])
		self.user_token = str(self.scope['url_route']['kwargs']['user_token'])
		self.is_tournament = bool(self.scope['url_route']['kwargs']['is_tournament'])
		self.player_name = ["player1", "player2"]
		self.lock = asyncio.Lock()
		if not cache.get("game" + self.game_id):
			await self.close(code=4002)
			return
		active_connections = cache.get("game" + self.game_id, 0)

		if active_connections >= 3:
			# Reject the connection if 2 connections are already active
			await self.close(code=4002)
			return

		# Increment the connection count in the cache atomically
		new_connections = active_connections + 1
		cache.set("game" + self.game_id, new_connections, timeout=1500)
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
				await asyncio.sleep(0.1)
				self.player_name[0] = cache.get("game_player_name" + self.game_id, [])[0]
				await set_cache("game_player_name" + self.game_id, self.player_name, 1500)
				await self.channel_layer.group_send(
					self.game_id,
					{
						'type': 'init_playername',
					}
				)

		# Init the game obj
		self.game_state = PongGame()
		self.valid = True

	async def disconnect(self, close_code):
		active_connections = cache.get("game" + self.game_id, 0)
		if active_connections > 2:
			# Disconnect the other player with error code
			await self.channel_layer.group_send(
				self.game_id,
				{
					'type': 'opponent_disconnect',
				}
			)
		elif active_connections != 0 and self.valid:
			# Remove the key if this is the last connection
			cache.delete("game" + self.game_id)

		await self.channel_layer.group_discard(
			self.game_id,
			self.channel_name
		)

	async def receive(self, text_data):
		# room expired
		if cache.get("game" + self.game_id, 0) == 0:
			await self.close(code=4442)
		# Block if the connections are less than 2
		if int(cache.get("game" + self.game_id)) < 3:
			return
		async with self.lock:
			game_data = json.loads(text_data)
			self.game_state.game_loop(game_data['paddle_pos'], self.player_id)
			message = self.game_state.to_json()
			message_dict = json.loads(message)
			message_dict['player_id'] = self.player_id
			message_dict['player_names'] = self.player_name
			message = json.dumps(message_dict)
			await self.send(text_data=message)
			if self.game_state.score[0] >= 11 or self.game_state.score[1] >= 11:
				if self.is_tournament:
					await self.channel_layer.group_send(
						self.game_id,
						{
							'type': 'succ_tournament',
							'message': message
						}
					)
					await self.close(code=4102)
				else:
					await self.channel_layer.group_send(
						self.game_id,
						{
							'type': 'succ_normal',
							'message': message
						}
					)
					await self.close(code=4101)
			else:
				# Send message to the other player
				await self.channel_layer.group_send(
					self.game_id,
					{
						'type': 'game_message',
						'message': message
					}
				)

	# Sync 2 players' data
	async def game_message(self, event):
		async with self.lock:
			message = event['message']
			self.game_state.from_json(message)
	
	async def init_playername(self, event):
		self.player_name = cache.get("game_player_name" + self.game_id, [])

	# Different close code
	async def opponent_disconnect(self, event):
		await self.close(code=4441)
	
	async def succ_normal(self, event):
		message = event['message']
		await self.send(text_data=message)
		await self.close(code=4101)
	
	async def succ_tournament(self, event):
		message = event['message']
		await self.send(text_data=message)
		await self.close(code=4102)

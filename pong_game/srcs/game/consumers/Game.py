from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from ..pong_game import PongGame

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.player_id = 0
		self.game_id = str(self.scope['url_route']['kwargs']['game_id'])
		self.user_token = str(self.scope['url_route']['kwargs']['user_token'])
		self.is_tournament = bool(self.scope['url_route']['kwargs']['is_tournament'])
		self.player_name = ["player1", "player2"]
		if self.user_token == 'guest':
			self.is_tournament = False
		else:
			# Fetch the url in usermanagement to check if the token is valid, if not, reject the connection
			pass
		if not cache.get("game"+self.game_id):
			return
		active_connections = cache.get("game"+self.game_id, 0)

		if active_connections >= 3:
			await self.send(text_data="Waiting for another player...")
			# Reject the connection if 2 connections are already active
			await self.close(code=4002)
			return

		self.player_id = int(active_connections)
		if self.player_id == 2 and cache.get("id_two_set"+self.game_id):
			self.player_id = 1
		elif self.player_id == 2:
			cache.set("id_two_set"+self.game_id, True, timeout=300)
		self.game_state = PongGame()

		# Increment the connection count in the cache atomically
		new_connections = active_connections + 1
		cache.set("game"+self.game_id, new_connections, timeout=300)
		await self.channel_layer.group_add(
			self.game_id,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		active_connections = cache.get("game"+self.game_id, 0)
		if active_connections > 2:
			# Disconnect the other player with error code
			await self.channel_layer.group_send(
				self.game_id,
				{
					'type': 'opponent_disconnect',
				}
			)
		elif active_connections != 0:
			# Remove the key if this is the last connection
			cache.delete("game"+self.game_id)
		if self.player_id == 2 and cache.get("id_two_set"+self.game_id):
			cache.delete("id_two_set"+self.game_id)
		await self.channel_layer.group_discard(
			self.game_id,
			self.channel_name
		)

	async def receive(self, text_data):
		# room expired
		if cache.get("game"+self.game_id, 0) == 0:
			self.close(code=442)
		# Block if the connections are less than 2
		if int(cache.get("game"+self.game_id)) < 3:
			return

		game_data = json.loads(text_data)
		self.game_state.game_loop(game_data['paddle_pos'], self.player_id)
		message = self.game_state.to_json()
		message_dict = json.loads(message)
		message_dict['player_id'] = self.player_id
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
				self.close(code=102)
			else:
				await self.channel_layer.group_send(
					self.game_id,
					{
						'type': 'succ_normal',
						'message': message
					}
				)
				self.close(code=101)
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
		message = event['message']
		self.game_state.from_json(message)

	# Different close code
	async def opponent_disconnect(self, event):
		self.close(code=441)
	async def succ_normal(self, event):
		message = event['message']
		self.send(text_data=message)
		self.close(code=101)
	async def succ_tournament(self, event):
		message = event['message']
		self.send(text_data=message)
		self.close(code=102)


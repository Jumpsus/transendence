from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from ..pong_game import PongGame

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.player_id = 0
		self.game_id = str(self.scope['url_route']['kwargs']['game_id'])
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
			# Decrement the connection count in the cache
			cache.set("game"+self.game_id, active_connections - 1, timeout=300)
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
		# Block if the connections are less than 2
		if int(cache.get("game"+self.game_id)) < 3:
			return

		game_data = json.loads(text_data)
		self.game_state.game_loop(game_data['paddle_pos'], self.player_id)
		message = self.game_state.to_json()
		message_dict = json.loads(message)
		message_dict['player_id'] = self.player_id
		message = json.dumps(message_dict)
		# Send message to room group
		await self.channel_layer.group_send(
			self.game_id,
			{
				'type': 'game_message',
				'message': message
			}
		)
		await self.send(text_data=message)

	# Receive message from room group
	async def game_message(self, event):
		message = event['message']
		self.game_state.from_json(message)



# mygame/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from .pong_game import PongGame
import redis  # Assuming Redis is used as a caching backend

# Setup Redis connection directly for locking
redis_instance = redis.StrictRedis(host='redis', port=6379, db=0, decode_responses=True)

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.player_id = 0
		self.game_id = str(self.scope['url_route']['kwargs']['game_id'])
		if not cache.get(self.game_id):
			return
		# Using Redis locking to handle race conditions
		lock = redis_instance.lock(f"lock:{self.game_id}", timeout=5)
		with lock:
			active_connections = cache.get(self.game_id, 0)

			if active_connections >= 3:
				# Reject the connection if 2 connections are already active
				await self.close(code=4002)
				return

			self.player_id = int(active_connections)
			if self.player_id == 2 and cache.get("id_two_set"):
				self.player_id = 1
			elif self.player_id == 2:
				cache.set("id_two_set", True, timeout=300)
			self.game_state = PongGame()

			# Increment the connection count in the cache atomically
			new_connections = active_connections + 1
			cache.set(self.game_id, new_connections, timeout=300)
		await self.channel_layer.group_add(
			self.game_id,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		lock = redis_instance.lock(f"lock:{self.game_id}", timeout=5)
		with lock:
			active_connections = cache.get(self.game_id, 0)
			if active_connections > 2:
				# Decrement the connection count in the cache
				cache.set(self.game_id, active_connections - 1, timeout=300)
			elif active_connections != 0:
				# Remove the key if this is the last connection
				cache.delete(self.game_id)
			if self.player_id == 2 and cache.get("id_two_set"):
				cache.delete("id_two_set")
		await self.channel_layer.group_discard(
			self.game_id,
			self.channel_name
		)

	# Existing methods for receive and game_message

	# Receive message from WebSocket
	async def receive(self, text_data):
		# lock = redis_instance.lock(f"lock:{self.game_id}", timeout=5)
		# with lock:
		if int(cache.get(self.game_id)) < 3:
			return
		# Send message to room group
		text_data_json = json.loads(text_data)


		lock = redis_instance.lock(f"lock:{self.game_id}game_state", timeout=5)
		with lock:
			self.game_state.from_json(str(cache.get(self.game_id+'game_state')))
			self.game_state.game_loop(text_data_json['paddle_pos'], self.player_id)
			message = self.game_state.to_json()
			cache.set(self.game_id+'game_state', message, timeout=300)
		await self.channel_layer.group_send(
			self.game_id,
			{
				'type': 'game_message',
				'message': message
			}
		)

	# Receive message from room group
	async def game_message(self, event):
		message = event['message']
		message_dict = json.loads(message)
		message_dict['player_id'] = self.player_id
		message = json.dumps(message_dict)
		# Send message to WebSocket
		await self.send(text_data=message)

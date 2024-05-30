import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django_redis import get_redis_connection

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'game_{self.game_id}'

        # Check if game_id is in cache
        redis_conn = get_redis_connection("default")
        if not redis_conn.exists(f"game:{self.game_id}:players"):
            # If game_id is not in cache, refuse connection
            await self.close()
            return

        # Increment player count and check if more than 2 players are trying to connect
        players = redis_conn.incr(f"game:{self.game_id}:players")
        if players > 2:
            # If more than 2 players, decrement count and refuse connection
            redis_conn.decr(f"game:{self.game_id}:players")
            await self.close()
            return

        # Assign player ID based on the order of connection
        self.player_id = f"player{players}"

        # Join game group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        if players == 2:
            # Notify both players that the game can start
            redis_conn.publish(f'game_channel_{self.game_id}', json.dumps({'type': 'start'}))

    async def disconnect(self, close_code):
        # Decrement player count in Redis
        redis_conn = get_redis_connection("default")
        redis_conn.decr(f"game:{self.game_id}:players")

        # Leave game group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        redis_conn = get_redis_connection("default")
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Store received data in Redis
        redis_conn.set(f"game:{self.game_id}:{self.player_id}_data", message)

        # Check if both players have sent their data
        player1_data = redis_conn.get(f"game:{self.game_id}:player1_data")
        player2_data = redis_conn.get(f"game:{self.game_id}:player2_data")

        if player1_data and player2_data:
            # If both players have sent their data, notify both players
            combined_data = {
                'player1_data': player1_data.decode('utf-8'),
                'player2_data': player2_data.decode('utf-8')
            }
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_message',
                    'message': combined_data
                }
            )

    # Receive message from room group
    async def game_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def game_start(self, event):
        message = event['message']

        # Send start message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def game_close(self, event):
        message = event['message']

        # Send close message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
        # Close WebSocket connection
        await self.close()

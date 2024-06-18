import asyncio
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from ..models import join_room, leave_room, TournamentData

logger = logging.getLogger(__name__)

class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.player_name = self.scope['url_route']['kwargs']['player_name']
        self.room_id = await sync_to_async(join_room)(self.player_name)
        self.room_group_name = f'room_{self.room_id}'
        self.check_task = None

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Start the periodic check task
        self.check_task = asyncio.create_task(self.check_players())

    async def disconnect(self, close_code):
        await sync_to_async(leave_room)(self.player_name, self.room_id)

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        if self.check_task:
            self.check_task.cancel()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def check_players(self):
        while True:
            try:
                tournament = await sync_to_async(TournamentData.load)(self.room_id)
                if tournament:
                    num_players = len(tournament.player_names)
                    if num_players < 4:
                        await self.send(text_data=json.dumps({
                            'message': f'{num_players} players connected, waiting for more players...'
                        }))
                    else:
                        await self.send(text_data=json.dumps({
                            'message': '4 players connected, game starting soon...'
                        }))
                await asyncio.sleep(1)  # Check every 1 seconds
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in check_players: {e}")
                break

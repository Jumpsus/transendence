import redis
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Run the Redis subscriber for game notifications'

    def handle(self, *args, **kwargs):
        redis_conn = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
        pubsub = redis_conn.pubsub()
        pubsub.psubscribe('game_channel_*')

        self.stdout.write(self.style.SUCCESS('Starting Redis subscriber...'))

        for message in pubsub.listen():
            if message['type'] == 'pmessage':
                channel_layer = get_channel_layer()
                channel = message['channel'].decode()
                game_id = channel.split('_')[-1]

                # Check if both players have sent their data
                player1_data = redis_conn.get(f"game:{game_id}:player1_data")
                player2_data = redis_conn.get(f"game:{game_id}:player2_data")

                if player1_data and player2_data:
                    combined_data = {
                        'player1_data': player1_data.decode('utf-8'),
                        'player2_data': player2_data.decode('utf-8')
                    }

                    # Notify both players with the combined data
                    async_to_sync(channel_layer.group_send)(
                        f'game_{game_id}',
                        {
                            'type': 'game_message',
                            'message': combined_data
                        }
                    )

                    # Notify both players to close the connection
                    async_to_sync(channel_layer.group_send)(
                        f'game_{game_id}',
                        {
                            'type': 'game_close',
                            'message': 'Game is finished. Closing connection.'
                        }
                    )

                    # Clean up the game data from Redis
                    redis_conn.delete(f"game:{game_id}:player1_data")
                    redis_conn.delete(f"game:{game_id}:player2_data")
                    redis_conn.delete(f"game:{game_id}:players")

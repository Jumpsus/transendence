import redis
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def redis_subscriber():
    redis_conn = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
    pubsub = redis_conn.pubsub()
    pubsub.psubscribe('game_channel_*')

    for message in pubsub.listen():
        if message['type'] == 'pmessage':
            channel_layer = get_channel_layer()
            game_id = message['channel'].decode().split('_')[-1]
            async_to_sync(channel_layer.group_send)(
                f'game_{game_id}',
                {
                    'type': 'game_start',
                    'message': 'Game can start now!'
                }
            )

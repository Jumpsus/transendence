# core/asgi.py

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
from game.consumers.Game import GameConsumer
from game.consumers.Tournament import TournamentConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': URLRouter([
        path('<uuid:game_id>/', GameConsumer.as_asgi()),
        path('<str:player_name>/', TournamentConsumer.as_asgi()),
    ]),
})

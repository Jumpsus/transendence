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
        path('<uuid:game_id>/<str:user_token>/<int:is_tournament>/', GameConsumer.as_asgi()),
        path('<str:user_token>/', TournamentConsumer.as_asgi()),
    ]),
})

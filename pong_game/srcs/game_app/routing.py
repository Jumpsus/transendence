from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/pong', consumers.PongConsumer),
    # re_path(r'^ws/pong/(?P<game_id>[^/]+)/$', consumers.GameConsumer.as_asgi()),
]
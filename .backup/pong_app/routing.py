from django.urls import re_path

from . import consumers

websocker_urlpatterns = [
    re_path(r'^ws/pong/(?P<room_name>[^/]+)/$', consumers.ChatConsumer.as_asgi()),
]
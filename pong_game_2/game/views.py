from django.shortcuts import render
from django.http import JsonResponse
from django_redis import get_redis_connection
import uuid

def create_game(request):
    redis_conn = get_redis_connection("default")
    game_id = str(uuid.uuid4().int)  # Generate a unique game_id
    redis_conn.set(f"game:{game_id}:players", 0)
    return JsonResponse({"game_id": game_id})

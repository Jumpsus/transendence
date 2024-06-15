from django.http import JsonResponse
from django.core.cache import cache
import uuid
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def generate_game_id(request):
	unique_id = uuid.uuid4()  # Generates a unique UUID
	cache.set(str(unique_id), 1, timeout=300)  # Store in cache for 5 mins
	cache.set(str(unique_id)+'game_state', '{"WIDTH": 800, "HEIGHT": 600, "PADDLE_WIDTH": 10, "PADDLE_HEIGHT": 100, "BALL_SIZE": 10, "paddle_pos": [250, 250], "ball_pos": [400, 300], "ball_vel": [4, -4], "score1": 0, "score2": 0}', timeout=300)
	return JsonResponse({'game_id': str(unique_id)})

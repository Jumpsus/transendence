from django.http import JsonResponse
from django.core.cache import cache
import uuid
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def generate_game_id(request):
	unique_id = uuid.uuid4()  # Generates a unique UUID
	cache.set(str(unique_id), 1, timeout=300)  # Store in cache for 5 mins
	cache.set(str(unique_id)+'game_state', '{"PADDLE_HEIGHT": 20, "paddle_pos": [50, 50], "ball_pos": [50, 50], "score1": 0, "score2": 0}', timeout=300)
	return JsonResponse({'game_id': str(unique_id)})

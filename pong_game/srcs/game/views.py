from django.http import JsonResponse, HttpResponse
from django.core.cache import cache
import uuid
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def generate_game_id(request):
	unique_id = uuid.uuid4()  # Generates a unique UUID
	cache.set("game"+str(unique_id), 1, timeout=300)  # Store in cache for 5 mins
	return JsonResponse({'game_id': str(unique_id)})


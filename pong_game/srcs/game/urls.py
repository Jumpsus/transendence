from django.urls import path
from .views import generate_game_id

urlpatterns = [
	path('create-game/', generate_game_id, name='create-game'),
]


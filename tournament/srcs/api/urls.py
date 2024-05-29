from django.urls import path
from api.views.tournament_views import TournamentView, ManageTournamentView
from api.views.player_views import PlayerView

urlpatterns = [
    path('', TournamentView.as_view(), name='tournament'),
    # path('<int:tour_id>/', ManageTournamentView.as_view(), name='manage_tournament'),
    path('<int:pk>/players', PlayerView.as_view(), name='player'),
]
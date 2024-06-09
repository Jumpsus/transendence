from django.urls import path
from api.views.tournament_views import TournamentView, ManageTournamentView
from api.views.player_views import PlayerView
from api.views.start_view import StartTournamentView

# API Endpoints (refered from https://github.com/david-torres/tournament-organizer)
# Method 	Endpoint 	                    Description
# GET       /tournaments                    List all tournaments, exclude 
# POST 	    /tournaments 	                Create a new tournament
# GET 	    /tournaments/:id/participants 	Get a list of tournament participants
# POST 	    /tournaments/:id/participants 	Add a member to a tournament
# POST 	    /tournaments/:id/start 	        Generate matches to start a tournament
# PATCH     /tournaments/:id/start          Check the tournament, then start
# GET 	    /tournaments/:id/matches 	    Get the list of matches for a tournament
# PATCH 	/tournaments/:id/matches/:id 	Update a match (set the winner)

urlpatterns = [
    path('', TournamentView.as_view(), name='tournament'),
    path('<int:pk>/', ManageTournamentView.as_view(), name='manage_tournament'),
    path('<int:pk>/start', StartTournamentView.as_view(), name='tournament_start'),
    path('<int:pk>/players', PlayerView.as_view(), name='player'),
    # path('<int:pk>/matches', MatchesView.as_view(), name='matches'),
    # path('<int:pk>/matches/<int:id>', MatchManageView.as_view(), name='manage_match'),
]
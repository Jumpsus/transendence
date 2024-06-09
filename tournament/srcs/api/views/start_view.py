import math
import random

from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Tournament, Player, BracketPair
from api.get_user import get_jwt
from api.serializer import TournamentSerializer


class StartTournamentView(APIView):
    def post(self, request, pk, format=None):
        tournament = get_tournament_obj(self, pk)
        try:
            players = list(tournament.players.all())
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        if len(players) != 8:
            return Response({'error': 'Tournament must have 8 players to start'}, status=403)
        # group player based on elo
        # try:
        #     players = StartTournamentView.sort_player(request, players)
        # except Exception as e:
        #     return Response({'error': [str(e)]}, status=500)
        # create match brackets
        random.shuffle(players)
        matches = []
        for i in range(0, 3, 1):
            player_1 = players[i]
            player_2 = players[8-1]
            matches.append(
                BracketPair(
                    player1 = player_1,
                    player2 = player_2,
                    tournament = tournament,
                    match_id = i + 1 #1, 2, 3, 4
                ))

    def patch(self, request, pk, format=None):
        tournament = get_tournament_obj(self, pk)
        try:
            players = tournament.players.all()
            brackets = tournament.brackets.all()
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        if tournament.status != Tournament.CREATED:
            return Response({'error': 'Tournament has been started'}, status=403)
        if len(players) != 8:
            return Response({'error': 'Tournament must have 8 players to start'}, status=403)
        if len(brackets) == int(2 ** math.ceil(math.log2(len(players))) - 1):
            return Response({'error': 'Tournmanet matches not created'}, status=403)
        tournament.status = Tournament.IN_PROGRESS

    # @staticmethod
    # def sort_player(request, players: list[Player])->list[Player]:
    #     for player in players:
    #         player.elo = StartTournamentView.get_elo(player, get_jwt(request))
    #         player.save()
    #     players.sort(key=lambda x:x.elo, reverse=True)
    #     return players

    # @staticmethod
    # def get_elo(player: Player, jwt: str) -> int:
    #     headers = {'Authorization': jwt}
    #     response = InternalRequest.get(f'{setting.USER_STATS_USER_ENDPOINT}{player.user_id/}', headers=headers)

    #     if response.status_code == 200:
    #         body = response.json()
    #         return body['elo']
    #     else:
    #         raise Exception(f'Error while getting elo for player {player.user_id}')

def get_tournament_obj(self, pk):
    try:
        return Tournament.objects.get(pk=pk)
    except Tournament.DoesNotExist: 
        return Response({'error': 'The tournament does not exist'}, status=404)
    except Exception as e:
        return Response({'error': [str(e)]}, status=500)

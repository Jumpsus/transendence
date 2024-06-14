from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Tournament, Player
from api.serializer import TournamentSerializer, PlayerSerializer
from api.views.start_view import get_tournament_obj

from typing import Optional

class PlayerView(APIView):
    #list all players in a tournament
    def get(self, request, pk, format=None):
        tournament = get_tournament_obj(self,pk)
        players_data = tournament.players.all()
        p_json = PlayerSerializer(players_data, many=True)
        new_p = list(p_json.data)
        new_p.append({'no_of_players': len(players_data)})
        return Response(new_p, status=200)

    #add a player to a tournament
    def post(self, request, pk, format=None):
        tournament = get_tournament_obj(self,pk)
        player=Player(player_id=request.data.get("player_id"),
                      player_name=request.data.get("player_name"),
                      tournament=tournament)
        p_json = PlayerSerializer(data=request.data)
        #check if player can join a tournament
        can_join, error = PlayerView.CheckTournamentSeat(player, tournament)
        if can_join:
            player.save()
            if p_json.is_valid():
                p_json.save()
        else:
            return Response({'error': [error[0]]}, status=error[1])
        return Response(p_json.data, status=201)
    
    #leave a tournament
    def delete(self, request, pk, format=None):
        tournament = get_tournament_obj(self, pk)
        try:
            check_exist = tournament.players.filter(player_id=request.data.get("player_id"))
        except Player.DoesNotExist:
            return Response({'error': 'user not registered'}, status=404)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        
        if tournament.status != Tournament.CREATED:
            return Response({'errors': "Can't leave"}, status=403)
        try:
            check_exist.delete()
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        return Response({'You left the tournament id `{pk}`'}, status=200)
    
    @staticmethod
    def CheckTournamentSeat(new_player: Player, tournament: Tournament)\
        -> tuple[bool, Optional[list[str | int]]]:
        
        #check if the tournament exist
        try:
            p_tour = tournament.players.all()
        except Exception as e:
            return False, [f'An unexpected error occurred : {e}', 500]
        if tournament.status!=Tournament.CREATED:
            return False, [f'Tournament registration is over', 403]
        
        #check if player already registered to this tournament

        for player in p_tour:
            if player.player_id == new_player.player_id:
                return False, [f'You have been registered as `{player.player_name}` to the tournament', 403]
            if player.player_name == new_player.player_name:
                return False, [f'Found duplicate player name : `{player.player_name}`', 400]
        
        #check if player is in other tournaments
        try:
            other_tournament_check = Tournament.objects.filter(
                players__player_id=1,
                status__in=[Tournament.CREATED, Tournament.IN_PROGRESS]
                ).exists()
        except Exception as e:
            return False, [f'An unexpected error occurred : {e}', 500]
        if other_tournament_check:
            return False, [f'You were registered to other tournaments', 403]
        if len(p_tour) >= 8:
            return False, [f'Tournament is full', 403]
        return True, None

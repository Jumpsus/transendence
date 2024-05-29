from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Tournament
from api.get_user import get_user_id
from api.serializer import TournamentSerializer

class StartTournamentView(APIView):
    def patch(self, request, pk, format=None):
        user_id = get_user_id(request)

        try:
            tournament = Tournament.objects.get(id=pk)
            players = tournament.players.all()
            matches = tournament.matches.all()
        except Tournament.DoesNotExist:
            return Response({'error': [f'tournament id `{pk}` does not exist']}, status=404)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        tournament.status = Tournament.IN_PROGRESS

def get_tournament_obj(self, pk):
    try:
        return Tournament.objects.get(pk=pk)
    except Tournament.DoesNotExist: 
        return Response({'error': 'The tournament does not exist'}, status=404)
    except Exception as e:
        return Response({'error': [str(e)]}, status=500)

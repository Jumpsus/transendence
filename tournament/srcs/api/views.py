import json
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from common.src.jwt_managers import user_authentication

from .models import Tournament, Player, BracketPair


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(user_authentication(['GET', 'POST', 'DELETE']), name='dispatch')

class ViewTournament(View):
    @staticmethod
    def get(request: HttpRequest) -> JsonResponse:
        tournaments = Tournament.objects
        nb_tournaments = len(tournaments)
        response_table = {
            'nb-tournaments': nb_tournaments
            'tournaments': tournaments
        }
        return JsonResponse(response_table, status=200)
    
    @staticmethod
    def post(reqeust: HttpRequest) -> JsonResponse:
        
    

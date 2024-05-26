from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Tournament
from api.get_user import get_user_id
from api.serializer import TournamentSerializer

class TournamentView(APIView):
    
    #list all tournaments
    # @api_view(['GET'])
    def get(self, request, format=None):
        tournaments = Tournament.objects.all()
        t_json = TournamentSerializer(tournaments, many=True)
        return Response(t_json.data, status=200)
    
    #create a tournaments, user must be authenticated before create
    # @api_view(['POST'])
    def post(self, request, format=None):
        user_id = get_user_id(request)

        try:
            # to change request data before serialize
            new_tname = request.data.get("name")
            print(new_tname)
            t_check = Tournament.objects.filter(name=new_tname)
            if t_check:
                return Response(data={'error': 'Tournament name is already exist'}, status=400)
            request.data.update({"admin_id": user_id})
            t_json = TournamentSerializer(data=request.data)
            if t_json.is_valid():
                t_json.save()
            return Response(t_json.data, status=201)
        except Exception as e:
            return Response({'error': [str(e)]},status=500)
    
    #delete all tournaments created by the user
    def delete(self, request, format=None):
        user_id = get_user_id(request)

        try:
            queryset = Tournament.objects.filter(admin_id=user_id, status=Tournament.CREATED)
            queryset.delete()
            return Response(status=204)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)

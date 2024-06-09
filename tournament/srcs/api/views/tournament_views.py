from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Tournament
from api.serializer import TournamentSerializer
from api.views.start_view import get_tournament_obj

class TournamentView(APIView):
    
    #list all tournaments
    # @api_view(['GET'])
    def get(self, request, format=None):
        tournaments = Tournament.objects.all()
        t_json = TournamentSerializer(tournaments, fields=(
            'id', 'name', 'max_players', 'status', 'admin_id', 'created_date'
        ), many=True)
        print(request.headers)
        return Response(t_json.data, status=200)
    
    #create a tournaments, user must be authenticated before create
    # @api_view(['POST'])
    def post(self, request, format=None):
        # user_id = get_user_id(request)

        try:
            # to change request data before serialize
            new_tname = request.data.get("name")
            t_check = Tournament.objects.filter(name=new_tname)
            if t_check:
                return Response({'error': 'Tournament name is already exist'}, status=400)
            # request.data.update({"admin_id": user_id})
            t_json = TournamentSerializer(data=request.data, fields=(
            'name', 'max_players', 'status', 'admin_id', 'created_date'
        ))
            if t_json.is_valid():
                t_json.save()
            return Response(t_json.data, status=201)
        except Exception as e:
            return Response({'error': [str(e)]},status=500)
    
    #delete all tournaments created by the user
    def delete(self, request, format=None):
        #user_id = get_user_id(request)

        try:
            queryset = Tournament.objects.filter(admin_id=request.data.get("admin_id"), status=Tournament.CREATED)
            queryset.delete()
            return Response(status=204)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)

class ManageTournamentView(APIView):
    #get detailed view of tournament
    def get(self, request, pk, format=None):
        obj = get_tournament_obj(self, pk)

        try:
            obj_json = TournamentSerializer(obj, many=False)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        return Response(obj_json.data, status=200)
    #edit detail of tournament    
    def patch(self, request, pk, format=None):
        obj = get_tournament_obj(self, pk)
        obj_json = TournamentSerializer(obj, data=request.data, partial=True)
        if obj_json.is_valid():
            obj_json.save()
            return Response(obj_json.data, status=201)
        return Response({'error': 'bad request'}, status=400)
    #delete tournament by id
    def delete(self, request, pk, format=None):
        obj = get_tournament_obj(self, pk)
        obj.delete()
        return Response({'Tournament `{pk}` has been deleted'}, status=204)
    

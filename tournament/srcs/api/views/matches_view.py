from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Tournament, BracketPair
from api.serializer import BracketSerializer
from api.views.start_view import get_tournament_obj

class MatchesView(APIView):
    #get all matches created in a tournament
    def get(self, request, pk):
        tournament = get_tournament_obj(self, pk)
        matches_data = tournament.matches.all()
        m_json = BracketSerializer(matches_data, fields=(
            'id', 'player1', 'player2'
        ), many=True)
        return Response(m_json.data, status=200)
    
    #delete all matches created in a tournament
    def delete(self, request, pk):
        tournament = get_tournament_obj(self, pk)
        try:
            matches_data = tournament.matches.all()
        except BracketPair.DoesNotExist:
            return Response({'error': 'This tournament dont have match'}, status=404)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        try:
            matches_data.delete()
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        return Response({'All tournament has been deleted'}, status=200)
    
class ManageMatchView(APIView):
    #get a detailed view of a match
    def get(self, request, pk, id):
        tournament = get_tournament_obj(self, pk)
        try:
            match_data = tournament.matches.filter(id=id)
        except BracketPair.DoesNotExist:
            return Response({'error': 'match `{id}` does not exist'}, status=404)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        m_json = BracketSerializer(match_data, many=True)
        return Response(m_json.data, status=200)
    
    #edit information of a match
    def patch(self, request, pk, id):
        tournament = get_tournament_obj(self, pk)
        try:
            match_data = tournament.matches.filter(id=id)
        except BracketPair.DoesNotExist:
            return Response({'error': 'match `{id}` does not exist'}, status=404)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        m_json = BracketSerializer(match_data, data=request.data, partial=True)
        if m_json.is_valid():
            m_json.save()
            return Response(m_json.data, status=201)
        return Response({'error': 'bad request'}, status=400)
    
    #delete a match
    def delete(self, reqeust, pk, id):
        tournament = get_tournament_obj(self, pk)
        try:
            match_data = tournament.matches.filter(id=id)
        except BracketPair.DoesNotExist:
            return Response({'error': 'match `{id}` does not exist'}, status=404)
        except Exception as e:
            return Response({'error': [str(e)]}, status=500)
        match_data.delete()
        return Response({'Match {id} has been deleted'}, status=204)


    
from api.models import Tournament, Player, BracketPair
from rest_framework import serializers

class TournamentSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = '__all__'

    def get_status(self, obj):
        status_string = ['Created', 'In progress', 'Finished']
        return status_string[obj.status]
    
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class BracketSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = BracketPair
        fields = '__all__'

    def get_status(self, obj):
        status_string = ['Not_played', 'In progress', 'Finished']
        return status_string[obj.status]
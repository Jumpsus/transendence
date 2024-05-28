from api.models import Tournament, Player, BracketPair
from rest_framework import serializers

class TournamentSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ('name', 'max_players', 'status', 'admin_id', 'created_date')

    def get_status(self, obj):
        status_string = ['Created', 'In progress', 'Finished']
        return status_string[obj.status]
        
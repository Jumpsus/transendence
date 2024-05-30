from api.models import Tournament, Player, BracketPair
from rest_framework import serializers
    
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

#TournamentSerializer class in a Dynamic Field Model Serializer, because I want to write it for both overview and detailed view
class TournamentSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """
    status = serializers.SerializerMethodField()
    players = PlayerSerializer(many=True)
    brackets = BracketSerializer(many=True)

    class Meta:
        model = Tournament
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

    def get_status(self, obj):
        status_string = ['Created', 'In progress', 'Finished']
        return status_string[obj.status]
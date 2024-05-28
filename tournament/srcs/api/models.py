from django.db import models

# SIZE_CHOICES = (
#     (4, 4),
#     (8, 8),
#     (16, 16),
# )

class Tournament(models.Model):
    CREATED = 0
    IN_PROGRESS = 1
    FINISNED = 2

    name = models.CharField(max_length=200)
    max_players = models.IntegerField(default=8)
    status = models.IntegerField(default=CREATED)
    admin_id = models.BigIntegerField(default=0)
    created_date = models.DateField(auto_now_add=True)

class Player(models.Model):
    player_name = models.CharField(max_length=200)
    elo = models.IntegerField(null=True)
    rank = models.IntegerField(null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='players')

class BracketPair(models.Model):
    NOT_PLAYED=0
    IN_PROGRESS=1
    FINISHED=2
    
    player1 = models.ForeignKey(Player, related_name='player_1', null=True, on_delete=models.SET_NULL)
    player1_score = models.IntegerField(null=True)
    player2 = models.ForeignKey(Player, related_name='player_2', null=True, on_delete=models.SET_NULL)
    player2_score = models.IntegerField(null=True)
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name='winner')
    match_id = models.IntegerField()
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournament')
    status = models.IntegerField(default=NOT_PLAYED)


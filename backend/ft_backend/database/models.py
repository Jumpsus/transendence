from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

def rename_avatar(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return 'avatars/' + filename

class Account(AbstractUser):
    bio = models.TextField(max_length=200, blank=True)
    game_played = models.IntegerField(default=0)
    game_won = models.IntegerField(default=0)
    game_lost = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to=rename_avatar, null=True, blank=True)
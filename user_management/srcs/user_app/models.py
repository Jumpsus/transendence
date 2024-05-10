from django.db import models

from django.db import models

# Create your models here.
class UserManagement(models.Model):
    user_id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=16, unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=1)
    image = models.CharField(max_length=255)
    status = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=255)
    last_activity = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class MatchHistory(models.Model):
    _id = models.BigAutoField(primary_key=True)
    user_w = models.ForeignKey(UserManagement,on_delete=models.CASCADE,related_name='user_w')
    user_l = models.ForeignKey(UserManagement,on_delete=models.CASCADE,related_name='user_l')
    score_w = models.IntegerField()
    score_l = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class ChatHistory(models.Model):
    _id = models.BigAutoField(primary_key=True)
    sender_id = models.ForeignKey(UserManagement,on_delete=models.CASCADE,related_name='sender_id')
    receiver_id = models.ForeignKey(UserManagement,on_delete=models.CASCADE,related_name='receiver_id')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class FriendManagement(models.Model):
    _id = models.BigAutoField(primary_key=True)
    user_a = models.ForeignKey(UserManagement,on_delete=models.CASCADE,related_name='user_a')
    user_b = models.ForeignKey(UserManagement,on_delete=models.CASCADE,related_name='user_b')
    action = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


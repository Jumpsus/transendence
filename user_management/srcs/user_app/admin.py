from django.contrib import admin
from user_app.models import UserManagement, MatchHistory, ChatHistory, FriendManagement

# Register your models here.
admin.site.register(UserManagement)
admin.site.register(MatchHistory)
admin.site.register(ChatHistory)
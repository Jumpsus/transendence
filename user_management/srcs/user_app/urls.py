from django.urls import path
from user_app import views

urlpatterns = [
    path('status', views.status, name='status'),
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('loginlist', views.loginlist, name='loginlist'), #TODO: delete after test
    path('getinfo', views.get_info, name='getinfo'),
    path('updateinfo', views.update_info, name='updateinfo'),
    path('getotherinfo', views.get_other_info, name='getotherinfo'),
    path('addfriend', views.add_friend, name='add_friend'),
    path('blockuser', views.block_user, name='block_user'),
    path('friendlist', views.friend_list, name='friend_list'),
]
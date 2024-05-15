from django.urls import path
from user_app import views

urlpatterns = [
    path('status', views.status, name='status'),
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('loginlist', views.loginlist, name='loginlist'), #TODO: delete after test
    path('getinfo', views.getinfo, name='getinfo'),
    path('updateinfo', views.updateinfo, name='updateinfo'),
    path('getotherinfo', views.get_other_info, name='getotherinfo'),
]
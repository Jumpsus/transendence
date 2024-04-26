from django.urls import path
from pong_app import views

urlpatterns = [
    path('status', views.status, name='status'),
    path('index', views.index, name='index'),
    path('test', views.test, name='test'),
]
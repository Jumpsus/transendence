from django.urls import path
from user_app import views

urlpatterns = [
    path('status', views.status, name='status'),
]
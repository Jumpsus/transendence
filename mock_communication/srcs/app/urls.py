from django.urls import path
from app.views import mock
urlpatterns = [
    path('status', mock.status, name='status'),
    path('solution_A', mock.solution_A, name='solution_A'),
    path('solution_B', mock.solution_B, name='solution_B'),
]
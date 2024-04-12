from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def status(req):
    return HttpResponse("ok")

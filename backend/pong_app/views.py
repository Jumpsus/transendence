from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def status(req):
    return HttpResponse("ok")

def index(req):
    print(req)

    my_dict = {'insert_me':"Hello fill the index template"}
    return render(req, 'pong/index.html', context=my_dict)

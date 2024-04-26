from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from pong_app import utils

# Create your views here.

def status(req):
    return HttpResponse("ok")

def index(req):
    print(req)

    my_dict = {'insert_me':"Hello fill the index template"}
    return render(req, 'pong/index.html', context=my_dict)

@csrf_exempt
def test(req):
    print("Hi")
    print(req)
    print(req.body)
    body = utils.getJsonBody(req.body)
    try:
        print(body["hi"])
        print(body["low"])
    except:
        return HttpResponse("not expect req")
    return HttpResponse("ok")

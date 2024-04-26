from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from user_app.models import UserManagement
from pong_app import utils
import json

# Create your views here.
def status(req):
    return HttpResponse("ok")

@csrf_exempt
def login(req):
    try:
        body = utils.getJsonBody(req.body)
        user = body["username"]
        passwd = body["password"]
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    u = UserManagement.objects.filter(username = user, password = passwd)

    if len(u) == 0:
        return utils.reponseJsonErrorMessage(400, "11", "Mismatch username or password")

    return utils.reponseJsonErrorMessage(400, "00", "Success")

@csrf_exempt
def register(req):
    
    try:
        body = utils.getJsonBody(req.body)
        user = body["username"]
        passwd = body["password"]
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    u = UserManagement.objects.filter(username = user)
    if len(u) != 0:
        return utils.reponseJsonErrorMessage(400, "12", "Username already exists")

    try:
        new_user = UserManagement(username = user, password = passwd)
        new_user.save()
    except:
        return utils.reponseJsonErrorMessage(400, "20", "Internal error")
    
    return utils.reponseJsonErrorMessage(400, "00", "Success")

#TODO: delete after test
def loginlist(req):
    u = UserManagement.objects.all()

    user_list = []
    for user in u:
        d = {"username": user.username, "password": user.password}
        user_list.append(d)

    response_data = {}
    response_data["code"] = "00"
    response_data["user_list"] = user_list
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

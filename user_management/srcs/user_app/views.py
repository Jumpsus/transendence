from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from user_app.models import UserManagement
from user_project import utils
from datetime import datetime
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

    response = utils.reponseJsonErrorMessage(200, "00", "Success")
    req.session["username"] = user
    req.session.modified = True

    return response

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
        return utils.reponseJsonErrorMessage(500, "20", "Internal error")
    
    req.session["username"] = user
    req.session.modified = True
    return utils.reponseJsonErrorMessage(200, "00", "Success")

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

def getinfo(req):
    try:
        user = req.session["username"]
    except KeyError:
        print ("No session found")
        return utils.reponseJsonErrorMessage(400, "10", "Invalid Request")

    u = UserManagement.objects.filter(username = user)

    if len(u) == 0:
        return utils.reponseJsonErrorMessage(400, "13", "User Not Found")

    response_data = {}
    response_data["code"] = "00"
    response_data["name"] = u[0].name
    response_data["last_name"] = u[0].last_name
    response_data["phone_number"] = u[0].phone_number
    response_data["tag"] = u[0].tag
    response_data["win"] = 0
    response_data["lose"] = 0
    response_data["level"] = 0
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)


@csrf_exempt
def updateinfo(req):

    try:
        body = utils.getJsonBody(req.body)
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    try:
        user = req.session["username"]
    except KeyError:
        print ("No session found")
        return utils.reponseJsonErrorMessage(400, "10", "Invalid Request")

    u = UserManagement.objects.filter(username = user)

    if len(u) == 0:
        return utils.reponseJsonErrorMessage(400, "13", "User Not Found")

    try:
        u[0].name = body["name"]
    except:
        u[0].name = ""

    try:
        u[0].last_name = body["last_name"]
    except:
        u[0].last_name = ""

    try:
        u[0].phone_number = body["phone_number"]
    except:
        u[0].phone_number = ""

    try:
        u[0].tag = body["tag"]
    except:
        u[0].tag = ""

    try:
        u[0].save()
    except:
        return utils.reponseJsonErrorMessage(500, "20", "Internal error")

    return utils.reponseJsonErrorMessage(200, "00", "Success")

def logout(req):
    try:
        del req.session["username"]
        del req.session["last_login"]
    except KeyError:
        pass
    return utils.reponseJsonErrorMessage(200, "00", "Success")
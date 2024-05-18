from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from user_app.models import UserManagement
from user_project import utils
from datetime import datetime
from user_app import database
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

    u = database.find_user_by_username_passwd(user, passwd)

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

    u = database.find_user_by_username(user)
    if len(u) != 0:
        return utils.reponseJsonErrorMessage(400, "12", "Username already exists")

    if database.create_user(user, passwd) != True:
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

def get_info(req):
    try:
        user = req.session["username"]
    except KeyError:
        return utils.reponseJsonErrorMessage(400, "30", "Invalid Session")

    u = database.find_user_by_username(user)

    if len(u) == 0:
        return utils.reponseJsonErrorMessage(400, "13", "User Not Found")

    response_data = {}
    response_data["code"] = "00"
    response_data["username"] = u[0].username
    response_data["name"] = u[0].name
    response_data["last_name"] = u[0].last_name
    response_data["phone_number"] = u[0].phone_number
    response_data["tag"] = u[0].tag
    response_data["win"] = 0
    response_data["lose"] = 0
    response_data["level"] = 0
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def update_info(req):

    try:
        body = utils.getJsonBody(req.body)
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    try:
        user = req.session["username"]
    except KeyError:
        return utils.reponseJsonErrorMessage(400, "30", "Invalid Session")

    u = database.find_user_by_username(user)

    if len(u) == 0:
        return utils.reponseJsonErrorMessage(400, "13", "User Not Found")

    try:
        name = body["name"]
    except:
        name = ""

    try:
        last_name = body["last_name"]
    except:
        last_name = ""

    try:
        phone_number = body["phone_number"]
    except:
        phone_number = ""

    try:
        tag = body["tag"]
    except:
        tag = ""

    if database.edit_user(u[0], name, last_name, phone_number, tag) != True:
        return utils.reponseJsonErrorMessage(500, "20", "Internal error")

    return utils.reponseJsonErrorMessage(200, "00", "Success")

@csrf_exempt
def get_other_info(req):

    try:
        body = utils.getJsonBody(req.body)
        other_user = body["username"]
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    # try:
    #     user = req.session["username"]
    # except KeyError:
    #     print ("No session found")
    #     return utils.reponseJsonErrorMessage(400, "10", "Invalid Request")

    u = database.find_user_by_username(other_user)

    if len(u) == 0:
        return utils.reponseJsonErrorMessage(400, "13", "User Not Found")

    response_data = {}
    response_data["code"] = "00"
    response_data["username"] = u[0].username
    response_data["name"] = u[0].name
    response_data["last_name"] = u[0].last_name
    response_data["phone_number"] = u[0].phone_number
    response_data["tag"] = u[0].tag
    response_data["win"] = 0
    response_data["lose"] = 0
    response_data["level"] = 0
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def add_friend(req):
    #get other_username
    try:
        body = utils.getJsonBody(req.body)
        add_user = body["username"]
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    #get my_username
    try:
        current_user = req.session["username"]
    except KeyError:
        return utils.reponseJsonErrorMessage(400, "30", "Invalid Session")
    
    # validate username
    if add_user == current_user:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    add_u = database.find_user_by_username(add_user)
    u = database.find_user_by_username(current_user)

    if len(add_u) == 0:
        return utils.reponseJsonErrorMessage(400, "13", "User Not Found")
    elif len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    # add friend
    if database.add_friend(u[0], add_u[0]) == False:
        return utils.reponseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.reponseJsonErrorMessage(200, "00", "Success")

@csrf_exempt
def block_user(req):
    #get other_username
    try:
        body = utils.getJsonBody(req.body)
        block_user = body["username"]
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    #get my_username
    try:
        current_user = req.session["username"]
    except KeyError:
        return utils.reponseJsonErrorMessage(400, "30", "Invalid Session")
    
    # validate username
    if block_user == current_user:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    block_u = database.find_user_by_username(block_user)
    u = database.find_user_by_username(current_user)

    if len(block_u) == 0:
        return utils.reponseJsonErrorMessage(400, "13", "User Not Found")
    elif len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    # add friend
    if database.add_friend(u[0], block_u[0]) == False:
        return utils.reponseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.reponseJsonErrorMessage(200, "00", "Success")

def friend_list(req):
    try:
        current_user = req.session["username"]
    except KeyError:
        return utils.reponseJsonErrorMessage(400, "30", "Invalid Session")

    u = database.find_user_by_username(current_user)
    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    friends = database.find_frend(u[0])
    
    friend_list = []
    for friend in friends:
        if friend.action == "add_friend": #to do change to friend
            if friend.user_a.username == u[0].username:
                data = {"username": friend.user_b.username}
            else:
                data = {"username": friend.user_a.username}
            friend_list.append(data)

    response_data = {}
    response_data["code"] = "00"
    response_data["friend_list"] = friend_list
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def change_password(req):
    try:
        body = utils.getJsonBody(req.body)
        old_passwd = body ["old_password"]
        passwd = body["password"]
    except:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    if len(passwd) == 0 or len(old_passwd) == 0:
        return utils.reponseJsonErrorMessage(400, "10", "Invalid request")

    try:
        current_user = req.session["username"]
    except KeyError:
        return utils.reponseJsonErrorMessage(400, "30", "Invalid Session")

    u = database.find_user_by_username(current_user)

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    if u[0].password != old_passwd:
        return utils.reponseJsonErrorMessage(400, "14", "Incorrect Password")

    if database.update_password(u[0], passwd) == False:
        return utils.reponseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.reponseJsonErrorMessage(200, "00", "Success")

def logout(req):
    try:
        del req.session["username"]
        req.session.set_expiry(0)
        req.session.modified = True
    except KeyError:
        pass
    return utils.reponseJsonErrorMessage(200, "00", "Success")
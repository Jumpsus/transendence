from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from user_app.models import UserManagement
from datetime import datetime
from user_app import utils, database, jwt_handler
from user_app.views import friend_management, validator
import json
import requests

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
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    u = database.find_user_by_username_passwd(user, passwd)

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "11", "Mismatch username or password")

    response = utils.responseJsonErrorMessage(200, "00", "Success")
    req.session["username"] = user
    req.session.modified = True

    jti = jwt_handler.generate_jti(user)
    access_token = jwt_handler.encode_user(user, jti)

    if database.stamp_jti(u[0], jti) != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    response_data = {
        "code": "00",
        "message": "Success",
        "token": access_token,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)


@csrf_exempt
def register(req):
    try:
        body = utils.getJsonBody(req.body)
        user = body["username"]
        passwd = body["password"]
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    u = database.find_user_by_username(user)
    if len(u) != 0:
        return utils.responseJsonErrorMessage(400, "12", "Username already exists")

    jti = jwt_handler.generate_jti(user)
    access_token = jwt_handler.encode_user(user, jti)

    if database.create_user(user, passwd, jti = jti) != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")
    
    req.session["username"] = user
    req.session.modified = True

    response_data = {
        "code": "00",
        "message": "Success",
        "token": access_token,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

#TODO: delete after test
def loginlist(req):
    u = UserManagement.objects.all()

    user_list = []
    for user in u:
        d = {"username": user.username, "password": user.password}
        user_list.append(d)

    response_data = {
        "code": "00",
        "user_list": user_list,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def user_list(req):

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    try:
        body = utils.getJsonBody(req.body)
        type = body["type"]
    except:
        type = ""

    user_list = []

    match type:
        case "":
            users = UserManagement.objects.all()
            for user in users:
                d = {"username": user.username, "image": user.image ,"status": "offline"}
                user_list.append(d)
        
        case "friend":
            friends = database.find_friend(u[0])
            for friend in friends:
                if friend.user_a == u[0]:
                    d = {"username": friend.user_b.username, "image": friend.user_b.image ,"status": "offline"}
                else:
                    d = {"username": friend.user_a.username, "image": friend.user_a.image ,"status": "offline"}
                user_list.append(d)
        
        case "add":
            friends = database.find_friends_by_action_user(u[0], "pending")
            for friend in friends:
                d = {"username": friend.user_b.username, "image": friend.user_b.image ,"status": "offline"}
                user_list.append(d)
        
        case "pending":
            friends = database.find_friends_by_actioned_user(u[0], "pending")
            for friend in friends:
                d = {"username": friend.user_a.username, "image": friend.user_a.image ,"status": "offline"}
                user_list.append(d)
        
        case "block":
            friends = database.find_friends_by_action_user(u[0], "block")
            for friend in friends:
                d = {"username": friend.user_b.username, "image": friend.user_b.image ,"status": "offline"}
                user_list.append(d)
        
        case _:
           return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    response_data = {}
    response_data["code"] = "00"
    response_data["user_list"] = user_list
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

def get_info(req):
    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    response_data = {
        "code" : "00",
        "username" : u[0].username,
        "name" : u[0].name,
        "last_name" : u[0].last_name,
        "phone_number" : u[0].phone_number,
        "tag" : u[0].tag,
        "image" : u[0].image,
        "win" : 0,
        "lose" : 0,
        "level" : 0,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def update_info(req):

    try:
        body = utils.getJsonBody(req.body)
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

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
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    return utils.responseJsonErrorMessage(200, "00", "Success")

@csrf_exempt
def get_other_info(req):

    try:
        body = utils.getJsonBody(req.body)
        other_user = body["username"]
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    other_u = database.find_user_by_username(other_user)
    if len(other_u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    relation = friend_management.map_relation(u[0], other_u[0])

    response_data = {}
    response_data["code"] = "00"
    response_data["username"] = other_u[0].username
    response_data["name"] = other_u[0].name
    response_data["last_name"] = other_u[0].last_name
    response_data["phone_number"] = other_u[0].phone_number
    response_data["tag"] = other_u[0].tag
    response_data["image"] = other_u[0].image
    response_data["win"] = 0
    response_data["lose"] = 0
    response_data["level"] = 0
    response_data["relation"] = relation
    response_data["status"] = "offline" # TODO handle this case
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def change_password(req):
    try:
        body = utils.getJsonBody(req.body)
        old_passwd = body ["old_password"]
        passwd = body["password"]
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    if len(passwd) == 0 or len(old_passwd) == 0:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    # validate password
    if u[0].password != old_passwd:
        return utils.responseJsonErrorMessage(400, "14", "Incorrect Password")

    if database.update_password(u[0], passwd) == False:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")

@csrf_exempt
def logout(req):

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    temp_jti = jwt_handler.generate_jti(u[0].username)
    if database.stamp_jti(u[0], temp_jti) != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")
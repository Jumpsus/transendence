from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from jsonschema import validate
from user_app import utils, database, jwt_handler
from user_app.models import UserManagement
from user_app.views import friend_management, validator
from user_project import settings
import json
import requests

# Create your views here.
def status(req):
    return HttpResponse("ok")

@csrf_exempt
def login(req):
    if req.method != 'POST':
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    try:
        body = utils.getJsonBody(req.body)
        schema = {
            "type" : "object",
            "properties" : {
                "username": {"type" : "string"},
                "password": {"type" : "string"},
            },
            "required": ["username", "password"]
        }

        validate(instance=body, schema=schema)
        user = body.get("username")
        pure_passwd = body.get("password")

        if len(user) == 0 or len(pure_passwd) == 0:
            return utils.responseJsonErrorMessage(400, "19", "Username or Password cannot be empty")

        passwd = str(hash(pure_passwd + settings.SECRET_KEY))
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    u = database.find_user_by_username_passwd(user, passwd)

    if len(u) == 0:
        return utils.responseJsonErrorMessage(401, "11", "Invalid username or password")

    response = utils.responseJsonErrorMessage(200, "00", "Success")

    jti = jwt_handler.generate_jti(user)
    access_token = jwt_handler.encode_user(user, jti)

    if database.stamp_jti(u[0], jti) != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    if database.update_status(u[0], "online") != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")
    response_data = {
        "code": "00",
        "message": "Success",
        "token": access_token,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)


@csrf_exempt
def register(req):
    if req.method != 'POST':
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    try:
        body = utils.getJsonBody(req.body)
        schema = {
            "type" : "object",
            "properties" : {
                "username": {"type" : "string"},
                "password": {"type" : "string"},
            },
            "required": ["username", "password"]
        }

        validate(instance=body, schema=schema)
        user = body.get("username")
        pure_passwd = body.get("password")

        if len(pure_passwd) < 5:
            return utils.responseJsonErrorMessage(400, "18", "Password must be at least 5 characters")
        if len(user) == 0 or len(pure_passwd) == 0:
            return utils.responseJsonErrorMessage(400, "19", "Username or Password cannot be empty")
        
        passwd = str(hash(pure_passwd + settings.SECRET_KEY))
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    u = database.find_user_by_username(user)
    if len(u) != 0:
        return utils.responseJsonErrorMessage(400, "12", "Username already exists")

    jti = jwt_handler.generate_jti(user)
    access_token = jwt_handler.encode_user(user, jti)

    if database.create_user(user, passwd, jti = jti) != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    response_data = {
        "code": "00",
        "message": "Success",
        "token": access_token,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def user_list(req):
    if req.method != 'POST' and req.method != 'GET' :
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    try:
        body = utils.getJsonBody(req.body)
        type = body.get("type", "")
    except:
        type = ""

    user_list = []

    match type:
        case "":
            users = UserManagement.objects.all()
            for user in users:
                d = {"username": user.username, "image": user.image ,"status": "offline" if user.status == "" else user.status}
                user_list.append(d)
        
        case "friend":
            friends = database.find_friend(u[0])
            for friend in friends:
                if friend.user_a == u[0]:
                    d = {"username": friend.user_b.username, "image": friend.user_b.image ,"status": "offline" if friend.user_b.status == "" else friend.user_b.status}
                else:
                    d = {"username": friend.user_a.username, "image": friend.user_a.image ,"status": "offline" if friend.user_a.status == "" else friend.user_a.status}
                user_list.append(d)
        
        case "add":
            friends = database.find_friends_by_action_user(u[0], "pending")
            for friend in friends:
                d = {"username": friend.user_b.username, "image": friend.user_b.image ,"status": "offline" if friend.user_b.status == "" else friend.user_b.status}
                user_list.append(d)
        
        case "pending":
            friends = database.find_friends_by_actioned_user(u[0], "pending")
            for friend in friends:
                d = {"username": friend.user_a.username, "image": friend.user_a.image ,"status": "offline" if friend.user_a.status == "" else friend.user_a.status}
                user_list.append(d)
        
        case "block":
            friends = database.find_friends_by_action_user(u[0], "block")
            for friend in friends:
                d = {"username": friend.user_b.username, "image": friend.user_b.image ,"status": "offline" if friend.user_b.status == "" else friend.user_b.status}
                user_list.append(d)
        
        case _:
           return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    response_data = {
        "code": "00",
        "user_list": user_list,
    }
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

def get_info(req):
    if req.method != 'GET' :
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    win, lose = database.find_user_win_lose_stats(u[0])

    response_data = {
        "code" : "00",
        "username" : u[0].username,
        "name" : u[0].name,
        "last_name" : u[0].last_name,
        "phone_number" : u[0].phone_number,
        "tag" : u[0].tag,
        "image" : u[0].image,
        "win" : win,
        "lose" : lose,
        "level" : 0,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def get_other_info(req):
    if req.method != 'POST':
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    try:
        body = utils.getJsonBody(req.body)
        schema = {
            "type" : "object",
            "properties" : {
                "username": {"type" : "string"},
            },
            "required": ["username"]
        }

        validate(instance=body, schema=schema)
        other_user = body.get("username")
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    other_u = database.find_user_by_username(other_user)
    if len(other_u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    # find other friend list
    friend_list = []
    other_friends = database.find_friend(other_u[0])
    for other_friend in other_friends:
        if other_friend.user_a == other_u[0]:
            f = other_friend.user_b.username
        else:
            f = other_friend.user_a.username
        friend_list.append(f)

    # find relation with user
    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    relation = friend_management.map_relation(u[0], other_u[0])

    # get win lose stat
    win, lose = database.find_user_win_lose_stats(other_u[0])

    response_data = {
        "code": "00",
        "username": other_u[0].username,
        "name": other_u[0].name,
        "last_name": other_u[0].last_name,
        "phone_number": other_u[0].phone_number,
        "tag": other_u[0].tag,
        "image": other_u[0].image,
        "win": win,
        "lose": lose,
        "level": 0,
        "relation": relation,
        "status": "offline" if other_u[0].status == "" else other_u[0].status,
        "friends": friend_list,
    }

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def update_info(req):
    if req.method != 'POST' :
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    try:
        body = utils.getJsonBody(req.body)
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    name = body.get("name","")
    last_name = body.get("last_name","")
    phone_number = body.get("phone_number","")
    tag = body.get("tag","")

    if tag != "" and tag != u[0].tag:
        tags = database.find_user_by_tag(tag)
        if len(tags) > 0:
            return utils.responseJsonErrorMessage(400, "17", "Tag already exists")

    if database.edit_user(u[0], name, last_name, phone_number, tag) != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    return utils.responseJsonErrorMessage(200, "00", "Success")

@csrf_exempt
def get_relation(req):
    if req.method != 'POST':
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    try:
        body = utils.getJsonBody(req.body)
        schema = {
            "type" : "object",
            "properties" : {
                "username": {"type" : "string"},
            },
            "required": ["username"]
        }

        validate(instance=body, schema=schema)
        other_user = body.get("username")
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    other_u = database.find_user_by_username(other_user)
    if len(other_u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    relation = friend_management.map_relation(u[0], other_u[0])

    response_data = {
        "code": "00",
        "username": other_u[0].username,
        "relation": relation,
    }
    
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

@csrf_exempt
def change_password(req):
    if req.method != 'POST':
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    try:
        body = utils.getJsonBody(req.body)
        schema = {
            "type" : "object",
            "properties" : {
                "password": {"type" : "string"},
                "old_password": {"type" : "string"},
            },
            "required": ["password", "old_password"]
        }

        validate(instance=body, schema=schema)
        old_passwd = body.get("old_password")
        old_passwd = str(hash(old_passwd + settings.SECRET_KEY))
        passwd = body.get("password")
        passwd = str(hash(passwd + settings.SECRET_KEY))
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    if len(passwd) == 0 or len(old_passwd) == 0:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    # validate password
    if u[0].password != old_passwd:
        return utils.responseJsonErrorMessage(400, "14", "Incorrect Password")

    if database.update_password(u[0], passwd) == False:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")

@csrf_exempt
def stamp_status(req):
    if req.method != 'POST':
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    try:
        body = utils.getJsonBody(req.body)
        schema = {
            "type" : "object",
            "properties" : {
                "status": {"type" : "string"},
            },
            "required": ["status"]
        }

        validate(instance=body, schema=schema)
        status = body["status"]
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    match status:
        case "online":
            if database.update_status(u[0], status) == False:
                return utils.responseJsonErrorMessage(500, "20", "Internal error")
        case "offline":
            if database.update_status(u[0], status) == False:
                return utils.responseJsonErrorMessage(500, "20", "Internal error")
        case _:
            return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    return utils.responseJsonErrorMessage(200, "00", "Success")

@csrf_exempt
def logout(req):
    if req.method != 'POST' :
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(401, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    temp_jti = jwt_handler.generate_jti(u[0].username)
    if database.stamp_jti(u[0], temp_jti) != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    if database.update_status(u[0], "offline") != True:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")
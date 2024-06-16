from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from user_app.models import UserManagement
from datetime import datetime
from user_app import utils, database
from user_app.views import validator
import json

@csrf_exempt
def make_relation(req):
    try:
        body = utils.getJsonBody(req.body)
        # schema = {
        #     "type" : "object",
        #     "properties" : {
        #         "username": {"type" : "string"},
        #         "action": {"type" : "string"},
        #     },
        #     "required": ["username", "action"]
        # }

        # validate(instance=body, schema=schema)
        other_user = body.get("username")
        action = body.get("action")
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    actioned_u = database.find_user_by_username(other_user)
    if len(actioned_u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    #get my_username
    found, action_u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(action_u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    if (action_u[0].username == actioned_u[0].username):
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    match action:
        case "add":
            return add_friend(action_u[0], actioned_u[0])
        case "accept":
            return accept_friend(action_u[0], actioned_u[0])
        case "unfriend":
            return unfriend(action_u[0], actioned_u[0])
        case "block":
            return block_user(action_u[0], actioned_u[0])
        case "unblock":
            return unblock_user(action_u[0], actioned_u[0])
        case _:
           return utils.responseJsonErrorMessage(400, "10", "Invalid request")

def add_friend(u, added_u):

    relation = database.find_relation(u, added_u)

    if len (relation) == 0:
        # add friend
        if database.add_friend(u, added_u) == False:
            return utils.responseJsonErrorMessage(500, "20", "Internal error")
    else:
        match relation[0].action:
            case "block":
                return utils.responseJsonErrorMessage(400, "15", "Blocked User")

            case "pending":
                return utils.responseJsonErrorMessage(200, "00", "Success")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")

def unfriend(u, unfriend_u):

    relation = database.find_relation(u, unfriend_u)

    if len (relation) == 0:
        return utils.responseJsonErrorMessage(400, "16", "Relation Not Found")
    else:
        match relation[0].action:
            case "block":
                return utils.responseJsonErrorMessage(400, "16", "Relation Not Found")

            case "pending":
                if database.delete_relation(relation[0]) == False:
                        return utils.responseJsonErrorMessage(500, "20", "Internal error")

            case "friend":
                if database.delete_relation(relation[0]) == False:
                        return utils.responseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")

def accept_friend(u, accepted_u):

    relation = database.find_relation(u, accepted_u)

    if len (relation) == 0:
        return utils.responseJsonErrorMessage(400, "16", "Relation Not Found")
    else:
        match relation[0].action:
            case "block":
                return utils.responseJsonErrorMessage(400, "16", "Relation Not Found")

            case "pending":
                if relation[0].user_a != accepted_u:
                    return utils.responseJsonErrorMessage(400, "16", "Relation Not Found")
                
                relation[0].action = "friend"
                if database.save_relation(relation[0]) == False:
                    return utils.responseJsonErrorMessage(500, "20", "Internal error")

            case "friend":
                return utils.responseJsonErrorMessage(200, "00", "Success")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")

def block_user(u, block_u):

    relation = database.find_relation(u, block_u)

    if len (relation) == 0:
        # block user
        if database.block_user(u, block_u) == False:
            return utils.responseJsonErrorMessage(500, "20", "Internal error")
    else:
        match relation[0].action:
            case "block":
                pass
            case _:
                relation[0].user_a = u
                relation[0].user_b = block_u
                relation[0].action = "block"

                if database.save_relation(relation) == False:
                    return utils.responseJsonErrorMessage(500, "20", "Internal error")
    
    return utils.responseJsonErrorMessage(200, "00", "Success")

def unblock_user(u, unblock_u):
    
    relation = database.find_relation(u, unblock_u)

    if len (relation) == 0:
        # unblock user
        if database.block_user(u, unblock_u) == False:
            return utils.responseJsonErrorMessage(400, "16", "Relation Not Found")
    else:
        match relation[0].action:
            case "block":
                if relation[0].user_a == u:
                    if database.delete_relation(relation[0]) == False:
                        return utils.responseJsonErrorMessage(500, "20", "Internal error")
            case _:
                return utils.responseJsonErrorMessage(400, "16", "Relation Not Found")

    return utils.responseJsonErrorMessage(200, "00", "Success")

def map_relation(user_a, user_b):
    relation = database.find_relation(user_a, user_b)

    if len (relation) != 0:
        match relation[0].action:
            case "block":
                if relation[0].user_a == user_a:
                    return "block"
                else:
                    return ""
            
            case "pending":
                if relation[0].user_a == user_a:
                    return "pending"
                else:
                    return "add"
            case "friend":
                return "friend"

    return ""

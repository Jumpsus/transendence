from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from user_app import utils, database

#validate via app-secret
@csrf_exempt
def save_game_result(req):
    verify = validate_internal_key(req)

    if verify == False:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    try:
        body = utils.getJsonBody(req.body)
        schema = {
            "type" : "object",
            "properties" : {
                "winner": {"type" : "string"},
                "loser": {"type" : "string"},
                "winner_score": {"type" : "int"},
                "loser_score": {"type": "int"}
            },
            "required": ["winner", "loser", "winner_score", "loser_score"]
        }

        validate(instance=body, schema=schema)

        winner = body["winner"]
        loser = body["loser"]
        winner_score = body["winner_score"]
        loser_score = body["loser_score"]

    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    winner_u = database.find_user_by_username(winner)
    if len(winner_u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    loser_u = database.find_user_by_username(loser)
    if len(loser_u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")
    
    if database.create_match_history(winner_u, loser_u, winner_score, loser_score) == False:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    return utils.responseJsonErrorMessage(200, "00", "Success")

def get_match_history(req):

    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    match_historys = database.find_user_match_history(u)

    match_list = []

    for match in match_historys:
        d = {"winner": match.user_w.username, "loser": match.user_l.username ,"win_score": match.score_w, "lose_score":match.score_l}
        match_list.append(d)
    
    response = {
        "code": "00",
        "match_history": match_list,
    }

@csrf_exempt
def get_other_match_history(req):
    found, u = validator.validate_user(req)
    if found != True:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

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

    match_historys = database.find_user_match_history(other_user)

    match_list = []

    for match in match_historys:
        d = {"winner": match.user_w.username, "loser": match.user_l.username ,"win_score": match.score_w, "lose_score":match.score_l}
        match_list.append(d)
    
    response = {
        "code": "00",
        "match_history": match_list,
    }
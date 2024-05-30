from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def stamp_status(req):
    try:
        body = utils.getJsonBody(req.body)
        user = body["username"]
        status = body["status"]
    except:
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")

    u = database.find_user_by_username_passwd(user)

    if len(u) == 0:
        return utils.responseJsonErrorMessage(400, "11", "Mismatch username or password")

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
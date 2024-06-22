from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from user_app import utils, database

# validate via jwt
@csrf_exempt
def stamp_status(req):
    if req.method != 'POST':
        return utils.responseJsonErrorMessage(400, "10", "Invalid request (Method)")

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
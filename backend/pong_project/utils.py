import json
from django.http import HttpResponse

def getJsonBody(body_unicode):
    body = json.loads(body_unicode)
    return body

def reponseJsonErrorMessage(status, code, message):
    response_data = {}
    response_data["code"] = code
    response_data["message"] = message
    return HttpResponse(json.dumps(response_data), content_type="application/json", status=status)

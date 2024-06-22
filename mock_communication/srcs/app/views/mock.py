from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from jsonschema import validate
import json
import requests

from projects import settings

def status(req):
    return HttpResponse("ok", content_type="application/json", status=200)

# This solution use jwt token that pass from frontend to authenticate that who call this api ?
# Example Situation: when game server want to know who join game room without using content field from request_body
def solution_A(req):

    token = req.headers.get('Authorization')

    if token == None:
        # Use your own error message response
        response_data = {
            "code": "10",
            "message": "No Authentication Token",
        }
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=400)

    print("token = " + token)
    headers = {
        'content-type': 'application/json',
        'Authorization': token
    }
    
    response = requests.get('https://frontend/user-management/user/getinfo', headers=headers, verify=False)
    # response = requests.get('https://127.0.0.1/user-management/user/getinfo', headers=headers, verify=False)

    if response.status_code != 200:
        print(response.content)
        response_data = {
            "code": "20",
            "message": "Request Error",
        }
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=400)

    content = json.loads(response.content)
    print(content)
    response_data = content

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

# This solution use "api_key" or secret that only server will know to communicate when server need to talk to each other
# Example Situation: when game server want to stamp match history in usermanagement
def solution_B(req):

    # Bearer + "api_key"
    token = "Bearer " + settings.API_KEY

    print(token)

    headers = {
        'content-type': 'application/json',
        'Authorization': token
    }

    request_content = {
        "winner": "usera",
        "loser": "userb",
        "winner_score": 5,
        "loser_score": 0
    }

    response = requests.post('https://frontend/user-management/user/savegameresult', headers=headers, json=request_content, verify=False)
    # response = requests.post('https://127.0.0.1/user-management/user/savegameresult', headers=headers, json=request_content, verify=False)

    if response.status_code != 200:
        print(response.content)
        response_data = {
            "code": "20",
            "message": "Request Error",
        }
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=400)

    content = json.loads(response.content)
    print(content)
    response_data = content

    return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

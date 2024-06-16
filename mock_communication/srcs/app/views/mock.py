from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from jsonschema import validate
import json
import requests

def status(req):
    return HttpResponse("ok", content_type="application/json", status=200)

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

import base64
import json
from django.http import HttpRequest

def get_jwt(request: HttpRequest) -> str:
    return request.headers.get('Authorization')

def get_user_id(request: HttpRequest) -> int:
    jwt = request.headers.get('Authorization')
    if jwt is not None:
        jwt_arr = jwt.split('.')
        decode_head = json.load(base64.b64decode(jwt_arr[1] + '==='))
        return int(decode_head['user_id'])
    else:
        return 0
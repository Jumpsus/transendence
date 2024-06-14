from user_app import utils, database, jwt_handler
from user_app.models import UserManagement
from user_project import settings

def validate_user(req):
    result, decode_data = jwt_handler.validate_jwt(req.headers)
    if result != True:
        return result, []

    username = decode_data.get("username")
    u = database.find_user_by_username(username)
    if len(u) == 0:
        return False, []

    jti = decode_data.get("jti")
    
    if jti != u[0].jti:
        return False, []

    return True, u

def validate_internal_key(req):
    token = req.headers.get('Authorization')
    if token == None:
        return False

    # validate token
    split_token = token.split()

    if (len(split_token) == 2):
        if (split_token[0] != 'Bearer'):
            return False
        
        if (split_token[1] == settings.API_KEY):
            return True
    return False
    
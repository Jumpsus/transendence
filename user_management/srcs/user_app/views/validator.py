from user_app import utils, database, jwt_handler
from user_app.models import UserManagement

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

    
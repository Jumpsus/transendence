import jwt
import uuid
from datetime import timezone, timedelta, datetime

def generate_jti(username) -> (str):
    return uuid.uuid4().hex + "_" + username

def encode_user(user, jti) -> (str):
    encoded_data = jwt.encode(payload={ "username": user, 
                                        "jti": jti,
                                        "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=1440)},
                              key='secret',
                              algorithm="HS256")

    return encoded_data

def decode_user(token: str):
    decoded_data = jwt.decode(jwt=token,
                              key='secret',
                              algorithms=["HS256"])

    print(decoded_data)

def validate_jwt(headers) -> (bool, dict):
    
    # get token
    token = headers.get('Authorization')
    if token == None:
        return False, {}

    # validate token
    split_token = token.split()

    match len(split_token):
        case 2:
            if (split_token[0] != 'Bearer'):
                return False, {}

            try:
                decoded_data = jwt.decode(jwt=split_token[1],
                                  key='secret',
                                  algorithms=["HS256"])
                return True, decoded_data
            except:
                return False, {}
        case _:
            return False, {}

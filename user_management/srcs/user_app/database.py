from django.db.models import Q
from user_app.models import UserManagement
from user_app.models import FriendManagement

# USER_MANAGEMENT

def find_user_by_username(username):
    # try:
    #     UserManagement.objects.get(username = username)
    # except:
    #     return UserManagement(), False
    # return user, True
    return UserManagement.objects.filter(username = username)

def find_user_by_username_passwd(username, password):
    return UserManagement.objects.filter(username = username, password = password)

# return True if "success" False if "fail"
def create_user(username, password, name = "", last_name = "", phone_number = "", tag = ""):
    user = UserManagement(  username = username, 
                            password = password,
                            name = name,
                            last_name = last_name,
                            phone_number = phone_number,
                            tag = tag)

    try: 
        user.save()
    except:
        return False
    return True

# return True if "success" False if "fail"
def edit_user(user, name = "", last_name = "", phone_number = "", tag = ""):

    user.name = name
    user.last_name = last_name
    user.phone_number = phone_number
    user.tag = tag

    try: 
        user.save()
    except:
        return False
    return True

def update_password(user, passwd):
    if len(passwd) == 0:
        return False

    user.password = passwd
    try:
        user.save()
    except:
        return False
    return True

def set_image(user, image):
    user.image = image

    try: 
        user.save()
    except:
        return False
    return True

# FRIEND_MANAGEMENT
def find_frend(user):
    return FriendManagement.objects.filter(Q(user_a = user) | Q(user_b = user))

def add_friend(user_a, user_b):
    friend_management = FriendManagement(user_a = user_a, user_b = user_b, action = "add_friend")

    try:
        friend_management.save()
    except:
        return False
    return True

def block_user(user_a, user_b):
    friend_management = FriendManagement(user_a = user_a, user_b = user_b, action = "block")

    try:
        friend_management.save()
    except:
        return False
    return True

def check_blocked(user_a, user_b):
    friend_management = FriendManagement.objects.filter( Q(user_a = user_a, user_b = user_b, action = "block") |
                                                         Q(user_a = user_b, user_b = user_a, action = "block"))

    if len(friend_management > 0):
        return True
    return False


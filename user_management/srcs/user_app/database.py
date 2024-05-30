from django.db.models import Q
from user_app.models import UserManagement
from user_app.models import FriendManagement

# USER_MANAGEMENT

def find_user_by_username(username):
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
                            image = "default.png",
                            tag = tag)

    try: 
        user.save()
    except:
        return False
    return True

# return True if "success" False if "fail"
def edit_user(user, name = "", last_name = "", phone_number = "", tag = ""):

    if name != "":
        user.name = name
    
    if last_name != "":
        user.last_name = last_name

    if phone_number != "":
        user.phone_number = phone_number
    
    if user.tag != "":
        user.tag = tag

    try: 
        user.save()
    except:
        return False
    return True

def update_image(user, image):
    if image == "":
        user.image = "default.png"
    else:
        user.image = image
    
    try: 
        user.save()
    except:
        return False
    return True

def update_password(user, passwd):
    user.password = passwd

    try:
        user.save()
    except:
        return False
    return True

def update_status(user, status):
    user.status = status

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
def find_relation(user_a, user_b):
    return FriendManagement.objects.filter((Q(user_a = user_a) & Q(user_b = user_b)) | (Q(user_a = user_b) & Q(user_b = user_a)))

def find_friend(user):
    return FriendManagement.objects.filter(Q(action = "friend"), Q(user_a = user) | Q(user_b = user))

def save_relation(friend_management):
    try:
        friend_management.save()
    except:
        return False
    return True

def delete_relation(friend_management):
    try:
        friend_management.delete()
    except:
        return False
    return True

def add_friend(user_a, user_b):
    friend_management = FriendManagement(user_a = user_a, user_b = user_b, action = "pending")

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

def find_friends_by_action_user(user, action):
    return FriendManagement.objects.filter(user_a = user, action = action)

def find_friends_by_actioned_user(user, action):
    return FriendManagement.objects.filter(user_b = user, action = action)

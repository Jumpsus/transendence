from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt

from user_app import utils, database
from user_project import settings

import os
import json
from datetime import datetime
from PIL import Image

@csrf_exempt
def upload_image(req):

    try:
        current_user = req.session["username"]
    except KeyError:
        return utils.responseJsonErrorMessage(400, "30", "Invalid Session")

    user = database.find_user_by_username(current_user)
    if len(user) == 0:
        return utils.responseJsonErrorMessage(400, "13", "User Not Found")

    file = req.FILES['image']

    temp_path = os.path.join(settings.TEMP_PATH, file.name)
    temp_name = default_storage.save(temp_path, file)

    try:
        with Image.open(temp_name) as img:
            img.verify()
    except (IOError, SyntaxError):
        return utils.responseJsonErrorMessage(400, "10", "Invalid request")
    
    os.remove(temp_name)

    _, file_extension = os.path.splitext(file.name)
    new_filename = user[0].username + file_extension
    full_image_path = os.path.join(settings.DEFAULT_IMAGE_PATH, new_filename)
    
    # clear existing image
    if os.path.exists(full_image_path):
        os.remove(full_image_path)

    file_name = default_storage.save(full_image_path, file)
    os.chmod(file_name, 0o755)

    if database.update_image(user[0], new_filename) == False:
        return utils.responseJsonErrorMessage(500, "20", "Internal error")

    return utils.responseJsonErrorMessage(200, "00", "Success")
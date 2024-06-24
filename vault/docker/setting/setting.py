import hvac
import json
import os
import time
import re
import urllib3
import uuid
from django.core.management.utils import get_random_secret_key

urllib3.disable_warnings()
client = hvac.Client(url = os.environ["VAULT_ADDR"], verify=False)

def get_unseal_key(pattern):
    file = open(os.environ["KEY_PATH"], "r")

    for line in file:
        if re.search(pattern, line):
            split_line = line.split()
            file.close()
            return split_line[len(split_line) - 1]

    file.close()
    return ""

def get_root_token():
    file = open(os.environ["KEY_PATH"], "r")

    for line in file:
        if re.search("Initial Root Token", line):
            split_line = line.split()
            file.close()
            return split_line[len(split_line) - 1]

    file.close()
    return ""

def create_token(token_id):
    token = client.auth.token.create(id=token_id)
    return token

def check_seal():
    return client.sys.read_seal_status()['sealed']

def create_secret(secret_dict):
    response = client.secrets.kv.v2.create_or_update_secret(path='app_secret', secret = secret_dict)

def read_secret():
    try:
        response = client.secrets.kv.v2.read_secret_version(path='app_secret', raise_on_deleted_version = True)
    except Exception as e:
        return {}

    return response.get("data", {}).get("data", {})

# unseal process
for x in range (1, 6):
    pattern = "Key " + str(x)
    unseal_key = get_unseal_key(pattern)
    
    try:
        client.sys.submit_unseal_key(key=unseal_key)
    except:
        exit(1)
    
    if check_seal() != True:
        break
    
if check_seal() == True:
    exit(1)

#create my_token
client.token = os.environ["MY_VAULT_TOKEN"]
if client.is_authenticated() != True:
    root_token = get_root_token()
    client.token = root_token

    my_token = create_token(os.environ["MY_VAULT_TOKEN"])
    client.token = os.environ["MY_VAULT_TOKEN"]

if client.is_authenticated() != True:
    exit(1)


secret_dict = read_secret()
update = False

if secret_dict.get("api_key", "") == "":
    secret_dict["api_key"] = uuid.uuid4().hex
    update = True

if secret_dict.get("jwt_secret", "") == "":
    secret_dict["jwt_secret"] = uuid.uuid4().hex
    update = True

if secret_dict.get("usermanagement_secret", "") == "":
    secret_dict["usermanagement_secret"] = get_random_secret_key()
    update = True

if update == True:
    create_secret(secret_dict)
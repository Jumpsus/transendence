import hvac
import json
import os
import uuid

def create_secret(secret_dict):
    client = hvac.Client(url = os.environ["VAULT_ADDR"], verify=False)
    response = client.secrets.kv.v2.create_or_update_secret(path='app_secret', secret = secret_dict)

def read_secret():
    try:
        client = hvac.Client(url = os.environ["VAULT_ADDR"], verify=False)
        response = client.secrets.kv.v2.read_secret_version(path='app_secret', raise_on_deleted_version = True)
    except Exception as e:
        return {}

    return response.get("data", {}).get("data", {})

os.environ["VAULT_TOKEN"] = os.environ["MY_VAULT_TOKEN"]

secret_dict = read_secret()
update = False

if secret_dict.get("api_key", "") == "":
    secret_dict["api_key"] = uuid.uuid4().hex
    update = True

if secret_dict.get("jwt_secret", "") == "":
    secret_dict["jwt_secret"] = uuid.uuid4().hex
    update = True

if update == True:
    create_secret(secret_dict)
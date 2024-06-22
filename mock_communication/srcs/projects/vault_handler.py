import hvac
import os
import time

client = hvac.Client(url = "https://vault-service:8201", verify=False)
# client = hvac.Client(url = "https://127.0.0.1:8201", verify=False)
client.token = "Do_not_share_this_ever_ever"

def check_seal():
    return client.sys.read_seal_status()['sealed']

def read_secret():    
    response = client.secrets.kv.v2.read_secret_version(path='app_secret', raise_on_deleted_version = True)
    return response.get("data", {}).get("data", {})

def init_vault():

    if client.is_authenticated() != True:
        # wait for client
        time.sleep(3)
        if client.is_authenticated() != True:
            print("Exit with unexpected result: Token is unauthenticate")
            exit(1)

    for i in range (0, 10):
        if check_seal() != True:
            break
        time.sleep(1)

    if check_seal() == True:
        print("Exit with unexpected result: Vault is Sealed!")
        exit(1)

    secret_dict = read_secret()

    count = 0
    while secret_dict.get("api_key", "") == "" and secret_dict.get("jwt_secret", "") == "" and secret_dict.get("usermanagement_secret", "") == "":
        if count > 10:
            print("Exit with unexpected result: Time out while getting secret!")
            exit(1)

        print("Cannot get secret from vault try to re read")
        time.sleep(1)
        secret_dict = read_secret()
    
    return secret_dict
import hvac
import os
import time

client = hvac.Client(url = os.environ["VAULT_ADDR"], verify=False)
client.token = os.environ["MY_VAULT_TOKEN"]

def check_seal():
    return client.sys.read_seal_status()['sealed']

def read_secret():    
    response = client.secrets.kv.v2.read_secret_version(path='app_secret', raise_on_deleted_version = True)
    return response.get("data", {}).get("data", {})

def init_vault():

    for i in range (0, 10):
        if check_seal() != True:
            break
        time.sleep(1)

    if check_seal() == True:
        print("Exit with unexpected result: Vault is Sealed!")
        exit(1)

    if client.is_authenticated() != True:
        print("Exit with unexpected result: Token is unauthenticate")
        exit(1)

    secret_dict = read_secret()

    count = 0
    while secret_dict.get("api_key", "") == "":
        if count > 10:
            print("Exit with unexpected result: Time out while getting secret!")
            exit(1)

        print("Cannot get secret from vault try to re read")
        time.sleep(1)
        secret_dict = read_secret()
    
    return secret_dict
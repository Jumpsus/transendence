import hvac
import os
import time

def check_seal():
    client = hvac.Client(url = os.environ["VAULT_ADDR"], verify=False)
    return client.sys.read_seal_status()['sealed']

def read_secret():
    try:
        client = hvac.Client(url = os.environ["VAULT_ADDR"], verify=False)
        response = client.secrets.kv.v2.read_secret_version(path='app_secret', raise_on_deleted_version = True)
    except Exception as e:
        return {}

    return response.get("data", {}).get("data", {})

def init_vault():

    while check_seal() == True:
        print("[sleep] vault is seal...")
        time.sleep(1)
    print("[congrat] vault is unseal...")

    secret_dict = read_secret()
    while True:
        if secret_dict.get("api_key", "") == "":
            print("in loop 1")
            continue
        
        if secret_dict.get("jwt_secret", "") == "":
            print("in loop 2")
            continue

        if secret_dict.get("usermanagement_secret", "") == "":
            print("in loop 3")
            continue
    
        print("in loop 4")
        break
    
    return secret_dict


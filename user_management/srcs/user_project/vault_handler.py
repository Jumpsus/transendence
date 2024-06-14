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
        print("in loop")
        if secret_dict.get("api_key", "") == "":
            continue
        
        if secret_dict.get("jwt_secret", "") == "":
            continue

        if secret_dict.get("usermanagement_secret", "") == "":
            continue
    
        break
    
    return secret_dict


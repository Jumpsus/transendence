import hvac
import json
import os

def create_secret():
    client = hvac.Client(url = 'https://vault-service:8201', verify=False)
    response = client.secrets.kv.v2.create_or_update_secret(path='app_secret', secret = dict(first_secret="first"))
    print("wirte response")
    print(response)

def read_secret():
    client = hvac.Client(url = 'https://vault-service:8201', verify=False)
    response = client.secrets.kv.v2.read_secret_version(path='app_secret')
    print("read response :")
    print(response.get("data"))

# os.environ["VAULT_TOKEN"] = ''
os.environ["VAULT_ADDR"] = 'https://vault-service:8201'
create_secret()
# read_secret()
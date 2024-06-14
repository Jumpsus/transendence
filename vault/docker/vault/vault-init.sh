#!/usr/bin/env sh

echo 'disable_mlock = true

storage "file" {
  path = "/vault/file"
}

listener "tcp" {
  address     = "127.0.0.1:8200"
  tls_disable = 1
}' > tmp_file

vault server -config=tmp_file &
VAULT_PID=$!

sleep 5

VAULT_ADDR_TMP=$VAULT_ADDR
export VAULT_ADDR='http://127.0.0.1:8200'

set -x

unseal () {
vault operator unseal $(grep 'Key 1:' /vault/file/keys | awk '{print $NF}')
vault operator unseal $(grep 'Key 2:' /vault/file/keys | awk '{print $NF}')
vault operator unseal $(grep 'Key 3:' /vault/file/keys | awk '{print $NF}')
}

init () {
vault operator init > /vault/file/keys
}

log_in () {
   export ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/file/keys | awk '{print $NF}')
   vault login $ROOT_TOKEN
}

create_token () {
   vault token create -id=$MY_VAULT_TOKEN
}

enable_secret () {
   vault secrets enable -version=2 -path=secret kv
}

if [ -s /vault/file/keys ]; then
   unseal
else
   init
   unseal
   log_in
   create_token
   enable_secret
fi

vault status > /vault/file/status


kill "$VAULT_PID"

rm tmp_file
export VAULT_ADDR=VAULT_ADDR_TMP

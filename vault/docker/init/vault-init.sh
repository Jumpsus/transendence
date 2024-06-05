#!/usr/bin/env sh

set -ex

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
   vault token create -id $MY_VAULT_TOKEN
}

enable_secret () {
   vault secrets enable -version=2 kv
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
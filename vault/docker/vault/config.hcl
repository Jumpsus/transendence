ui = true

listener "tcp" {
  address     = "0.0.0.0:8201"
  tls_disable = 0
  tls_cert_file = "/vault/cert/certificate.pem"
  tls_key_file = "/vault/cert/private.pem"
}

storage "file" {
  path = "/vault/file"
}

api_addr = "http://127.0.0.1:8201"

disable_mlock = "true"

openssl req -x509 -nodes -days 365 -newkey rsa:4096  -keyout /app/ssl/private.key -out /app/ssl/certificate.crt -subj /C=TH/ST=Bangkok/L=Bangkok/O=42/CN=transcendence

openssl rsa -in /app/ssl/private.key -text > /app/ssl/private.pem
openssl x509 -inform PEM -in /app/ssl/certificate.crt > /app/ssl/certificate.pem
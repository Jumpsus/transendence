FROM debian:bookworm

RUN apt update -y && \
    apt upgrade -y && \
    apt install -y openssl

RUN mkdir -p /app/ssl

CMD ["openssl", "req", \
    "-x509", \
    "-nodes", \
    "-days", "365", \
    "-newkey", "rsa:4096", \
    "-keyout", "/app/ssl/private.key", \
    "-out", "/app/ssl/certificate.crt", \
    "-subj", "/C=TH/ST=Bangkok/L=Bangkok/O=42/CN=transcendence"]
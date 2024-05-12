FROM debian:bookworm

RUN apt update -y && \
    apt upgrade -y && \
    apt install -y openssl

RUN mkdir -p /app/ssl

COPY script /script

CMD ["bash", "/script/generate.sh"]
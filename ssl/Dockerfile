FROM debian:bookworm

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y openssl

RUN mkdir -p /app/ssl

COPY script /script

CMD ["bash", "/script/generate.sh"]
FROM debian:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    nginx \
    python3 \
    python3-pip \
    python3-venv \
    openssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=TH/L=Bangkok/O=42/OU=42Bangkok/CN=localhost"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

ENV PYTHONDONTWITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv env
RUN . env/bin/activate
RUN env/bin/pip3 install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 80

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000" ]
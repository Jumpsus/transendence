#!/bin/sh

/usr/bin/wait_for_it.sh vault-service:8201

python3 manage.py makemigrations
python3 manage.py migrate --noinput
python3 manage.py runserver 0.0.0.0:8001
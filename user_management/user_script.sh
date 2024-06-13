#!/bin/sh

/usr/bin/wait_for_it.sh user-db:5432

python3 manage.py makemigrations
python3 manage.py migrate --noinput
python3 manage.py runserver 0.0.0.0:8000
FROM python:3.10-slim

RUN mkdir -p /app

WORKDIR /app

COPY setting.py .

RUN python3 -m venv venv
RUN . venv/bin/activate
RUN pip install hvac django

FROM python:3.10-slim

RUN mkdir -p /app

WORKDIR /app

COPY setting.py .

RUN pip install --no-cache-dir --break-system-packages hvac django

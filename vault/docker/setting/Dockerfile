FROM python:3.10-slim

RUN pip install --no-cache-dir --break-system-packages hvac django
RUN mkdir -p /app

WORKDIR /app

COPY setting.py .


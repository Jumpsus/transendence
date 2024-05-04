FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv venv
RUN . venv/bin/activate
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
FROM python:3.10-slim

RUN mkdir -p share-resource

WORKDIR /app

COPY requirements.txt .

EXPOSE "8000"

RUN python3 -m venv venv
RUN . venv/bin/activate
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

EXPOSE 9999

# Copy the Django project into the container
COPY srcs .


FROM python:3.10-slim

RUN mkdir -p /app/share-resource
RUN mkdir -p /app/temp

WORKDIR /app

COPY requirements.txt .

EXPOSE "8000"

COPY .env-app /app/.env
COPY user_script.sh /usr/bin/user_script.sh
RUN chmod 777 /usr/bin/user_script.sh
# Install pip packages
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

# Copy the Django project into the container
COPY srcs .

# Expose the port Django will run on
EXPOSE 8000
ENTRYPOINT [ "/usr/bin/user_script.sh" ]

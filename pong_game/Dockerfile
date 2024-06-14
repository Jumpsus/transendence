FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

EXPOSE 8001

COPY pong_game_script.sh /usr/bin/pong_game_script.sh
RUN chmod 777 /usr/bin/pong_game_script.sh
# Install pip packages

# Copy the Django project into the container
COPY srcs .

ENTRYPOINT [ "/usr/bin/pong_game_script.sh" ]

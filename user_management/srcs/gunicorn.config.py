# Application to run
wsgi_app = 'user_project.wsgi:application'

# Bind address and port
bind = '0.0.0.0:8000'

# Number of workers
workers = 4

daemon = False

keyfile = '/app/ssl/private.key'

certfile = '/app/ssl/certificate.crt'

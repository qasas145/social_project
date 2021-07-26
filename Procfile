release: python manage.py migrate
web: gunicorn -k gevent -w 1 -bind 0.0.0.0:8000 backend.wsgi:application
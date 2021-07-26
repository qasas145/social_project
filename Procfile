release: python manage.py migrate
web: gunicorn -k gevent -w 1 -b 0.0.0.0:8000 backend.wsgi:application
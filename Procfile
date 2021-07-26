release: python manage.py migrate
web: gunicorn -k eventlet  backend.wsgi:application
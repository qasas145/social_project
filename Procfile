release: python manage.py migrate
web: gunicorn waitress-serve backend.wsgi:application
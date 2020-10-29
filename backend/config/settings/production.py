# pylint:disable=unused-wildcard-import
from .base import * # noqa: F401
import os

ALLOWED_HOSTS = [os.getenv('DJANGO_HOST_URL')]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
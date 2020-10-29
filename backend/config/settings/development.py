# pylint:disable=unused-wildcard-import
from .base import * # noqa: F401

ALLOWED_HOSTS = ['*']

DEBUG = True

SECRET_KEY = 'v#@dih#@$s#6a$&m7wblp4=o+p-giz(l@erv%wn$okerj6&snu' # noqa: secret

SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
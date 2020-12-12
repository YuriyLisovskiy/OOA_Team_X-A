import os
from pathlib import Path

SECRET_ADMIN_URL = 'admin'

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

PROJECT_ID = os.getenv('GCLOUD_PROJECT_ID', '')

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'none')

ALLOWED_HOSTS = [
	host.strip('\n').strip() for host in os.getenv('DJANGO_ALLOWED_HOSTS', '').split('\n')
]

# DEBUG = os.getenv('DJANGO_DEBUG', 'false').lower() == 'true'
DEBUG = False

DB_CERT_DIR = BASE_DIR / 'cert'

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql_psycopg2',
		'HOST': os.getenv('DATABASE_HOST', ''),
		'NAME': os.getenv('DEFAULT_DATABASE_NAME', ''),
		'USER': os.getenv('DEFAULT_DATABASE_USER', ''),
		'PASSWORD': os.getenv('DEFAULT_DATABASE_PASSWORD', ''),
		'OPTIONS': {
			'sslmode': os.getenv('DATABASE_SSL_MODE', ''),
			'sslrootcert': str(DB_CERT_DIR / 'server-ca.pem'),
			'sslcert': str(DB_CERT_DIR / 'client-cert.pem'),
			'sslkey': str(DB_CERT_DIR / 'client-key.pem'),
		},
	}
}

STATIC_URL = 'https://storage.googleapis.com/{}/{}'.format(
	os.getenv('GCLOUD_STATIC_FILES_BUCKET', ''),
	os.getenv('GCLOUD_STATIC_FILES_DIR', '')
)

CORS_ORIGIN_WHITELIST = [
	origin.strip('\n').strip() for origin in os.getenv('CORS_ORIGIN_WHITELIST', '').split('\n')
]

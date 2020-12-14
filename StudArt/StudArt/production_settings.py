import os
from pathlib import Path

SECRET_ADMIN_URL = os.getenv('DJANGO_SECRET_ADMIN_URL')

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

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
		'NAME': os.getenv('DATABASE_NAME', ''),
		'USER': os.getenv('DATABASE_USER', ''),
		'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),
		'OPTIONS': {
			'sslmode': os.getenv('DATABASE_SSL_MODE', ''),
			'sslrootcert': str(DB_CERT_DIR / 'server-ca.pem'),
			'sslcert': str(DB_CERT_DIR / 'client-cert.pem'),
			'sslkey': str(DB_CERT_DIR / 'client-key.pem'),
		},
	}
}

whitelist = os.getenv('CORS_ORIGIN_WHITELIST', '')
if whitelist != '':
	CORS_ORIGIN_WHITELIST = [
		origin.strip('\n').strip() for origin in whitelist.split('\n')
	]
else:
	CORS_ORIGIN_WHITELIST = []

PROJECT_ID = os.getenv('GCLOUD_PROJECT_ID', '')

DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
GS_BUCKET_NAME = os.getenv('GCLOUD_STATIC_FILES_BUCKET', '')
GS_DEFAULT_ACL = 'publicRead'
GS_LOCATION = os.getenv('GCLOUD_MEDIA_FILES_DIR', '')

GCLOUD_BUCKET = 'https://storage.googleapis.com/{}'.format(
	os.getenv('GCLOUD_STATIC_FILES_BUCKET', '')
)

MEDIA_URL = '{}/{}'.format(GCLOUD_BUCKET, GS_LOCATION)
STATIC_URL = '{}/static/'.format(GCLOUD_BUCKET)

WEB_API_MEDIA_CREDENTIALS = str(BASE_DIR / 'web-api-media.json')
if os.path.exists(WEB_API_MEDIA_CREDENTIALS):
	os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = WEB_API_MEDIA_CREDENTIALS

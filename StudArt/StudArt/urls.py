from django.conf import settings
from django.contrib import admin
from django.urls import re_path, include

urlpatterns = []
if settings.DEBUG:
    urlpatterns.append(re_path('^admin/?', admin.site.urls))

urlpatterns += [
    re_path('^api/v1/?', include('api_v1.urls')),
]

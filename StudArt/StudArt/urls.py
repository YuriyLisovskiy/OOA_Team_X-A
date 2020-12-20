from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import re_path, include

urlpatterns = [
	re_path('^{}/'.format(settings.SECRET_ADMIN_URL), admin.site.urls)
]

urlpatterns += [
	re_path('^api/v1/', include('api_v1.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

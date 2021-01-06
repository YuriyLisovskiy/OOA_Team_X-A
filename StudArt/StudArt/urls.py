from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import re_path, include

urlpatterns = [
	re_path('^{}/'.format(settings.SECRET_ADMIN_URL), admin.site.urls)
]


def index(request):
	return HttpResponseRedirect('second')


def second(request):
	res = '<p>SERVER_NAME: {}</p><p>SERVER_PORT: {}</p><p>HTTP_HOST: {}</p>'.format(
		request.META['SERVER_NAME'],
		request.META['SERVER_PORT'],
		request.META['HTTP_HOST']
	)
	return HttpResponse(res)


urlpatterns += [
	re_path('^api/v1/', include('api_v1.urls')),
	re_path('^second/?', second),
	re_path('^$', index, name='index'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

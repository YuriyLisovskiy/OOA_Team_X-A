from django.urls import re_path

from core.administration.views import BanUserAPIView, UnbanUserAPIView

app_name = 'core.administration'

urlpatterns = [
	re_path(r'^users/(?P<pk>\d+)/ban/?', BanUserAPIView.as_view(), name='ban_user'),
	re_path(r'^users/(?P<pk>\d+)/unban/?', UnbanUserAPIView.as_view(), name='unban_user')
]

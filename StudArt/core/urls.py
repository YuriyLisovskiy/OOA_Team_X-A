from django.urls import re_path

from core.views import UserDetailsView, current_user, UserList

app_name = 'core'

urlpatterns = [
	re_path(r'^user/(?P<pk>\d+)/?$', UserDetailsView.as_view()),
	re_path(r'^user/current/?$', current_user),
	re_path(r'^$', UserList.as_view()),
]

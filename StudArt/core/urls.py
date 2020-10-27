from django.urls import re_path

from core.views import UserDetailsView

app_name = 'core'

urlpatterns = [
	re_path(r'^user/(?P<pk>\d+)/?$', UserDetailsView.as_view())
]

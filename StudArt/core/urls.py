from django.urls import re_path

from core.views import (
	UserDetailsAPIView, EditSelfAPIView, BlockUserAPIView,
	UnblockUserAPIView, SubscribeToAuthorAPIView, UnsubscribeFromAuthorAPIView,
	UserSubscriptionsAPIView, UserBlacklistAPIView
)

app_name = 'core'

urlpatterns = [
	re_path(r'^users/self/block/author/?', BlockUserAPIView.as_view()),
	re_path(r'^users/self/unblock/author/?', UnblockUserAPIView.as_view()),
	re_path(r'^users/self/edit/?$', EditSelfAPIView.as_view()),
	re_path(r'^users/self/subscribe/?', SubscribeToAuthorAPIView.as_view()),
	re_path(r'^users/self/unsubscribe/?', UnsubscribeFromAuthorAPIView.as_view()),
	re_path(r'^users/self/blacklist/?', UserBlacklistAPIView.as_view()),
	re_path(r'^users/(?P<pk>\d+)/subscriptions/?', UserSubscriptionsAPIView.as_view()),
	re_path(r'^users/(?P<pk>\d+)/?', UserDetailsAPIView.as_view()),
]

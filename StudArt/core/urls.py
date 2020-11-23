from django.urls import re_path

from core.views import (
	UserDetailsAPIView, UploadAvatarAPIView, EditSelfAPIView,
	BlockUserAPIView, UnblockUserAPIView, SubscribeToAuthorAPIView,
	UnsubscribeFromAuthorAPIView, CreateAccountAPIView, SubscriptionsAPIView,
	BlacklistAPIView
)

app_name = 'core'

urlpatterns = [
	re_path(r'^users/create/?', CreateAccountAPIView.as_view()),
	re_path(r'^users/self/block/author/?', BlockUserAPIView.as_view()),
	re_path(r'^users/self/unblock/author/?', UnblockUserAPIView.as_view()),
	re_path(r'^users/self/edit/?$', EditSelfAPIView.as_view()),
	re_path(r'^users/self/uploadAvatar/?', UploadAvatarAPIView.as_view()),
	re_path(r'^users/self/subscribe/?', SubscribeToAuthorAPIView.as_view()),
	re_path(r'^users/self/unsubscribe/?', UnsubscribeFromAuthorAPIView.as_view()),
	re_path(r'^users/(?P<pk>\d+)/subscriptions/?', SubscriptionsAPIView.as_view()),
	re_path(r'^users/(?P<pk>\d+)/blacklist/?', BlacklistAPIView.as_view()),
	re_path(r'^users/(?P<pk>\d+)/?', UserDetailsAPIView.as_view()),
]

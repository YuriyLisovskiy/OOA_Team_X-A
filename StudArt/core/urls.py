from django.urls import re_path, include

from core.views import (
	UserDetailsAPIView, EditSelfAPIView, BlockUserAPIView,
	UnblockUserAPIView, SubscribeToAuthorAPIView, UnsubscribeFromAuthorAPIView,
	UserSubscriptionsAPIView, UserBlacklistAPIView, TopNMostUsedTagsForUser,
	SelfUserAPIView, EditSelfAvatarAPIView, EditSelfEmailAPIView
)

app_name = 'core'

urlpatterns = [
	re_path(r'^users/self/block/author/?', BlockUserAPIView.as_view(), name='block_author'),
	re_path(r'^users/self/unblock/author/?', UnblockUserAPIView.as_view(), name='unblock_author'),
	re_path(r'^users/self/edit/avatar?$', EditSelfAvatarAPIView.as_view(), name='edit_self_avatar'),
	re_path(r'^users/self/edit/email?$', EditSelfEmailAPIView.as_view(), name='edit_self_email'),
	re_path(r'^users/self/edit/?$', EditSelfAPIView.as_view(), name='edit_self'),
	re_path(r'^users/self/subscribe/?', SubscribeToAuthorAPIView.as_view(), name='subscribe_to_author'),
	re_path(r'^users/self/unsubscribe/?', UnsubscribeFromAuthorAPIView.as_view(), name='unsubscribe_from_author'),
	re_path(r'^users/self/blacklist/?', UserBlacklistAPIView.as_view(), name='get_blacklist'),
	re_path(r'^users/self/?', SelfUserAPIView.as_view(), name='get_self'),
	re_path(r'^users/(?P<pk>\d+)/subscriptions/?', UserSubscriptionsAPIView.as_view(), name='get_subscriptions_for_user'),
	re_path(r'^users/(?P<pk>\d+)/tags/top/?', TopNMostUsedTagsForUser.as_view(), name='most_used_tags_for_user'),
	re_path(r'^users/(?P<pk>\d+)/?', UserDetailsAPIView.as_view(), name='get_user'),
	re_path(r'^admin/', include('core.administration.urls', namespace='administration'))
]

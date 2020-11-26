from django.urls import re_path

from artwork.views.artwork import (
	CreateArtworkAPIView, DeleteArtworkAPIView, EditArtworkAPIView,
	VoteForArtworkAPIView, ArtworkAPIView, ArtworksAPIView
)
from artwork.views.comment import (
	ReplyToCommentAPIView, VoteForCommentAPIView, CommentAPIView,
	CreateCommentAPIView, CommentsAPIView, EditCommentAPIView,
	DeleteCommentAPIView
)

app_name = 'artwork'

urlpatterns = [
	re_path(r'^create/?', CreateArtworkAPIView.as_view(), name='create'),
	re_path(r'^comments/(?P<pk>\d+)/edit/?', EditCommentAPIView.as_view(), name='edit_comment'),
	re_path(r'^comments/(?P<pk>\d+)/delete/?', DeleteCommentAPIView.as_view(), name='delete_comment'),
	re_path(r'^comments/(?P<pk>\d+)/reply/?', ReplyToCommentAPIView.as_view(), name='reply_to_comment'),
	re_path(r'^comments/(?P<pk>\d+)/vote/?', VoteForCommentAPIView.as_view(), name='vote_for_comment'),
	re_path(r'^comments/(?P<pk>\d+)/?', CommentAPIView.as_view(), name='get_comment'),
	re_path(r'^(?P<pk>\d+)/delete/?', DeleteArtworkAPIView.as_view(), name='delete'),
	re_path(r'^(?P<pk>\d+)/edit/?', EditArtworkAPIView.as_view(), name='edit'),
	re_path(r'^(?P<pk>\d+)/comments/create/?', CreateCommentAPIView.as_view(), name='create_comment'),
	re_path(r'^(?P<pk>\d+)/comments/?', CommentsAPIView.as_view(), name='get_comments'),
	re_path(r'^(?P<pk>\d+)/vote/?', VoteForArtworkAPIView.as_view(), name='vote'),
	re_path(r'^(?P<pk>\d+)/?', ArtworkAPIView.as_view(), name='get_artwork'),
	re_path(r'^$', ArtworksAPIView.as_view(), name='get_artworks')
]

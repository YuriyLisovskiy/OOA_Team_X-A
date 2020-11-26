from django.urls import re_path

from artwork.views import (
	ArtworksAPIView, ArtworkAPIView, VoteForArtworkAPIView,
	VoteForCommentAPIView, CommentAPIView, CommentsAPIView,
	ReplyToCommentAPIView, CreateCommentAPIView
)

app_name = 'artwork'

urlpatterns = [
	re_path(r'^comments/(?P<pk>\d+)/reply/?', ReplyToCommentAPIView.as_view(), name='reply_to_comment'),
	re_path(r'^comments/(?P<pk>\d+)/vote/?', VoteForCommentAPIView.as_view(), name='vote_on_comment'),
	re_path(r'^comments/(?P<pk>\d+)/?', CommentAPIView.as_view(), name='get_comments'),
	re_path(r'^(?P<pk>\d+)/comments/create/?', CreateCommentAPIView.as_view(), name='comment_on_artwork'),
	re_path(r'^(?P<pk>\d+)/comments/?', CommentsAPIView.as_view(), name='get_artworks_comments'),
	re_path(r'^(?P<pk>\d+)/vote/?', VoteForArtworkAPIView.as_view(), name='vote_on_artwork'),
	re_path(r'^(?P<pk>\d+)/?', ArtworkAPIView.as_view(), name='get_artwork'),
	re_path(r'^$',  ArtworksAPIView.as_view(), name='root')
]

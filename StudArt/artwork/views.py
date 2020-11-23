from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound

from artwork.models import ArtworkModel, CommentModel
from artwork.pagination import ArtworkSetPagination
from artwork.serializers import (
	ReadOnlyArtworkSerializer, ReadOnlyCommentSerializer, VoteForArtworkSerializer,
	VoteForCommentSerializer, CommentSerializer, CommentReplySerializer
)
from core.models import UserModel


# /api/v1/artworks
# methods:
#   - get
class ArtworksAPIView(generics.ListAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = ArtworkModel.objects.all()
	serializer_class = ReadOnlyArtworkSerializer
	pagination_class = ArtworkSetPagination

	@staticmethod
	def _or_q(initial, q):
		if initial is None:
			initial = q
		else:
			initial |= q

		return initial

	def get_queryset(self):
		request = self.request
		user = request.user
		required_q = ~Q(author__blocked_users__user=user)
		filter_by_subscriptions = request.GET.get(
			'filter_by_subscriptions', 'false'
		).lower() == 'true'
		optional_q = None
		if filter_by_subscriptions:
			optional_q = self._or_q(optional_q, Q(author__in=user.subscriptions))

		tag_filter = request.GET.getlist('tag', None)
		if tag_filter is not None:
			optional_q = self._or_q(optional_q, Q(tags__in=tag_filter))

		author_filter = request.GET.getlist('author', None)
		if author_filter is not None:
			authors = UserModel.objects.filter(username__in=author_filter)
			optional_q = self._or_q(optional_q, Q(author__in=authors))

		if optional_q is not None:
			required_q &= optional_q

		return self.queryset.filter(required_q).order_by('-creation_date_time')


# /api/v1/artworks/<pk>
# methods:
#   - get
class ArtworkAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = ArtworkModel.objects.all()
	serializer_class = ReadOnlyArtworkSerializer


# /api/v1/artworks/<pk>/vote
# methods:
#   - put
class VoteForArtworkAPIView(generics.UpdateAPIView):
	queryset = ArtworkModel.objects.all()
	serializer_class = VoteForArtworkSerializer


# /api/v1/artworks/<pk>/comments
# methods:
#   - get
class CommentsAPIView(generics.ListAPIView):
	serializer_class = ReadOnlyCommentSerializer
	queryset = CommentModel.objects.all()

	def get_queryset(self):
		artwork_pk = self.kwargs['pk']
		return self.queryset.filter(artwork_id=artwork_pk)


# /api/v1/artworks/comments/<pk>
# methods:
#   - get
class CommentAPIView(generics.RetrieveAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = ReadOnlyCommentSerializer


# /api/v1/artworks/<pk>/comments/create
# methods:
#   - post
class CreateCommentAPIView(generics.CreateAPIView):
	serializer_class = CommentSerializer

	def create(self, request, *args, **kwargs):
		full_data = request.data
		full_data.update(**{'artwork': self.kwargs['pk']})
		request._full_data = full_data
		return super(CreateCommentAPIView, self).create(request, *args, **kwargs)


# /api/v1/artworks/comments/<pk>/reply
# methods:
#   - post
class ReplyToCommentAPIView(generics.CreateAPIView):
	serializer_class = CommentReplySerializer

	def create(self, request, *args, **kwargs):
		full_data = request.data
		full_data.update(**{'comment': self.kwargs['pk']})
		request._full_data = full_data
		return super(ReplyToCommentAPIView, self).create(request, *args, **kwargs)


# /api/v1/artworks/comments/<pk>/vote
# methods:
#   - put
class VoteForCommentAPIView(generics.UpdateAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = VoteForCommentSerializer

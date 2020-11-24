from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from artwork.models import ArtworkModel, CommentModel
from artwork.pagination import ArtworkSetPagination
from artwork.permissions import ModifyArtworkPermission
from artwork.serializers import (
	ReadOnlyArtworkSerializer, ReadOnlyCommentSerializer, VoteForArtworkSerializer,
	VoteForCommentSerializer, CommentSerializer, CommentReplySerializer,
	CreateArtworkSerializer, ImageModelSerializer, EditArtworkSerializer
)
from artwork.utils import ensure_tags_exist
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
# path args:
#   - pk: primary key of an artwork
# methods:
#   - get
class ArtworkAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = ArtworkModel.objects.all()
	serializer_class = ReadOnlyArtworkSerializer


# /api/v1/artworks/create
# methods:
#   - post:
#       - description: string
#       - tags: array of strings
#       - images: array of images
class CreateArtworkAPIView(generics.CreateAPIView):
	queryset = ArtworkModel.objects.all()
	serializer_class = CreateArtworkSerializer

	required_keys = (
		'description', 'tags', 'images',
	)

	@staticmethod
	def ensure_images_exist(images, artwork_pk):
		res = []
		for img in images:
			serializer = ImageModelSerializer(data={
				'image': img,
				'artwork': artwork_pk
			})
			serializer.is_valid(raise_exception=True)
			serializer.save()
			res.append(serializer.data['id'])

		return res

	@staticmethod
	def _bad_request(msg):
		return Response(data={'message': msg}, status=400)

	def create(self, request, *args, **kwargs):
		full_data = request.data
		for key in self.required_keys:
			if key not in full_data:
				return self._bad_request('missing `{}` field'.format(key))

		images = full_data.pop('images')
		if len(images) == 0:
			return self._bad_request('at least one image is required')

		if not ensure_tags_exist(full_data.getlist('tags', [])):
			return self._bad_request('at least one tag is required')

		full_data['author'] = request.user.pk
		request._full_data = full_data
		resp = super(CreateArtworkAPIView, self).create(request, *args, **kwargs)
		images = self.ensure_images_exist(images, resp.data['id'])
		resp.data['images'] = images
		return resp


# /api/v1/artworks/<pk>/delete
# paths args:
#   - pk: primary key of artwork to delete
# methods:
#   - delete
class DeleteArtworkAPIView(generics.DestroyAPIView):
	queryset = ArtworkModel.objects.all()
	permission_classes = (
		IsAuthenticated & ModifyArtworkPermission,
	)


# /api/v1/artworks/<pk>/edit
# paths args:
#   - pk: primary key of artwork to delete
# methods:
#   - put:
#       - description: string
#       - tags: array of strings
class EditArtworkAPIView(generics.UpdateAPIView):
	queryset = ArtworkModel.objects.all()
	serializer_class = EditArtworkSerializer
	permission_classes = (
		IsAuthenticated & ModifyArtworkPermission,
	)

	def update(self, request, *args, **kwargs):
		if not ensure_tags_exist(request.data.getlist('tags', [])):
			return Response(
				data={'message': 'at least one tag is required'},
				status=400
			)

		return super(EditArtworkAPIView, self).update(request, *args, **kwargs)


# /api/v1/artworks/<pk>/vote
# path args:
#   - pk: primary key of artwork to vote for
# methods:
#   - put
class VoteForArtworkAPIView(generics.UpdateAPIView):
	queryset = ArtworkModel.objects.all()
	serializer_class = VoteForArtworkSerializer


# /api/v1/artworks/<pk>/comments
# path args:
#   - pk: primary key of parent artwork
# methods:
#   - get
class CommentsAPIView(generics.ListAPIView):
	serializer_class = ReadOnlyCommentSerializer
	queryset = CommentModel.objects.all()

	def get_queryset(self):
		artwork_pk = self.kwargs['pk']
		return self.queryset.filter(artwork_id=artwork_pk)


# /api/v1/artworks/comments/<pk>
# path args:
#   - pk: primary key of comment
# methods:
#   - get
class CommentAPIView(generics.RetrieveAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = ReadOnlyCommentSerializer


# /api/v1/artworks/<pk>/comments/create
# path args:
#   - pk: primary key of parent artwork
# methods:
#   - post
class CreateCommentAPIView(generics.CreateAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = CommentSerializer

	def create(self, request, *args, **kwargs):
		full_data = request.data
		full_data.update(**{'artwork': self.kwargs['pk']})
		request._full_data = full_data
		return super(CreateCommentAPIView, self).create(request, *args, **kwargs)


# /api/v1/artworks/comments/<pk>/reply
# path args:
#   - pk: primary key of parent comment
# methods:
#   - post
class ReplyToCommentAPIView(generics.CreateAPIView):
	queryset = CommentModel.objects.all()
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

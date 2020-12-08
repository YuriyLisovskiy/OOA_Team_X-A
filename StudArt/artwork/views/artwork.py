from django.db.models import Q
from django.http import QueryDict
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from artwork.models import ArtworkModel, TagModel
from artwork.pagination import ArtworkSetPagination
from artwork.permissions import ModifyArtworkPermission
from artwork.serializers.artwork_model import (
	ArtworkDetailsSerializer, CreateArtworkSerializer, EditArtworkSerializer,
	VoteForArtworkSerializer
)
from artwork.serializers.image_model import CreateImageModelSerializer
from artwork.utils import ensure_tags_exist
from core.models import UserModel


# /api/v1/artworks
# methods:
#   - get:
#       - columns: int
#       - page: int (page to load)
#       - filter_by_subscriptions: bool (optional)
#       - tag: string (can be of array type; optional)
#       - author: string (username of an author; can be of array type; optional)
# returns (success status - 200):
#   {
#       "count": <int (total pages quantity)>,
#       "next": <string (link to load next page)>,
#       "previous": <string (link to load previous page)>,
#       "results": [
# 	        {
# 	            "id": <int>,
# 	            "description": <string>,
# 	            "tags": <array ont strings>,
# 	            "points": <float>,
# 	            "creation_date": <string>,
# 	            "creation_time": <string>,
# 	            "images": <array of full urls of images>,
# 	            "author": <int (user pk)>,
# 	            "voted": <bool (shows if current user voted ot not)>,
# 	            "can_vote": <bool (shows if current user can vote this post)>,
# 	            "can_be_edited": <bool>,
# 	            "can_be_deleted": <bool>,
# 	            "comments": <array of primary keys of comments>
# 	        },
# 	        ...
# 	    ]
#   }
class ArtworksAPIView(generics.ListAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = ArtworkModel.objects.all()
	serializer_class = ArtworkDetailsSerializer
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
		required_q = None
		optional_q = None
		if user.is_authenticated:
			required_q = ~Q(author__blocked_users__pk=user.pk)
			filter_by_subscriptions = request.GET.get(
				'filter_by_subscriptions', 'false'
			).lower() == 'true'
			if filter_by_subscriptions:
				optional_q = self._or_q(optional_q, Q(author__in=user.subscriptions))

		tag_filter = request.GET.getlist('tag', None)
		if tag_filter is not None and len(tag_filter) > 0:
			optional_q = self._or_q(optional_q, Q(tags__in=tag_filter))

		author_filter = request.GET.getlist('author', None)
		if author_filter is not None and len(author_filter) > 0:
			authors = UserModel.objects.filter(username__in=author_filter)
			optional_q = self._or_q(optional_q, Q(author__in=authors))

		if optional_q is not None:
			if required_q is not None:
				required_q &= optional_q
			else:
				required_q = optional_q

		if required_q:
			queryset = self.queryset.filter(required_q)
		else:
			queryset = self.queryset.all()

		return queryset.order_by('-creation_date_time')


# /api/v1/artworks/<pk>
# path args:
#   - pk: primary key of an artwork
# methods:
#   - get
# returns (success status - 200):
#   {
#       "id": <int>,
# 	    "description": <string>,
# 	    "tags": <array ont strings>,
# 	    "points": <float>,
# 	    "creation_date": <string>,
# 	    "creation_time": <string>,
# 	    "images": <array of full urls of images>,
# 	    "author": <int (user pk)>,
# 	    "voted": <bool (shows if current user voted ot not)>,
# 	    "can_vote": <bool (shows if current user can vote this post)>,
#       "can_be_edited": <bool>,
#       "can_be_deleted": <bool>,
#       "comments_count": <int>
#   }
class ArtworkAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = ArtworkModel.objects.all()
	serializer_class = ArtworkDetailsSerializer


# /api/v1/artworks/create
# methods:
#   - post:
#       - description: string
#       - tags: array of strings
#       - images: array of images
# returns (success status - 201):
#   {
#       "id": <int (pk of created artwork)>
#   }
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
			serializer = CreateImageModelSerializer(data={
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
		data = request.data.dict()
		for key in self.required_keys:
			if key not in data:
				return self._bad_request('missing `{}` field'.format(key))

		data.pop('images')
		images = request.data.getlist('images')
		if len(images) == 0:
			return self._bad_request('at least one image is required')

		data.pop('tags')
		tags_pks = request.data.getlist('tags', [])
		if not ensure_tags_exist(tags_pks):
			return self._bad_request('at least one tag is required')

		data['author'] = request.user.pk
		full_data = QueryDict(mutable=True)
		full_data.update(**data)
		full_data.setlist('tags', tags_pks)
		request._full_data = full_data
		resp = super(CreateArtworkAPIView, self).create(request, *args, **kwargs)
		images = self.ensure_images_exist(images, resp.data['id'])
		resp.data['images'] = images

		last_used_tags = TagModel.objects.filter(pk__in=tags_pks)
		if last_used_tags.exists():
			request.user.last_used_tags.add(*last_used_tags)
			request.user.save()

		return resp


# /api/v1/artworks/<pk>/delete
# paths args:
#   - pk: primary key of artwork to delete
# methods:
#   - delete
# returns (success status - 204):
#   {}
class DeleteArtworkAPIView(generics.DestroyAPIView):
	queryset = ArtworkModel.objects.all()
	permission_classes = (
		IsAuthenticated & ModifyArtworkPermission,
	)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		author = instance.author
		self.perform_destroy(instance)
		author.recalculate_rating()
		author.save()
		return Response(status=status.HTTP_204_NO_CONTENT)


# /api/v1/artworks/<pk>/edit
# paths args:
#   - pk: primary key of artwork to delete
# methods:
#   - put:
#       - description: string (optional)
#       - tags: array of strings (optional)
# returns (success status - 200):
#   {}
class EditArtworkAPIView(generics.UpdateAPIView):
	queryset = ArtworkModel.objects.all()
	serializer_class = EditArtworkSerializer
	permission_classes = (
		IsAuthenticated & ModifyArtworkPermission,
	)

	def update(self, request, *args, **kwargs):
		if not ensure_tags_exist(request.data.get('tags', [])):
			if 'tags' in request.data:
				request.data.pop('tags')

		return super(EditArtworkAPIView, self).update(request, *args, **kwargs)


# /api/v1/artworks/<pk>/vote
# path args:
#   - pk: primary key of artwork to vote for
# methods:
#   - put:
#       - mark: int (value in range from -10 to 10)
# returns (success status - 200):
#   {
#       "points": <float>
#   }
class VoteForArtworkAPIView(generics.UpdateAPIView):
	queryset = ArtworkModel.objects.all()
	serializer_class = VoteForArtworkSerializer

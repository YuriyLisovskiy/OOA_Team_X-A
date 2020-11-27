from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from artwork.serializers.tag_model import TagDetailsSerializer
from core.mixins import UpdateUserModelMixin
from core.models import UserModel
from core.serializers.user_model import (
	UserDetailsSerializer, EditSelfUserSerializer, BlockUserSerializer,
	UnblockUserSerializer, SubscribeToAuthorSerializer, UnsubscribeFromAuthorSerializer
)


# /api/v1/core/users/<pk>
# path args:
#   - pk <int>: primary key of user object
# methods:
#   - get
# returns (success status - 200):
#   {
#       "id": <int>,
#       "first_name": <string>,
#       "last_name": <string>,
#       "username": <string>,
#       "email": <string>,
#       "avatar_link": <string (full url)>,
#       "is_superuser": <bool>,
#       "rating": <float>
#   }
class UserDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = UserModel.objects.all()
	serializer_class = UserDetailsSerializer


# /api/v1/core/users/self/edit
# methods:
#   - put: first_name, last_name
# methods:
#   - put (Content-Type must be `multipart/form-data`):
#       - first_name: string
#       - last_name: string
#       - avatar: image
# returns (success status - 200):
#   {
#       "avatar_link": <string> (full url)
#   }
class EditSelfAPIView(APIView, UpdateUserModelMixin):
	serializer_class = EditSelfUserSerializer


# /api/v1/core/users/self/block/author
# methods:
#   - put:
#       - author_pk: int (primary key of an author to block)
# returns (success status - 200):
#   {}
class BlockUserAPIView(APIView, UpdateUserModelMixin):
	serializer_class = BlockUserSerializer


# /api/v1/core/users/self/unblock/author
# methods:
#   - put:
#       - author_pk: int (primary key of an author to unblock)
# returns (success status - 200):
#   {}
class UnblockUserAPIView(APIView, UpdateUserModelMixin):
	serializer_class = UnblockUserSerializer


# /api/v1/core/users/self/subscribe
# methods:
#   - put:
#       - author_pk: int (primary key of an author to subscribe to)
# returns (success status - 200):
#   {}
class SubscribeToAuthorAPIView(APIView, UpdateUserModelMixin):
	serializer_class = SubscribeToAuthorSerializer


# /api/v1/core/users/self/unsubscribe
# methods:
#   - put:
#       - author_pk: int (primary key of an author to unsubscribe from)
# returns (success status - 200):
#   {}
class UnsubscribeFromAuthorAPIView(APIView, UpdateUserModelMixin):
	serializer_class = UnsubscribeFromAuthorSerializer


# /api/v1/core/users/<pk>/subscriptions
# path args:
#   - pk: primary key of user object
# methods:
#   - get:
#       - page: int (page to load)
# returns (success status - 200):
#   {
#       "count": <int (total pages quantity)>,
#       "next": <string (link to load next page)>,
#       "previous": <string (link to load previous page)>,
#       "results": [
# 	        {
# 	            "id": <int>,
# 	            "first_name": <string>,
# 	            "last_name": <string>,
# 	            "username": <string>,
# 	            "email": <string>,
# 	            "avatar_link": <string (full url)>,
# 	            "is_superuser": <bool>,
# 	            "rating": <float>
# 	        },
# 	        ...
# 	    ]
#   }
class UserSubscriptionsAPIView(generics.ListAPIView):
	serializer_class = UserDetailsSerializer
	pagination_class = PageNumberPagination

	def get_queryset(self):
		user_pk = self.kwargs['pk']
		user = UserModel.objects.filter(pk=user_pk)
		if not user.exists():
			raise NotFound('user not found')

		return user.first().subscriptions.all()


# /api/v1/core/users/self/blacklist
# methods:
#   - get:
#       - page: int (page to load)
# returns (success status - 200):
#   {
#       "count": <int (total pages quantity)>,
#       "next": <string (link to load next page)>,
#       "previous": <string (link to load previous page)>,
#       "results": [
# 	        {
# 	            "id": <int>,
# 	            "first_name": <string>,
# 	            "last_name": <string>,
# 	            "username": <string>,
# 	            "email": <string>,
# 	            "avatar_link": <string (full url)>,
# 	            "is_superuser": <bool>,
# 	            "rating": <float>
# 	        },
# 	        ...
# 	    ]
#   }
class UserBlacklistAPIView(generics.ListAPIView):
	serializer_class = UserDetailsSerializer
	pagination_class = PageNumberPagination

	def get_queryset(self):
		return self.request.user.blocked_users.all()


# /api/v1/core/users/<pk>/tags/top
# methods:
#   - get:
#       - limit: int (count of top most used tags to load)
# returns (success status - 200):
#   [
#       {
#           "text": <string>
#       },
#       ...
#   ]
class TopNMostUsedTagsForUser(generics.ListAPIView):
	serializer_class = TagDetailsSerializer
	default_limit = 5

	def get_queryset(self):
		request = self.request
		try:
			limit = int(request.data.get('limit', self.default_limit))
		except ValueError:
			limit = self.default_limit

		return request.user.last_used_tags.all().order_by('-pk').distinct('text')[:limit]

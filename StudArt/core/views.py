from django.core.validators import validate_email
from rest_framework import generics, permissions, exceptions
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from artwork.mixins import BlacklistMixin
from artwork.pagination import UserModelAllSetPagination
from artwork.serializers.tag_model import TagDetailsSerializer
from core.mixins import UpdateUserModelMixin, APIViewValidationMixin
from core.models import UserModel
from core.serializers.user_model import (
	UserDetailsSerializer, EditSelfUserSerializer, BlockUserSerializer,
	UnblockUserSerializer, SubscribeToAuthorSerializer, UnsubscribeFromAuthorSerializer,
	EditSelfUserAvatarSerializer
)
from core.validators import RequiredValidator, PasswordValidator


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
#       "rating": <float>,
#       "is_banned": <bool>,
#       "is_subscribed": <bool>,
#       "is_blocked": <bool>,
#       "show_full_name": <bool>,
#       "show_rating": <bool>,
#       "show_subscriptions": <bool>
#   }
class UserDetailsAPIView(generics.RetrieveAPIView, BlacklistMixin):
	permission_classes = (permissions.AllowAny,)
	queryset = UserModel.objects.all()
	serializer_class = UserDetailsSerializer

	def get_object(self):
		obj = super(UserDetailsAPIView, self).get_object()
		if self.is_blacklisted(self.request, obj):
			raise exceptions.NotFound()

		return obj


# /api/v1/core/users/self/edit
# methods:
#   - put:
#       - first_name: string
#       - last_name: string
#       - show_full_name: bool
#       - show_rating: bool
#       - show_subscriptions: bool
# returns (success status - 200):
#   {
#       "first_name": <string>
#       "last_name": <string>
#       "show_full_name": <bool>
#       "show_rating": <bool>
#       "show_subscriptions": <bool>
#   }
class EditSelfAPIView(APIView, UpdateUserModelMixin):
	serializer_class = EditSelfUserSerializer


# /api/v1/core/users/self/edit/avatar
# methods:
#   - put (Content-Type must be `multipart/form-data`):
#       - avatar: image
# returns (success status - 200):
#   {
#       "avatar_link": <string> (full url)
#   }
class EditSelfAvatarAPIView(APIView, UpdateUserModelMixin):
	serializer_class = EditSelfUserAvatarSerializer


# /api/v1/core/users/self/edit/email
# methods:
#   - put
#       - email: string
#       - password: string
# returns (success status - 200):
#   {
#       "email": <string>
#   }
class EditSelfEmailAPIView(APIView, UpdateUserModelMixin, APIViewValidationMixin):
	validators = (
		RequiredValidator(fields=('email', 'password')),
	)

	def update(self, request, *args, **kwargs):
		validated_data = self.validate_data(request)
		instance = self.get_object()
		if not instance.check_password(validated_data['password']):
			raise exceptions.NotAuthenticated('Password is incorrect.')

		email = validated_data['email']
		try:
			validate_email(email)
		except ValidationError:
			raise exceptions.ValidationError('Email is not valid.')

		instance.email = email
		instance.save()
		return Response(data={'email': email}, status=200)


# /api/v1/core/users/self/edit/password
# methods:
#   - put
#       - old_password: string
#       - new_password: string
# returns (success status - 200):
#   {}
class EditSelfPasswordAPIView(APIView, UpdateUserModelMixin, APIViewValidationMixin):
	validators = (
		RequiredValidator(fields=('old_password', 'new_password')),
		PasswordValidator(password_key='new_password')
	)

	def put(self, request, *args, **kwargs):
		validated_data = self.validate_data(request)
		user = self.get_object()
		if not user.check_password(validated_data['old_password']):
			raise exceptions.ValidationError('Current password is incorrect.')

		user.set_password(validated_data['new_password'])
		user.save()
		return Response(status=200)


# /api/v1/core/users/self/deactivate
# methods:
#   - put
#       - password: string
# returns (success status - 200):
#   {}
class DeactivateSelfAPIView(APIView, UpdateUserModelMixin, APIViewValidationMixin):
	validators = (
		RequiredValidator(fields=('password',)),
	)

	def put(self, request, *args, **kwargs):
		validated_data = self.validate_data(request)
		user = self.get_object()
		if not user.check_password(validated_data['password']):
			raise exceptions.ValidationError('Password is incorrect.')

		if not user.is_active:
			raise exceptions.ValidationError('Account is already deactivated')

		user.is_active = False
		user.save()
		return Response(status=200)


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
class SubscribeToAuthorAPIView(APIView, UpdateUserModelMixin, BlacklistMixin):
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
	permission_classes = (AllowAny,)
	serializer_class = UserDetailsSerializer
	pagination_class = UserModelAllSetPagination

	def get_queryset(self):
		user_pk = self.kwargs['pk']
		user = UserModel.objects.filter(pk=user_pk)
		if not user.exists():
			raise NotFound('user not found')

		user = user.first()
		subs = user.subscriptions
		if user.show_subscriptions:
			return subs.all().order_by('-subscriptions')

		return subs.none()


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
	pagination_class = UserModelAllSetPagination

	def get_queryset(self):
		return self.request.user.blocked_users.all().order_by('-blocked_users')


# /api/v1/core/users/self
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
class SelfUserAPIView(generics.RetrieveAPIView):
	serializer_class = UserDetailsSerializer
	queryset = UserModel.objects.all()

	def get_object(self):
		return self.request.user


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
	permission_classes = (AllowAny,)
	serializer_class = TagDetailsSerializer
	default_limit = 5
	pagination_class = None

	def get_queryset(self):
		request = self.request
		user_pk = self.kwargs.get('pk', request.user.pk)
		try:
			limit = int(request.data.get('limit', self.default_limit))
		except ValueError:
			limit = self.default_limit

		user = UserModel.objects.filter(pk=user_pk)
		if not user.exists():
			raise exceptions.NotFound('User is not found')

		return user.first().last_used_tags.all().order_by('-pk').distinct()[:limit]

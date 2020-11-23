from django.http import QueryDict
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination

from core.mixins import RequestUserViewMixin, DifferentModelUpdateAPIViewMixin
from core.models import UserModel
from core.serializers import (
	UserSerializer, SelfEditUserSerializer, UploadAvatarUserSerializer,
	BlockUserSerializer, UnblockUserSerializer, SubscribeToAuthorSerializer, UnsubscribeFromAuthorSerializer,
	CreateUserSerializer, ReadOnlyUserSerializer
)


# /api/v1/core/users/<pk>
# methods:
#   - get
class UserDetailsAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = UserModel.objects.all()
	serializer_class = UserSerializer


# /api/v1/core/users/self/uploadAvatar
# methods:
#   - put: image
class UploadAvatarAPIView(generics.UpdateAPIView, RequestUserViewMixin):
	permission_classes = permissions.IsAuthenticated
	serializer_class = UploadAvatarUserSerializer


# /api/v1/core/users/create
# methods:
#   - post
class CreateAccountAPIView(generics.CreateAPIView):
	permission_classes = (permissions.AllowAny,)
	serializer_class = CreateUserSerializer


# /api/v1/core/users/self/edit
# methods:
#   - put: first_name, last_name
class EditSelfAPIView(generics.UpdateAPIView, RequestUserViewMixin):
	serializer_class = SelfEditUserSerializer


# /api/v1/core/users/self/block/author
# methods:
#   - put: user_pk
class BlockUserAPIView(generics.UpdateAPIView, RequestUserViewMixin, DifferentModelUpdateAPIViewMixin):
	serializer_class = BlockUserSerializer

	def _get_serializer_data(self, request):
		q = QueryDict(request.body)
		return UserSerializer(UserModel.objects.get(pk=q.get('user_pk'))).data


# /api/v1/core/users/self/unblock/author
# methods:
#   - put: user_pk
class UnblockUserAPIView(generics.UpdateAPIView, RequestUserViewMixin, DifferentModelUpdateAPIViewMixin):
	serializer_class = UnblockUserSerializer

	def _get_serializer_data(self, request):
		q = QueryDict(request.body)
		return UserSerializer(UserModel.objects.get(pk=q.get('user_pk'))).data


# /api/v1/core/users/self/subscribe
# methods:
#   - put: user_pk
class SubscribeToAuthorAPIView(generics.UpdateAPIView, RequestUserViewMixin, DifferentModelUpdateAPIViewMixin):
	serializer_class = SubscribeToAuthorSerializer

	def _get_serializer_data(self, request):
		q = QueryDict(request.body)
		return UserSerializer(UserModel.objects.get(pk=q.get('user_pk'))).data


# /api/v1/core/users/self/unsubscribe
# methods:
#   - put: user_pk
class UnsubscribeFromAuthorAPIView(generics.UpdateAPIView, RequestUserViewMixin, DifferentModelUpdateAPIViewMixin):
	serializer_class = UnsubscribeFromAuthorSerializer

	def _get_serializer_data(self, request):
		q = QueryDict(request.body)
		return UserSerializer(UserModel.objects.get(pk=q.get('user_pk'))).data


# /api/v1/core/users/<pk>/subscriptions
# methods:
#   - get
class SubscriptionsAPIView(generics.ListAPIView):
	serializer_class = ReadOnlyUserSerializer

	def get_queryset(self):
		user_pk = self.kwargs['pk']
		user = UserModel.objects.filter(pk=user_pk)
		if not user.exists():
			raise NotFound('user not found')

		return user.first().subscriptions.all()


# /api/v1/core/users/<pk>/blacklist
# methods:
#   - get
class BlacklistAPIView(generics.ListAPIView):
	serializer_class = ReadOnlyUserSerializer
	pagination_class = PageNumberPagination

	def get_queryset(self):
		user_pk = self.kwargs['pk']
		user = UserModel.objects.filter(pk=user_pk)
		if not user.exists():
			raise NotFound('user not found')

		return user.first().blocked_users.all()

from rest_framework import generics, permissions

from core.models import User
from core.serializers import UserSerializer, SelfEditUserSerializer, UploadAvatarUserSerializer


# /api/v1/core/user/<id>
# methods:
#   - get
class UserDetailsView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = User.objects.all()
	serializer_class = UserSerializer


# /api/v1/core/user/self/uploadAvatar
# methods:
#   - put: image
class UploadAvatarView(generics.UpdateAPIView):
	serializer_class = UploadAvatarUserSerializer


# /api/v1/core/user/self/edit
# methods:
#   - put: first_name, last_name
class EditSelfView(generics.UpdateAPIView):
	serializer_class = SelfEditUserSerializer


class UserDetailsAdminView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer

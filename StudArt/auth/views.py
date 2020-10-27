from rest_framework import generics, permissions

from auth.serializers import UserWithTokenSerializer


# /api/v1/auth/register
# methods:
#   - post: username, email, password
class RegisterUserAPIView(generics.CreateAPIView):
	permission_classes = (permissions.AllowAny,)
	serializer_class = UserWithTokenSerializer

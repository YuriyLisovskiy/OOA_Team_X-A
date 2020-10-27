from rest_framework import generics

from core.serializers import SimpleUserSerializer, UserSerializer


# /api/v1/core/user/<id>
# methods:
#   - get
#   - put: first_name, last_name, avatar
class UserDetailsView(generics.RetrieveUpdateAPIView):
	serializer_class = SimpleUserSerializer


class UserDetailsAdminView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer

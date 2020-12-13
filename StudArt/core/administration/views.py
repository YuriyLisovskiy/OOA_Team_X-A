from rest_framework import generics

from core.administration.serializers import BanUserSerializer, UnbanUserSerializer
from core.models import UserModel
from core.permissions import IsSuperUser


# /api/v1/core/admin/users/<pk>/ban
# path args:
#   - pk: primary key of the user to ban
# methods:
#   - put
# returns (success status - 200):
#   {}
class BanUserAPIView(generics.UpdateAPIView):
	permission_classes = (IsSuperUser,)
	queryset = UserModel.objects.all()
	serializer_class = BanUserSerializer


# /api/v1/core/admin/users/<pk>/unban
# path args:
#   - pk: primary key of the user to unban
# methods:
#   - put
# returns (success status - 200):
#   {}
class UnbanUserAPIView(generics.UpdateAPIView):
	permission_classes = (IsSuperUser,)
	queryset = UserModel.objects.all()
	serializer_class = UnbanUserSerializer

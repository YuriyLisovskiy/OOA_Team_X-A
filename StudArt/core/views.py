from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from core.models import User
from core.serializers import UserSerializer, UserWithTokenSerializer


class UserDetailsView(generics.RetrieveAPIView):

	def retrieve(self, request, *args, **kwargs):
		account = User.get_by_id(kwargs.get('pk', None))
		if account:
			serializer = UserSerializer(account)
			return Response(serializer.data)

		return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def current_user(request):
	serializer = UserSerializer(request.user)
	return Response(serializer.data)


class UserList(ListAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = User.objects.all()
	serializer_class = UserSerializer

	@staticmethod
	def post(request):
		serializer = UserWithTokenSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

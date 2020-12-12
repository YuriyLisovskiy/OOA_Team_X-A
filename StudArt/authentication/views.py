from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.response import Response

from authentication.serializers import RegisterUserSerializer
from core.models import UserModel


# /api/v1/auth/register
# methods:
#   - post:
#       - username: string
#       - email: string
#       - password: string
# returns (in case of success):
#   {
#       "id": <int>,
#       "username": <string>,
#       "email": <string>,
#       "first_name": <string>,
#       "last_name": <string>,
#       "avatar": <string (avatar full link)>,
#       "is_superuser": <bool>,
#       "rating": <float>,
#       "token": <string (JWT token)>
#   }
class RegisterUserAPIView(generics.CreateAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = UserModel.objects.all()
	serializer_class = RegisterUserSerializer


# /api/v1/auth/user/exists
# methods:
#   - get (at least one field is required):
#       - username: string (optional)
#       - email: string (optional)
# returns in case of success (else 400):
#   {
#       "exists": <bool>,
#       "message": <string>
#   }
class UserExistsAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)

	def get(self, request, *args, **kwargs):
		q = None
		username = request.GET.get('username', None)
		if username:
			q = Q(username=username)

		email = request.GET.get('email', None)
		if email:
			email_q = Q(email=email)
			if q:
				q |= email_q
			else:
				q = email_q

		if not q:
			return Response(status=400)

		exists = UserModel.objects.filter(q).exists()
		data = {
			'exists': exists
		}
		if exists:
			data['message'] = 'User with this username and(or) email address already exists'
		else:
			data['message'] = 'User does not exist'

		return Response(data)

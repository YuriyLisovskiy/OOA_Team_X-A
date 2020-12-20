import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from authentication.views import UserExistsAPIView
from tests.common import APIFactoryTestCase


class UserExistsAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UserExistsAPITestCase, self).setUp()
		self.view = UserExistsAPIView.as_view()
		self.user_admin = User.objects.get(username='admin')
	
	def test_GetExistingUserByUsername(self):
		request = self.request_factory.get(reverse('api_v1:authentication:user_exists'),
										   {
											   'username': 'User'
										   })
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['exists'], True)
	
	def test_GetExistingUserByEmail(self):
		request = self.request_factory.get(reverse('api_v1:authentication:user_exists'),
											{
												'email': 'mail@mail.com'
											})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['exists'], True)
		
	def test_GetExistingUserByUsernameAndEmail(self):
		request = self.request_factory.get(reverse('api_v1:authentication:user_exists'),
										   {
											   'email': 'user@mail.com',
											   'username': 'User'
										   })
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['exists'], True)
	
	def test_GetUserNoData(self):
		request = self.request_factory.get(reverse('api_v1:authentication:user_exists'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
	
	def test_GetNonxistentUser(self):
		request = self.request_factory.get(reverse('api_v1:authentication:user_exists'),
										   {
											   'username': 'User6969'
										   })
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['exists'], False)

import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from auth.views import UserExistsAPIView
from tests.common import APIFactoryTestCase


class UserExistsAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UserExistsAPITestCase, self).setUp()
		self.view = UserExistsAPIView.as_view()
		self.user_admin = User.objects.get(username='admin')

	def test_registerUser(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'username': 'newName', 'email': 'valid@mail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_registerUserShortName(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'username': 'usr', 'email': 'valid@mail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_registerUserInvalidMail(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'username': 'newName', 'email': 'validmail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_registerUserWeakPassword(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'username': 'newName', 'email': 'valid@mail.com',
											'password': 'q'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_registerUserNoName(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'email': 'valid@mail.com',
											'password': 'q'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserNoMail(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'username': 'newName','password': 'q'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserNoPassword(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'username': 'newName', 'email': 'valid@mail.com'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserNoData(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'))
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserTwice(self):
		request = self.request_factory.get(reverse('api_v1:auth:register'),
										   {'username': 'newName', 'email': 'valid@mail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

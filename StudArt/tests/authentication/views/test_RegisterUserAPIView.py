import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from authentication.views import RegisterUserAPIView
from tests.common import APIFactoryTestCase


class RegisterUserAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(RegisterUserAPITestCase, self).setUp()
		self.view = RegisterUserAPIView.as_view()
		self.user_admin = User.objects.get(username='admin')

	def test_registerUser(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'username': 'newName', 'email': 'valid@mail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

	def test_registerUserShortName(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'username': 'usr', 'email': 'valid@mail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserInvalidMail(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'username': 'newName', 'email': 'validmail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserWeakPassword(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'username': 'newName', 'email': 'valid@mail.com',
											'password': 'q'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserNoName(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'email': 'valid@mail.com',
											'password': 'q'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserNoMail(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'username': 'newName','password': 'q'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserNoPassword(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'username': 'newName', 'email': 'valid@mail.com'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserNoData(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'))
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_registerUserTwice(self):
		request = self.request_factory.post(reverse('api_v1:authentication:register'),
										   {'username': 'newName', 'email': 'valid@mail.com',
											'password': 'strOng_Passw0rd'})
		# force_authenticate(request, user=self.user_user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


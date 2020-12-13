import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.administration.views import BanUserAPIView
from tests.common import APIFactoryTestCase


class BanUserAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(BanUserAPITestCase, self).setUp()
		self.view = BanUserAPIView.as_view()
		self.admin_user = User.objects.get(username='admin')
		self.user = User.objects.get(username='User')
	
	def test_BanUser(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:ban_user', args=[1]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_BanUserNonAdmin(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:ban_user', args=[2]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=2)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_BanNonexistentUser(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:ban_user', args=[9999]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_BanUserUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:ban_user', args=[1]))
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_BanUserTwice(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:ban_user', args=[1]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_BanSelf(self):
		request = self.request_factory.put(reverse('api_v1:core:core.administration:ban_user', args=[5]))
		force_authenticate(request, self.admin_user)
		response = self.view(request, pk=5)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		
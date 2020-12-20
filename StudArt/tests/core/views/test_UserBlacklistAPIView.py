import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import UserBlacklistAPIView
from tests.common import APIFactoryTestCase


class UserBlacklistAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UserBlacklistAPITestCase, self).setUp()
		self.view = UserBlacklistAPIView.as_view()
		self.user_3 = User.objects.get(username='User3')
		self.user = User.objects.get(username='User')
	
	def test_GetBlacklist(self):
		request = self.request_factory.get(reverse('api_v1:core:get_blacklist'), {
			'page': '1'
		})
		force_authenticate(request, self.user_3)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_GetBlacklistNonexPage(self):
		request = self.request_factory.get(reverse('api_v1:core:get_blacklist'), {
			'page': '9999'
		})
		force_authenticate(request, self.user_3)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_GetBlacklistUnauthenticated(self):
		request = self.request_factory.get(reverse('api_v1:core:get_blacklist'), {
			'page': '1'
		})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
	
	def test_GetBlacklistNoBlacklisted(self):
		request = self.request_factory.get(reverse('api_v1:core:get_blacklist'), {
			'page': '1'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['results']), 0)

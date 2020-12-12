import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import UserDetailsAPIView
from tests.common import APIFactoryTestCase


class UserDetailsAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UserDetailsAPITestCase, self).setUp()
		self.view = UserDetailsAPIView.as_view()
		self.user = User.objects.get(username='User')
		self.user_3 = User.objects.get(username='User3')

	def test_GetInfo(self):
		request = self.request_factory.get(reverse('api_v1:core:get_user', args=[1]))
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
	def test_GetInfoUserBannedYou(self):
		request = self.request_factory.get(reverse('api_v1:core:get_user', args=[3]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_GetInfoYouBannedUser(self):
		request = self.request_factory.get(reverse('api_v1:core:get_user', args=[1]))
		force_authenticate(request, self.user_3)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_GetInfoOfSelf(self):
		request = self.request_factory.get(reverse('api_v1:core:get_user', args=[1]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

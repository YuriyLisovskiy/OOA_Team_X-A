import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import DeactivateSelfAPIView
from tests.common import APIFactoryTestCase


class DeactivateSelfAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(DeactivateSelfAPITestCase, self).setUp()
		self.view = DeactivateSelfAPIView.as_view()
		self.user = User.objects.get(username='User')
		self.user_2 = User.objects.get(username='User2')
		self.user_3 = User.objects.get(username='User3')
	
	def test_DeactivateValid(self):
		request = self.request_factory.put(reverse('api_v1:core:deactivate_self'), {
			'password': 'qwerty'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_DeactivateInvalid(self):
		request = self.request_factory.put(reverse('api_v1:core:deactivate_self'), {
			'password': 'qerty'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
	
	def test_DeactivateUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:core:deactivate_self'), {
			'password': 'qwerty'
		})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
	
	def test_DeactivateNoData(self):
		request = self.request_factory.put(reverse('api_v1:core:deactivate_self'))
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

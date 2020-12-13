import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import SubscribeToAuthorAPIView
from tests.common import APIFactoryTestCase


class SubscribeToAuthorAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(SubscribeToAuthorAPITestCase, self).setUp()
		self.view = SubscribeToAuthorAPIView.as_view()
		self.user = User.objects.get(username='User')
		self.user_2 = User.objects.get(username='User2')
		self.user_3 = User.objects.get(username='User3')
	
	def test_Subscribe(self):
		request = self.request_factory.put(reverse('api_v1:core:subscribe_to_author'), {
			'author_pk': '2'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_SubscribeTwice(self):
		request = self.request_factory.put(reverse('api_v1:core:subscribe_to_author'), {
			'author_pk': '2'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_SubscribeToNonexistent(self):
		request = self.request_factory.put(reverse('api_v1:core:subscribe_to_author'), {
			'author_pk': '9999'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_SubscribeUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:core:subscribe_to_author'), {
			'author_pk': '2'
		})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_SubscribeToSelf(self):
		request = self.request_factory.put(reverse('api_v1:core:subscribe_to_author'), {
			'author_pk': '1'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

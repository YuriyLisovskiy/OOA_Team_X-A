import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import UnsubscribeFromAuthorAPIView
from tests.common import APIFactoryTestCase


class UnsubscribeFromAuthorAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UnsubscribeFromAuthorAPITestCase, self).setUp()
		self.view = UnsubscribeFromAuthorAPIView.as_view()
		self.user = User.objects.get(username='User4')
	
	def test_Unsubscribe(self):
		request = self.request_factory.put(reverse('api_v1:core:unsubscribe_from_author'), {
			'author_pk': '1'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_UnsubscribeTwice(self):
		request = self.request_factory.put(reverse('api_v1:core:unsubscribe_from_author'), {
			'author_pk': '1'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
	
	def test_UnsubscribeFromNonexistent(self):
		request = self.request_factory.put(reverse('api_v1:core:unsubscribe_from_author'), {
			'author_pk': '9999'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_UnsubscribeUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:core:unsubscribe_from_author'), {
			'author_pk': '1'
		})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
	
	def test_UnsubscribeFromSelf(self):
		request = self.request_factory.put(reverse('api_v1:core:unsubscribe_from_author'), {
			'author_pk': '4'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

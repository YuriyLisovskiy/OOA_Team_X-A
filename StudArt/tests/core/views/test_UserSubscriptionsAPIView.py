import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import UserSubscriptionsAPIView
from tests.common import APIFactoryTestCase


class UserSubscriptionsAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UserSubscriptionsAPITestCase, self).setUp()
		self.view = UserSubscriptionsAPIView.as_view()
		self.user = User.objects.get(username='User4')
	
	def test_GetSubscriptions(self):
		request = self.request_factory.get(reverse('api_v1:core:get_subscriptions_for_user', args=[4]), {
			'page': '1'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=4)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_GetSubscriptionsNonexPage(self):
		request = self.request_factory.get(reverse('api_v1:core:get_subscriptions_for_user', args=[4]), {
			'page': '9999'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=4)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_GetSubscriptionsUnauthenticated(self):
		request = self.request_factory.get(reverse('api_v1:core:get_subscriptions_for_user', args=[4]), {
			'page': '1'
		})
		response = self.view(request, pk=4)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_GetSubscriptionsNonexistent(self):
		request = self.request_factory.get(reverse('api_v1:core:get_subscriptions_for_user', args=[9999]), {
			'page': '1'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_GetSubscriptionsNoSubscriptions(self):
		request = self.request_factory.get(reverse('api_v1:core:get_subscriptions_for_user', args=[1]), {
			'page': '1'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['results']), 0)

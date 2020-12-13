import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import TopNMostUsedTagsForUser
from tests.common import APIFactoryTestCase


class TopNMostUsedTagsForUserTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(TopNMostUsedTagsForUserTestCase, self).setUp()
		self.view = TopNMostUsedTagsForUser.as_view()
		self.user_3 = User.objects.get(username='User3')
		self.user = User.objects.get(username='User')
	
	def test_GetTop3MostUsedTagsForUser(self):
		request = self.request_factory.get(reverse('api_v1:core:most_used_tags_for_user', args=[1]), {
			'limit': '3'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 3)
	
	def test_GetTop0MostUsedTagsForUser(self):
		request = self.request_factory.get(reverse('api_v1:core:most_used_tags_for_user', args=[1]), {
			'limit': '0'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 0)
	
	def test_GetTopNeg3MostUsedTagsForUser(self):
		request = self.request_factory.get(reverse('api_v1:core:most_used_tags_for_user', args=[1]), {
			'limit': '-3'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 5)
	
	def test_GetTopNMostUsedTagsForNonexistentUser(self):
		request = self.request_factory.get(reverse('api_v1:core:most_used_tags_for_user', args=[9999]), {
			'limit': '3'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
	
	def test_GetTop3MostUsedTagsForUserUnauthenticated(self):
		request = self.request_factory.get(reverse('api_v1:core:most_used_tags_for_user', args=[1]), {
			'limit': '3'
		})
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 3)
	
	def test_GetTopDefaultMostUsedTagsForUser(self):
		request = self.request_factory.get(reverse('api_v1:core:most_used_tags_for_user', args=[1]))
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 5)
	
	def test_GetTopMoreThanHasMostUsedTagsForUser(self):
		request = self.request_factory.get(reverse('api_v1:core:most_used_tags_for_user', args=[1]), {
			'limit': '9999'
		})
		force_authenticate(request, self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 6)

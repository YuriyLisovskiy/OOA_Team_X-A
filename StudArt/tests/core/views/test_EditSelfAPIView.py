import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import EditSelfAPIView
from tests.common import APIFactoryTestCase


class EditSelfAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(EditSelfAPITestCase, self).setUp()
		self.view = EditSelfAPIView.as_view()
		self.user = User.objects.get(username='User')
	
	def test_EditAllFields(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self'), {
			'first_name': 'Linus',
			'last_name': 'Solin',
			'show_full_name': True,
			'show_rating': True,
			'show_subscriptions': True
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_EditNoFields(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self'))
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_EditUnauthorised(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self'))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

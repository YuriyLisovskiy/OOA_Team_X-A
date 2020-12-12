import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import EditSelfEmailAPIView
from tests.common import APIFactoryTestCase


class EditSelfEmailAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(EditSelfEmailAPITestCase, self).setUp()
		self.view = EditSelfEmailAPIView.as_view()
		self.user = User.objects.get(username='User')
		self.user_3 = User.objects.get(username='User3')
	
	def test_EditValid(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_email'), {
			'password': 'qwerty',
			'email': 'q@q.q'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_EditInvalid(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_email'), {
			'password': 'qwerty',
			'email': 'qq.q'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
	
	def test_EditInvalidPassword(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_email'), {
			'password': 'qwer',
			'email': 'q@q.q'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
	
	def test_EditUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_email'), {
			'password': 'qwerty',
			'email': 'q@q.q'
		})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

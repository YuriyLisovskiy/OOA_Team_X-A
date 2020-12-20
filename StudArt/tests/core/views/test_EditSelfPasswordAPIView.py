import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from core.views import EditSelfPasswordAPIView
from tests.common import APIFactoryTestCase


class EditSelfPasswordAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(EditSelfPasswordAPITestCase, self).setUp()
		self.view = EditSelfPasswordAPIView.as_view()
		self.user = User.objects.get(username='User')
		self.user_2 = User.objects.get(username='User2')
		self.user_3 = User.objects.get(username='User3')
	
	def test_EditValid(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_password'), {
			'old_password': 'qwerty',
			'new_password': 'qqqqqqqq'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_EditValid2(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_password'), {
			'old_password': '12345678',
			'new_password': 'qqqqqqqq'
		})
		force_authenticate(request, self.user_2)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_EditInvalidNew(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_password'), {
			'old_password': 'qwerty',
			'new_password': 'q'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
	
	def test_EditInvalidPassword(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_password'), {
			'old_password': 'qwer',
			'new_password': 'qwerqwer'
		})
		force_authenticate(request, self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
	
	def test_EditUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:core:edit_self_password'), {
			'old_password': 'qwerty',
			'new_password': 'qwerqwer'
		})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

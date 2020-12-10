import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from auth.views import UserExistsAPIView
from tests.common import APIFactoryTestCase


class UserExistsAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(UserExistsAPITestCase, self).setUp()
		self.view = UserExistsAPIView.as_view()
		self.user_admin = User.objects.get(username='admin')


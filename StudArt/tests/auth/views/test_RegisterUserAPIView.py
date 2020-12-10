import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from auth.views import RegisterUserAPIView
from tests.common import APIFactoryTestCase


class RegisterUserAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(RegisterUserAPITestCase, self).setUp()
		self.view = RegisterUserAPIView.as_view()
		self.user_admin = User.objects.get(username='admin')


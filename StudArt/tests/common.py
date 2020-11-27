from rest_framework.test import APITestCase, APIRequestFactory

from artwork.models import ArtworkModel
from core.models import UserModel


class APIFactoryTestCase(APITestCase):
	def setUp(self) -> None:
		super(APIFactoryTestCase, self).setUp()
		self.request_factory = APIRequestFactory()

	@classmethod
	def setUpTestData(cls):
		# Set up non-modified objects used by all test methods
		UserModel.objects.create(username='User', email='mail@mail.com')
		ArtworkModel.objects.create(description='Some description 1', author=UserModel.objects.first())
		ArtworkModel.objects.create(description='Some description 2', author=UserModel.objects.first())
		ArtworkModel.objects.create(description='Some description 3', author=UserModel.objects.first())


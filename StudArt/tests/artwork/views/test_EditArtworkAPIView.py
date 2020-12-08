from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_jwt.serializers import User

from artwork.views.artwork import EditArtworkAPIView
from tests.common import APIFactoryTestCase


class EditArtworkTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(EditArtworkTestCase, self).setUp()
		self.view = EditArtworkAPIView.as_view()
		self.user = User.objects.get(username='User', email='mail@mail.com')

	def test_EditDescription(self):
		new_description = "New artwork description"
		request = self.request_factory.put(reverse('api_v1:artwork:edit', args=[3]), {'description': new_description})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=3)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_EditTagsWithExistingTagModels(self):
		new_tags = ['tag1', 'tag2']
		request = self.request_factory.put(reverse('api_v1:artwork:edit', args=[3]), {'tags': new_tags})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=3)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_EditTagsWithNonexistentTagModels(self):
		new_tags = ['tag1', 'newtag2']
		request = self.request_factory.put(reverse('api_v1:artwork:edit', args=[3]), {'tags': new_tags})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=3)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_EditUnauthenticated(self):
		new_description = "New artwork description"
		request = self.request_factory.put(reverse('api_v1:artwork:edit', args=[1]), {'description': new_description})
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_EditNonexistent(self):
		new_description = "New artwork description"
		request = self.request_factory.put(reverse('api_v1:artwork:edit', args=[9999]), {'description': new_description})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_EditNotYourOwn(self):
		new_description = "New artwork description"
		request = self.request_factory.put(reverse('api_v1:artwork:edit', args=[14]), {'description': new_description})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=14)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

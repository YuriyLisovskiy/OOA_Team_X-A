from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from artwork.views.artwork import DeleteArtworkAPIView
from tests.common import APIFactoryTestCase


class DeleteArtworkTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(DeleteArtworkTestCase, self).setUp()
		self.view = DeleteArtworkAPIView.as_view()
		self.user = User.objects.get(username='User', email='mail@mail.com')

	def test_Delete(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete', args=[3]))
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=3)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

	def test_DeleteNonexistent(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete', args=[9999]))
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_DeleteUnauthenticated(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete', args=[1]))
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_DeleteNotYours(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete', args=[12]))
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=12)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

from django.urls import reverse
from rest_framework import status
from artwork.views.artwork import ArtworkAPIView
from tests.common import APIFactoryTestCase


class ArtworkAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(ArtworkAPITestCase, self).setUp()
		self.view = ArtworkAPIView.as_view()

	def test_getArtwork(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artwork', args=[1]))
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id'], 1)
		self.assertEqual(response.data['description'], 'Some description 1')
		self.assertEqual(response.data['points'], 0)

	def test_getNonexistentArtwork(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artwork', args=[9999]))
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

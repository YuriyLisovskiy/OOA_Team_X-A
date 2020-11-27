from rest_framework import status

from artwork.views.artwork import ArtworksAPIView
from tests.common import APIFactoryTestCase


class ArtworksAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(ArtworksAPITestCase, self).setUp()
		self.view = ArtworksAPIView.as_view()

	def test_getArtworksTwoColumnsOnePage(self):
		request = self.request_factory.get('/api/v1/artworks', {'columns': 2, 'page': 1})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 3)
		self.assertEqual(len(response.data['results']), 2)

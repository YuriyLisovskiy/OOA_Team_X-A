from rest_framework import status
from artwork.views.artwork import ArtworkAPIView
from tests.common import APIFactoryTestCase


class ArtworkAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(ArtworkAPITestCase, self).setUp()
		self.view = ArtworkAPIView.as_view()

	def test_getArtwork(self):
		request = self.request_factory.get('/api/v1/artworks/1')
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id'], 1)
		self.assertEqual(response.data['description'], 'Some description 1')
		self.assertEqual(response.data['points'], 0)

from django.urls import reverse
from rest_framework import status

from artwork.views.artwork import ArtworksAPIView
from tests.common import APIFactoryTestCase


class ArtworksAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(ArtworksAPITestCase, self).setUp()
		self.view = ArtworksAPIView.as_view()

	def test_getArtworksTwoColumnsFirstPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 2, 'page': 1})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 12)
		self.assertEqual(len(response.data['results']), 2)

	def test_getArtworksFourColumnsFirstPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 4, 'page': 1})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 12)
		self.assertEqual(len(response.data['results']), 4)

	def test_getArtworksFourColumnsSecondPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 4, 'page': 2})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 12)
		self.assertEqual(len(response.data['results']), 4)

	def test_getArtworksOutOfBoundsPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 3, 'page': 5})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_getArtworksFilterByTagFirstPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 3, 'page': 1, 'tag': 'tag1'})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 5)
		self.assertEqual(len(response.data['results']), 3)

	def test_getArtworksFilterByTagSecondPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 3, 'page': 2, 'tag': 'tag1'})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 5)
		self.assertEqual(len(response.data['results']), 2)

	def test_getArtworksFilterByAuthorFirstPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 3, 'page': 1, 'author': 'User'})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 6)
		self.assertEqual(len(response.data['results']), 3)

	def test_getArtworksFilterByAuthorSecondPage(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_artworks'), {'columns': 3, 'page': 2, 'author': 'User'})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 6)
		self.assertEqual(len(response.data['results']), 3)

# todo: test filter_by_subscriptions

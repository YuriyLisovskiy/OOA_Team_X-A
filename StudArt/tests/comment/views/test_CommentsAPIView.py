from django.urls import reverse
from rest_framework import status
from artwork.views.comment import CommentsAPIView
from tests.common import APIFactoryTestCase


class ArtworkAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(ArtworkAPITestCase, self).setUp()
		self.view = CommentsAPIView.as_view()

	def test_GetCommentsOfArtwork(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_comments', args=[1]), {'answers': False})
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['results']), 5)

	def test_GetCommentsOfComment(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_comments', args=[1]), {'answers': True})
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['results']), 4)

	def test_GetCommentsOfNonexistentArtwork(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_comments', args=[9999]), {'answers': False})
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['results']), 0)

	def test_GetCommentsOfNonexistentComment(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_comments', args=[18]), {'answers': True})
		response = self.view(request, pk=18)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['results']), 0)


from django.urls import reverse
from rest_framework import status
from artwork.views.comment import CommentAPIView
from tests.common import APIFactoryTestCase


class CommentAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(CommentAPITestCase, self).setUp()
		self.view = CommentAPIView.as_view()

	def test_GetComment(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_comment', args=[1]))
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id'], 1)
		self.assertEqual(response.data['text'], 'Some comment 1')
		self.assertEqual(response.data['author']['username'], 'User')

	def test_GetNonexistentComment(self):
		request = self.request_factory.get(reverse('api_v1:artwork:get_comment', args=[9999]))
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

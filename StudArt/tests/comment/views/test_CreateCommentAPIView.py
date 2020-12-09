from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from artwork.views.comment import CreateCommentAPIView
from tests.common import APIFactoryTestCase


class CommentAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(CommentAPITestCase, self).setUp()
		self.view = CreateCommentAPIView.as_view()
		self.user = User.objects.create_user(username='olivia', password='StrongPassword12345')

	def test_CreateCommentAuthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create_comment', args=[1]), {'text': 'Some new comment'})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

	def test_CreateCommentEmptyMessageAuthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create_comment', args=[1]), {'text': ''})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_CreateCommentUnauthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create_comment', args=[1]), {'text': 'Some new comment'})
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_CreateCommentOnNonexistentArtwork(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create_comment', args=[9999]),
											{'text': 'Some new comment'})
		force_authenticate(request, user=self.user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

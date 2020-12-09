from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from artwork.views.comment import DeleteCommentAPIView
from tests.common import APIFactoryTestCase


class DeleteCommentAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(DeleteCommentAPITestCase, self).setUp()
		self.view = DeleteCommentAPIView.as_view()
		self.user_olivia = User.objects.create_user(username='olivia', password='StrongPassword12345')
		self.user_user = User.objects.get(username='User', email='mail@mail.com')

	def test_DeleteComment(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete_comment', args=[16]))
		force_authenticate(request, user=self.user_user)
		response = self.view(request, pk=14)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_DeleteCommentUnauthenticated(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete_comment', args=[16]))
		response = self.view(request, pk=14)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_DeleteCommentWithReplies(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete_comment', args=[1]))
		force_authenticate(request, user=self.user_user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_DeleteNonexistentComment(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete_comment', args=[9999]))
		force_authenticate(request, user=self.user_user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_DeleteNotYourComment(self):
		request = self.request_factory.delete(reverse('api_v1:artwork:delete_comment', args=[16]))
		force_authenticate(request, user=self.user_olivia)
		response = self.view(request, pk=16)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from artwork.views.comment import CancelVoteForCommentAPIView
from tests.common import APIFactoryTestCase


class CancelVoteForCommentAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(CancelVoteForCommentAPITestCase, self).setUp()
		self.view = CancelVoteForCommentAPIView.as_view()
		self.user_olivia = User.objects.create_user(username='olivia', email='oliviamail@mail.com', password='StrongPassword12345')
		self.user_user = User.objects.get(username='User', email='mail@mail.com')

	def test_CancelVoteForComment(self):
		request = self.request_factory.put(reverse('api_v1:artwork:cancel_vote_for_comment', args=[1]))
		force_authenticate(request, user=self.user_olivia)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['points'], 0)

	def test_CancelVoteForCommentUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:artwork:cancel_vote_for_comment', args=[1]))
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_CancelVoteForNonexistentComment(self):
		request = self.request_factory.put(reverse('api_v1:artwork:cancel_vote_for_comment', args=[9999]))
		force_authenticate(request, user=self.user_olivia)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

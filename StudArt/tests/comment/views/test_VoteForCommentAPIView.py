from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from artwork.views.comment import VoteForCommentAPIView
from tests.common import APIFactoryTestCase


class VoteForCommentAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(VoteForCommentAPITestCase, self).setUp()
		self.view = VoteForCommentAPIView.as_view()
		self.user_olivia = User.objects.create_user(username='olivia', email='oliviamail@mail.com', password='StrongPassword12345')
		self.user_user = User.objects.get(username='User', email='mail@mail.com')

	def test_VoteForComment(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote_for_comment', args=[1]), {'mark': 1})
		force_authenticate(request, user=self.user_olivia)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['points'], 1)

	def test_VoteForCommentUnauthenticated(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote_for_comment', args=[1]), {'mark': 1})
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_VoteForCommentTwice(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote_for_comment', args=[1]), {'mark': 1})
		force_authenticate(request, user=self.user_olivia)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['points'], 1)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_VoteForNonexistentComment(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote_for_comment', args=[9999]), {'mark': 1})
		force_authenticate(request, user=self.user_olivia)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

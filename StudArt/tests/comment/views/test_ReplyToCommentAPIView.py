import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework_simplejwt.state import User

from artwork.views.comment import ReplyToCommentAPIView, CommentsAPIView
from tests.common import APIFactoryTestCase


class ReplyToCommentAPITestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(ReplyToCommentAPITestCase, self).setUp()
		self.view = ReplyToCommentAPIView.as_view()
		self.user_olivia = User.objects.create_user(username='olivia', email='oliviamail@mail.com', password='StrongPassword12345')
		self.user_user = User.objects.get(username='User', email='mail@mail.com')

	def test_ReplyToComment(self):
		request = self.request_factory.post(reverse('api_v1:artwork:edit_comment', args=[16]), json.dumps({"text": 'New text'}), content_type='application/json')
		force_authenticate(request, user=self.user_olivia)
		response = self.view(request, pk=16)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

	def test_ReplyToCommentUnauthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:edit_comment', args=[16]), {"text": 'New text'}, content_type='application/json')
		response = self.view(request, pk=16)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_ReplyToCommentWithReplies(self):
		request = self.request_factory.post(reverse('api_v1:artwork:edit_comment', args=[1]), json.dumps({"text": 'New text'}), content_type='application/json')
		force_authenticate(request, user=self.user_olivia)
		old_count = len(CommentsAPIView.as_view()(self.request_factory.get(reverse('api_v1:artwork:get_comments', args=[1]), {
			"answers": True}, content_type='application/json'), pk=1).data['results'])
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(len(CommentsAPIView.as_view()(self.request_factory.get(reverse('api_v1:artwork:get_comments', args=[1]), {
			"answers": True}, content_type='application/json'), pk=1).data['results']), old_count + 1)

	def test_ReplyToNonexistentComment(self):
		request = self.request_factory.post(reverse('api_v1:artwork:edit_comment', args=[9999]), {"text": 'New text'}, content_type='application/json')
		force_authenticate(request, user=self.user_user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

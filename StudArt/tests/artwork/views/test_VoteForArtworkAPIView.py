from django.urls import reverse
from rest_framework import status
from rest_framework_jwt.serializers import User
from rest_framework.test import force_authenticate

from artwork.views.artwork import VoteForArtworkAPIView
from tests.common import APIFactoryTestCase


class VoteForArtworkTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(VoteForArtworkTestCase, self).setUp()
		self.view = VoteForArtworkAPIView.as_view()

	def test_voteUnauthenticated(self):
		# url = reverse('api_v1:artwork:vote', args=[1])
		request = self.request_factory.put(reverse('api_v1:artwork:vote', args=[1]))
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_voteAuthenticated(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote', args=[1]), {'mark': 3})
		user = User.objects.create_user(username='olivia', password='StrongPassword12345')
		force_authenticate(request, user=user)
		response = self.view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_voteNonexistent(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote', args=[9999]), {'mark': 0})
		user = User.objects.create_user(username='olivia', password='StrongPassword12345')
		force_authenticate(request, user=user)
		response = self.view(request, pk=9999)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_voteAddOnePoint(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote', args=[1]), {'mark': 5})
		user = User.objects.create_user(username='olivia', password='StrongPassword12345')
		force_authenticate(request, user=user)
		response = self.view(request, pk=1)
		self.assertEqual(response.data['points'], 5.0)

	def test_voteSeveralPeople(self):
		request = self.request_factory.put(reverse('api_v1:artwork:vote', args=[1]), {'mark': 5})
		user = User.objects.create_user(username='olivia', password='StrongPassword12345')
		user2 = User.objects.create_user(username='olivia2', password='StrongPassword12345')
		user3 = User.objects.create_user(username='olivia3', password='StrongPassword12345')
		force_authenticate(request, user=user)
		self.view(request, pk=1)
		force_authenticate(request, user=user2)
		self.view(request, pk=1)
		force_authenticate(request, user=user3)
		response = self.view(request, pk=1)
		self.assertEqual(response.data['points'], 15/3)

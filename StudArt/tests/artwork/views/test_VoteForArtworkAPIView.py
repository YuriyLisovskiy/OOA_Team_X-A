from django.urls import reverse
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from rest_framework import status
from rest_framework_jwt.serializers import User

from artwork.views import VoteForArtworkAPIView
from tests.factories import ArtworkFactory


class VoteForArtwork(APITestCase):

	def test_voteUnauthenticated(self):
		factory = APIRequestFactory()
		request = factory.put('/api/v1/artworks/1/vote')
		view = VoteForArtworkAPIView.as_view()
		response = view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_voteAuthenticated(self):
		#artworks = ArtworkFactory.create()
		factory = APIRequestFactory()
		#url = reverse('api_v1:artwork:vote_on_artwork', args=[1])
		request = factory.put('/api/v1/artworks/1/vote')
		user = User.objects.create_user(username='olivia', password='StrongPassword12345')
		force_authenticate(request, user=user)
		view = VoteForArtworkAPIView.as_view()
		response = view(request, pk=1)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

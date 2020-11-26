from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase, URLPatternsTestCase
from django.test import TestCase
from django.urls import include, path, reverse


class GetArtworkTestCase(APITestCase, URLPatternsTestCase):
	urlpatterns = [
		path('api/v1/artworks/', include('artwork.urls')),
	]
	urls = 'artwork.urls'

	# def test_get_existing_artwork(self):
	# 	url = reverse('get_artwork', args=[1])
	# 	response = self.client.get(
	# 		url,
	# 		data={'pk': '1'},
	# 		content_type='application/json'
	# 	)
	# 	self.assertEqual(response.status_code, status.HTTP_200_OK)

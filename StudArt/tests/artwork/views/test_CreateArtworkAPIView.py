from django.urls import reverse
from os.path import join, dirname
from rest_framework import status
from tests.common import APIFactoryTestCase
from rest_framework_jwt.serializers import User
from rest_framework.test import force_authenticate
from django.core.files.uploadedfile import SimpleUploadedFile

from artwork.views.artwork import CreateArtworkAPIView, ArtworkAPIView


class CreateArtworkTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(CreateArtworkTestCase, self).setUp()
		self.view = CreateArtworkAPIView.as_view()
		self.view_getArtwork = ArtworkAPIView.as_view()
		self.user = User.objects.create_user(username='olivia', password='StrongPassword12345')

	def test_CreateOneImageOneTagAuthenticated(self):
		img_path = join(dirname(dirname(dirname(__file__))), join("img", "test_image.jpg"))
		image = SimpleUploadedFile(name='test_image.jpg', content=open(img_path, 'rb').read(),
								   content_type='image/jpeg')
		post_description = 'Description of new artwork'
		tags = ['new tag']
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': post_description, 'tags': tags, 'images': [image]})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		new_id = response.data['id']
		request = self.request_factory.get(reverse('api_v1:artwork:get_artwork', args=[new_id]))
		response = self.view_getArtwork(request, pk=new_id)
		self.assertEqual(response.data['description'], post_description)
		self.assertEqual(response.data['tags'], tags)
		self.assertEqual(len(response.data['images']), 1)

	def test_CreateMultipleImagesOneTagAuthenticated(self):
		img_path = join(dirname(dirname(dirname(__file__))), join("img", "test_image.jpg"))
		img_path2 = join(dirname(dirname(dirname(__file__))), join("img", "test_image2.jpg"))
		img_path3 = join(dirname(dirname(dirname(__file__))), join("img", "test_image3.jpg"))
		image = SimpleUploadedFile(name='test_image.jpg', content=open(img_path, 'rb').read(),
								   content_type='image/jpeg')
		image2 = SimpleUploadedFile(name='test_image2.jpg', content=open(img_path2, 'rb').read(),
									content_type='image/jpeg')
		image3 = SimpleUploadedFile(name='test_image3.jpg', content=open(img_path3, 'rb').read(),
									content_type='image/jpeg')
		post_description = 'Description of new artwork'
		tags = ['new tag']
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': post_description, 'tags': tags,
											 'images': [image, image2, image3]})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		new_id = response.data['id']
		request = self.request_factory.get(reverse('api_v1:artwork:get_artwork', args=[new_id]))
		response = self.view_getArtwork(request, pk=new_id)
		self.assertEqual(response.data['description'], post_description)
		self.assertEqual(response.data['tags'], tags)
		self.assertEqual(len(response.data['images']), 3)

	def test_CreateOneImgMultipleTagsAuthenticated(self):
		img_path = join(dirname(dirname(dirname(__file__))), join("img", "test_image.jpg"))
		image = SimpleUploadedFile(name='test_image.jpg', content=open(img_path, 'rb').read(),
								   content_type='image/jpeg')
		post_description = 'Description of new artwork'
		tags = ['new tag', 'new tag 2', 'new tag 3']
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': post_description, 'tags': tags, 'images': [image]})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		new_id = response.data['id']
		request = self.request_factory.get(reverse('api_v1:artwork:get_artwork', args=[new_id]))
		response = self.view_getArtwork(request, pk=new_id)
		self.assertEqual(response.data['description'], post_description)
		self.assertEqual(response.data['tags'], tags)
		self.assertEqual(len(response.data['images']), 1)

	def test_CreateNoImgAuthenticated(self):
		i = list()
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': 'Description of new artwork', 'tags': ['new tag'],
											 'images': i})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	# todo: can't replicate empty list. current request sends with missing images field

	def test_CreateNoTagsAuthenticated(self):
		img_path = join(dirname(dirname(dirname(__file__))), join("img", "test_image.jpg"))
		image = SimpleUploadedFile(name='test_image.jpg', content=open(img_path, 'rb').read(),
								   content_type='image/jpeg')
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': 'Description of new artwork', 'tags': [],
											 'images': [image]})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	# todo: can't replicate empty list. current request sends with missing tags field

	def test_CreateMissingFieldDescriptionAuthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create'), {'tags': ['new tag'], 'images': [
			SimpleUploadedFile(name='test_image.jpg',
							   content=open(join(dirname(dirname(dirname(__file__))), join("img", "test_image.jpg")),
											'rb').read(), content_type='image/jpeg')]})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_CreateMissingFieldTagsAuthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': 'Description of new artwork', 'images': [
												SimpleUploadedFile(name='test_image.jpg', content=open(
													join(dirname(dirname(dirname(__file__))),
														 join("img", "test_image.jpg")), 'rb').read(),
																   content_type='image/jpeg')]})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_CreateMissingFieldImagesAuthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': 'Description of new artwork', 'tags': ['new tag']})
		force_authenticate(request, user=self.user)
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_CreateUnauthenticated(self):
		request = self.request_factory.post(reverse('api_v1:artwork:create'),
											{'description': 'Description of new artwork', 'tags': ['new tag']})
		response = self.view(request)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

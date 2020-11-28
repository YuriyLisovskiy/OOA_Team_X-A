from rest_framework.test import APITestCase, APIRequestFactory

from artwork.models import ArtworkModel, TagModel
from core.models import UserModel


class APIFactoryTestCase(APITestCase):
	def setUp(self) -> None:
		super(APIFactoryTestCase, self).setUp()
		self.request_factory = APIRequestFactory()

	@classmethod
	def setUpTestData(cls):
		# Set up non-modified objects used by all test methods
		UserModel.objects.create(username='User', email='mail@mail.com')
		UserModel.objects.create(username='User2', email='mail2@mail.com')
		TagModel.objects.create(text='tag1')
		TagModel.objects.create(text='tag2')
		TagModel.objects.create(text='tag3')
		TagModel.objects.create(text='tag4')
		TagModel.objects.create(text='tag5')
		ArtworkModel.objects.create(description='Some description 1', author=UserModel.objects.get(username='User'))
		ArtworkModel.objects.create(description='Some description 2', author=UserModel.objects.get(username='User'))
		ArtworkModel.objects.create(description='Some description 3', author=UserModel.objects.get(username='User'))
		ArtworkModel.objects.create(description='Some description 4', author=UserModel.objects.get(username='User'))
		ArtworkModel.objects.create(description='Some description 5', author=UserModel.objects.get(username='User'))
		ArtworkModel.objects.create(description='Some description 6', author=UserModel.objects.get(username='User'))
		ArtworkModel.objects.create(description='Some description 7', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 8', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 9', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 10', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 11', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 12', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 13', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 14', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 15', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 16', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 17', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 18', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 19', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 20', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 21', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.create(description='Some description 22', author=UserModel.objects.get(username='User2'))
		ArtworkModel.objects.get(description='Some description 1').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 2').tags.set([TagModel.objects.get(text='tag2'), TagModel.objects.get(text='tag4')])
		ArtworkModel.objects.get(description='Some description 3').tags.set([TagModel.objects.get(text='tag3'), TagModel.objects.get(text='tag5')])
		ArtworkModel.objects.get(description='Some description 4').tags.set([TagModel.objects.get(text='tag4'), TagModel.objects.get(text='tag1')])
		ArtworkModel.objects.get(description='Some description 5').tags.set([TagModel.objects.get(text='tag5'), TagModel.objects.get(text='tag2')])
		ArtworkModel.objects.get(description='Some description 6').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 7').tags.set([TagModel.objects.get(text='tag2'), TagModel.objects.get(text='tag4')])
		ArtworkModel.objects.get(description='Some description 8').tags.set([TagModel.objects.get(text='tag3'), TagModel.objects.get(text='tag5')])
		ArtworkModel.objects.get(description='Some description 9').tags.set([TagModel.objects.get(text='tag4'), TagModel.objects.get(text='tag1')])
		ArtworkModel.objects.get(description='Some description 10').tags.set([TagModel.objects.get(text='tag5'), TagModel.objects.get(text='tag2')])
		ArtworkModel.objects.get(description='Some description 11').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 12').tags.set([TagModel.objects.get(text='tag2'), TagModel.objects.get(text='tag4')])
		ArtworkModel.objects.get(description='Some description 13').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 14').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 15').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 16').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 17').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])
		ArtworkModel.objects.get(description='Some description 18').tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag3')])

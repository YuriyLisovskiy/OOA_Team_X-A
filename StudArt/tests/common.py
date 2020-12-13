from rest_framework.test import APITestCase, APIRequestFactory

from artwork.models import ArtworkModel, TagModel, CommentModel
from core.models import UserModel


class APIFactoryTestCase(APITestCase):
	def setUp(self) -> None:
		super(APIFactoryTestCase, self).setUp()
		self.request_factory = APIRequestFactory()

	@classmethod
	def setUpTestData(cls):
		# Set up non-modified objects used by all test methods
		user1 = UserModel.objects.create(username='User', email='mail@mail.com')
		user1.set_password('qwerty')
		user2 = UserModel.objects.create(username='User2', email='mail2@mail.com')
		user2.set_password('12345678')
		UserModel.objects.create(username='User3', email='mail3@mail.com', )
		UserModel.objects.create(username='User4', email='mail4@mail.com', )
		UserModel.objects.create(username='admin', email='admin@mail.com', is_superuser=True)
		UserModel.objects.get(username='User3').blocked_users.set([UserModel.objects.get(username='User')])
		UserModel.objects.get(username='User4').subscriptions.set([UserModel.objects.get(username='User')])
		TagModel.objects.create(text='tag1')
		TagModel.objects.create(text='tag2')
		TagModel.objects.create(text='tag3')
		TagModel.objects.create(text='tag4')
		TagModel.objects.create(text='tag5')
		TagModel.objects.create(text='tag6')
		TagModel.objects.create(text='tag7')
		TagModel.objects.create(text='tag8')
		TagModel.objects.create(text='tag9')
		UserModel.objects.get(username='User').last_used_tags.set([TagModel.objects.get(text='tag1'), TagModel.objects.get(text='tag2'), TagModel.objects.get(text='tag3'), TagModel.objects.get(text='tag4'), TagModel.objects.get(text='tag5'), TagModel.objects.get(text='tag6')])
		ArtworkModel.objects.create(description='Some description 1', author=UserModel.objects.get(username='User'), points=5)
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
		CommentModel.objects.create(text='Some comment 1', author=UserModel.objects.get(username='User'), artwork=ArtworkModel.objects.get(description='Some description 1'))
		CommentModel.objects.create(text='Some comment 2', author=UserModel.objects.get(username='User2'), comment=CommentModel.objects.get(text='Some comment 1'))
		CommentModel.objects.create(text='Some comment 3', author=UserModel.objects.get(username='User2'), comment=CommentModel.objects.get(text='Some comment 1'))
		CommentModel.objects.create(text='Some comment 4', author=UserModel.objects.get(username='User2'), comment=CommentModel.objects.get(text='Some comment 1'))
		CommentModel.objects.create(text='Some comment 5', author=UserModel.objects.get(username='User2'), comment=CommentModel.objects.get(text='Some comment 1'))
		CommentModel.objects.create(text='Some comment 6', author=UserModel.objects.get(username='User'), comment=CommentModel.objects.get(text='Some comment 2'))
		CommentModel.objects.create(text='Some comment 7', author=UserModel.objects.get(username='User2'), comment=CommentModel.objects.get(text='Some comment 3'))
		CommentModel.objects.create(text='Some comment 8', author=UserModel.objects.get(username='User'), comment=CommentModel.objects.get(text='Some comment 4'))
		CommentModel.objects.create(text='Some comment 9', author=UserModel.objects.get(username='User2'), comment=CommentModel.objects.get(text='Some comment 5'))
		CommentModel.objects.create(text='Some comment 10', author=UserModel.objects.get(username='User2'), artwork=ArtworkModel.objects.get(description='Some description 1'))
		CommentModel.objects.create(text='Some comment 11', author=UserModel.objects.get(username='User2'), artwork=ArtworkModel.objects.get(description='Some description 1'))
		CommentModel.objects.create(text='Some comment 12', author=UserModel.objects.get(username='User2'), artwork=ArtworkModel.objects.get(description='Some description 1'))
		CommentModel.objects.create(text='Some comment 13', author=UserModel.objects.get(username='User2'), artwork=ArtworkModel.objects.get(description='Some description 1'))
		CommentModel.objects.create(text='Some comment 14', author=UserModel.objects.get(username='User2'), artwork=ArtworkModel.objects.get(description='Some description 2'))
		CommentModel.objects.create(text='Some comment 15', author=UserModel.objects.get(username='User'), comment=CommentModel.objects.get(text='Some comment 14'))
		CommentModel.objects.create(text='Some comment 16', author=UserModel.objects.get(username='User'), artwork=ArtworkModel.objects.get(description='Some description 2'))
		CommentModel.objects.create(text='Some comment 17', author=UserModel.objects.get(username='User'), artwork=ArtworkModel.objects.get(description='Some description 18'))

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

	avatar = models.ImageField(null=True, blank=True, upload_to='media')
	rating = models.FloatField(default=0)

	@staticmethod
	def get_by_id(pk):
		account = User.objects.filter(pk=pk)
		if account.exists():
			return account.first()

		return None

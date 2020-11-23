from django.contrib.auth.models import AbstractUser
from django.db import models


class UserModel(AbstractUser):

	avatar = models.ImageField(null=True, blank=True, upload_to='media')
	rating = models.FloatField(default=0)
	blocked_users = models.ManyToManyField('core.models.UserModel', 'blocked_users')
	subscriptions = models.ManyToManyField('core.models.UserModel', 'subscriptions')

from django.contrib.auth.models import AbstractUser
from django.db import models


class UserModel(AbstractUser):

	avatar = models.ImageField(null=True, blank=True, upload_to='media')
	rating = models.FloatField(default=0)
	blocked_users = models.ManyToManyField(to='core.UserModel', related_name='blacklist')
	subscriptions = models.ManyToManyField(to='core.UserModel', related_name='subs')

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Sum


class UserModel(AbstractUser):
	is_banned = models.BooleanField(default=False)
	avatar = models.ImageField(null=True, blank=True, upload_to='media')
	rating = models.FloatField(default=0)
	blocked_users = models.ManyToManyField(to='core.UserModel', related_name='blacklist', blank=True)
	subscriptions = models.ManyToManyField(to='core.UserModel', related_name='subs', blank=True)
	last_used_tags = models.ManyToManyField(to='artwork.TagModel', related_name='used_by_users', blank=True)

	def recalculate_rating(self):
		self.rating = self.artworks.aggregate(Sum('points'))['points__sum'] / self.artworks.count()

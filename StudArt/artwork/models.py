import datetime as dt

from django.db import models

from core.models import UserModel


def utc_now():
	return dt.datetime.now(tz=dt.timezone.utc)


class TagModel(models.Model):
	text = models.CharField(primary_key=True, max_length=100)


class ArtworkModel(models.Model):
	description = models.TextField(max_length=3000, null=True, blank=True)
	tags = models.ManyToManyField(to=TagModel, related_name='tags', blank=True)
	points = models.FloatField(default=0)
	creation_date = models.DateField(default=utc_now)
	creation_time = models.TimeField(default=utc_now)
	creation_date_time = models.DateTimeField(default=utc_now)
	author = models.ForeignKey(to=UserModel, on_delete=models.CASCADE, related_name='artworks')
	voters = models.ManyToManyField(to=UserModel, related_name='voted_artworks', blank=True)


class ImageModel(models.Model):
	image = models.ImageField()
	artwork = models.ForeignKey(to=ArtworkModel, on_delete=models.CASCADE, related_name='images')

	@property
	def url(self):
		return self.image.url


class CommentModel(models.Model):
	text = models.CharField(max_length=500)
	points = models.IntegerField(default=0)
	author = models.ForeignKey(to=UserModel, on_delete=models.SET_NULL, related_name='comments', null=True, blank=True)
	creation_date = models.DateField(default=utc_now)
	creation_time = models.TimeField(default=utc_now)
	creation_date_time = models.DateTimeField(default=utc_now)
	is_discussion = models.BooleanField(default=False)
	artwork = models.ForeignKey(to=ArtworkModel, on_delete=models.CASCADE, related_name='comments', blank=True, null=True)
	comment = models.ForeignKey(to='self', on_delete=models.CASCADE, related_name='answers', blank=True, null=True)
	up_voters = models.ManyToManyField(to=UserModel, related_name='up_voted_comments', blank=True)
	down_voters = models.ManyToManyField(to=UserModel, related_name='down_voted_comments', blank=True)

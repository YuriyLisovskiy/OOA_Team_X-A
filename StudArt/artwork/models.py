from django.db import models

from core.models import UserModel


class TagModel(models.Model):
	text = models.CharField(primary_key=True, max_length=100)


class ArtworkModel(models.Model):
	description = models.TextField(max_length=3000, null=True, blank=True)
	tags = models.ManyToManyField(to=TagModel, related_name='tags', blank=True)
	points = models.FloatField(default=0)
	creation_date = models.DateField(auto_now=True)
	creation_time = models.TimeField(auto_now=True)
	creation_date_time = models.DateTimeField(auto_now=True)
	author = models.ForeignKey(to=UserModel, on_delete=models.CASCADE, related_name='artworks')
	voters = models.ManyToManyField(to=UserModel, related_name='voted_artworks', blank=True)


class ImageModel(models.Model):
	image = models.ImageField()
	artwork = models.ForeignKey(to=ArtworkModel, on_delete=models.CASCADE, related_name='images')


class CommentModel(models.Model):
	text = models.CharField(max_length=500)
	points = models.IntegerField(default=0)
	author = models.ForeignKey(to=UserModel, on_delete=models.SET_NULL, related_name='comments', null=True, blank=True)
	creation_date = models.DateField(auto_now=True)
	creation_time = models.TimeField(auto_now=True)
	is_discussion = models.BooleanField(default=False)
	artwork = models.ForeignKey(to=ArtworkModel, on_delete=models.CASCADE, related_name='comments', blank=True)
	comment = models.ForeignKey(to='self', on_delete=models.CASCADE, related_name='answers', blank=True)
	voters = models.ManyToManyField(to=UserModel, related_name='voted_comments', blank=True)

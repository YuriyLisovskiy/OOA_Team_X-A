from django.db import models

from core.models import User


class Tag(models.Model):
	text = models.CharField(primary_key=True, max_length=100)


class Artwork(models.Model):
	description = models.TextField(max_length=3000, null=True, blank=True)
	tags = models.ManyToManyField(to=Tag, related_name='tags', blank=True)
	points = models.PositiveIntegerField(default=0)
	creation_date = models.DateField(auto_now=True)
	creation_time = models.TimeField(auto_now=True)
	image = models.ImageField()
	author = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='artworks')
	voters = models.ManyToManyField(to=User, related_name='voted_artworks', blank=True)


class Comment(models.Model):
	text = models.CharField(max_length=500)
	points = models.PositiveIntegerField(default=0)
	author = models.ForeignKey(to=User, on_delete=models.SET_NULL, related_name='comments', null=True, blank=True)
	creation_date = models.DateField(auto_now=True)
	creation_time = models.TimeField(auto_now=True)
	is_discussion = models.BooleanField(default=False)
	artwork = models.ForeignKey(to=Artwork, on_delete=models.CASCADE, related_name='comments', blank=True)
	comment = models.ForeignKey(to='self', on_delete=models.CASCADE, related_name='answers', blank=True)
	voters = models.ManyToManyField(to=User, related_name='voted_comments', blank=True)

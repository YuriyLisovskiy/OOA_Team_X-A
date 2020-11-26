from django.conf import settings
from rest_framework import serializers

from artwork.models import ArtworkModel
from artwork.serializers.common import VoteSerializer, ReadOnlyUserLinkSerializer
from core.validators import RequiredValidator


def get_artwork_images_links(request, artwork):
	links = []
	images = artwork.images.all()
	for image in images:
		links.append(request.build_absolute_uri(image.url))

	if len(links) == 0:
		links.append(settings.DEFAULT_NO_IMAGE_URL)

	return links


class ArtworkDetailsSerializer(serializers.ModelSerializer):
	tags = serializers.SerializerMethodField()
	voted = serializers.SerializerMethodField()
	can_vote = serializers.SerializerMethodField()
	author = serializers.SerializerMethodField()
	images = serializers.SerializerMethodField()
	creation_date = serializers.SerializerMethodField()
	creation_time = serializers.SerializerMethodField()

	def __init__(self, *args, **kwargs):
		super(ArtworkDetailsSerializer, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].read_only = True

	@staticmethod
	def get_tags(obj):
		return [tag.text for tag in obj.tags.all()]

	def get_voted(self, obj):
		request = self.context.get('request', None)
		assert request is not None
		return request.user.is_authenticated and obj.voters.filter(
			pk=request.user.id
		).exists()

	def get_can_vote(self, obj):
		request = self.context.get('request', None)
		assert request is not None
		return obj.author.pk != request.user.pk

	def get_author(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	def get_images(self, obj):
		request = self.context.get('request', None)
		assert request is not None
		return get_artwork_images_links(request, obj)

	@staticmethod
	def get_creation_date(obj):
		return obj.creation_date.strftime(settings.DATE_FORMAT)

	@staticmethod
	def get_creation_time(obj):
		return obj.creation_time.strftime(settings.TIME_FORMAT)

	class Meta:
		model = ArtworkModel
		fields = (
			'id', 'description', 'tags', 'points', 'creation_date', 'creation_time',
			'images', 'author', 'voted', 'can_vote', 'comments'
		)


class CreateArtworkSerializer(serializers.ModelSerializer):

	class Meta:
		model = ArtworkModel
		fields = (
			'id', 'description', 'tags', 'images', 'author'
		)
		read_only_fields = ('id',)
		extra_kwargs = {
			'description': {'write_only': True},
			'tags': {'write_only': True},
			'images': {'write_only': True},
			'author': {'write_only': True}
		}
		validators = [
			RequiredValidator(fields=('description', 'tags', 'images', 'author'))
		]


class EditArtworkSerializer(serializers.ModelSerializer):

	class Meta:
		model = ArtworkModel
		extra_kwargs = {
			'description': {'write_only': True},
			'tags': {'write_only': True}
		}
		fields = ('description', 'tags')


class VoteForArtworkSerializer(VoteSerializer):

	def calc_points(self, curr_points, curr_voters_count, mark):
		return ((curr_points * curr_voters_count) + mark) / (curr_voters_count + 1)

	class Meta:
		model = ArtworkModel
		fields = ('mark', 'points')
		mark_range = range(-10, 12)
		validators = [
			RequiredValidator(fields=('mark',))
		]

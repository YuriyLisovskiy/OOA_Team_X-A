import datetime as dt

from django.conf import settings
from django.db.models import Sum
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from artwork.models import ArtworkModel
from artwork.serializers.common import ReadOnlyUserLinkSerializer
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
	one_h_as_sec = 3600

	tags = serializers.SerializerMethodField()
	voted = serializers.SerializerMethodField()
	can_vote = serializers.SerializerMethodField()
	author = serializers.SerializerMethodField()
	images = serializers.SerializerMethodField()
	creation_date = serializers.SerializerMethodField()
	creation_time = serializers.SerializerMethodField()
	comments_count = serializers.SerializerMethodField()
	can_be_edited = serializers.SerializerMethodField()
	can_be_deleted = serializers.SerializerMethodField()
	votes_count = serializers.SerializerMethodField()

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

	@staticmethod
	def get_comments_count(obj):
		return obj.comments.count()

	def get_can_be_edited(self, obj):
		return self._check_can_be_modified(obj)

	def get_can_be_deleted(self, obj):
		return self._check_can_be_modified(obj)

	def _check_can_be_modified(self, obj):
		request = self.context.get('request', None)
		if not request:
			return False

		time_is_out = (dt.datetime.now(tz=dt.timezone.utc) - obj.creation_date_time).seconds >= self.one_h_as_sec
		if time_is_out:
			return False

		if obj.author.id != request.user.id:
			return False

		if obj.comments.count() > 0:
			return False

		return obj.voters.count() == 0

	@staticmethod
	def get_votes_count(obj):
		return obj.voters.count()

	class Meta:
		model = ArtworkModel
		fields = (
			'id', 'description', 'tags', 'points', 'creation_date', 'creation_time',
			'images', 'author', 'voted', 'can_vote', 'comments_count', 'can_be_edited',
			'can_be_deleted', 'votes_count'
		)


class CreateArtworkSerializer(serializers.ModelSerializer):

	class Meta:
		model = ArtworkModel
		fields = (
			'id', 'description', 'tags', 'author'
		)
		read_only_fields = ('id',)
		extra_kwargs = {
			'description': {'write_only': True},
			'tags': {'write_only': True},
			'author': {'write_only': True}
		}
		validators = [
			RequiredValidator(fields=('description', 'tags', 'author'))
		]


class EditArtworkSerializer(serializers.ModelSerializer):

	class Meta:
		model = ArtworkModel
		extra_kwargs = {
			'description': {'write_only': True},
			'tags': {'write_only': True}
		}
		fields = ('description', 'tags')


class VoteForArtworkSerializer(serializers.ModelSerializer):
	mark = serializers.IntegerField(write_only=True)
	votes_count = serializers.SerializerMethodField()

	@staticmethod
	def get_votes_count(obj):
		return obj.voters.count()

	@staticmethod
	def calc_points(curr_points, total_items_count, mark):
		return ((curr_points * total_items_count) + mark) / (total_items_count + 1)

	def update(self, instance, validated_data):
		request = self.context.get('request')
		if request.user.id == instance.author.id:
			raise ValidationError('self-voting is forbidden')

		if instance.voters.filter(pk=request.user.id).exists():
			raise ValidationError('re-voting is forbidden')

		mark = validated_data['mark']
		if mark not in self.Meta.mark_range:
			raise ValidationError('mark is out of range')

		instance.points = self.calc_points(
			instance.points, instance.voters.count(), mark
		)
		instance.voters.add(request.user)
		instance.save()

		# re-calculate author's rating
		instance.author.rating = instance.author.artworks.aggregate(
			Sum('points')
		)['points__sum'] / instance.author.artworks.count()
		instance.author.save()
		return instance

	class Meta:
		model = ArtworkModel
		fields = ('mark', 'points', 'votes_count')
		read_only_fields = ('points', 'votes_count')
		mark_range = range(-10, 12)
		validators = [
			RequiredValidator(fields=('mark',))
		]

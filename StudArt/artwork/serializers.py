from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from artwork.models import TagModel, ArtworkModel, CommentModel, ImageModel
from core.models import UserModel


class TagModelSerializer(serializers.ModelSerializer):

	class Meta:
		model = TagModel
		fields = ('text',)


class ImageModelSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = ImageModel
		fields = ('id', 'image', 'artwork')


class ReadOnlyUserLinkSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)
	username = serializers.CharField(read_only=True)
	avatar = serializers.SerializerMethodField(read_only=True)

	def get_avatar(self, obj):
		request = self.context.get('request')
		if obj.avatar:
			return request.build_absolute_uri(obj.avatar.url)

		return settings.DEFAULT_NO_IMAGE_URL

	class Meta:
		model = UserModel
		fields = ('id', 'username', 'avatar')


class CommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = CommentModel
		fields = (
			'text', 'author', 'artwork'
		)


class CommentReplySerializer(serializers.ModelSerializer):

	class Meta:
		model = CommentModel
		fields = (
			'text', 'author', 'comment'
		)


class ReadOnlyCommentSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)
	answers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
	author = serializers.SerializerMethodField(read_only=True)
	creation_date = serializers.SerializerMethodField(read_only=True)
	creation_time = serializers.SerializerMethodField(read_only=True)

	def get_author(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	@staticmethod
	def get_creation_date(obj):
		return obj.creation_date.strftime(settings.DATE_FORMAT)

	@staticmethod
	def get_creation_time(obj):
		return obj.creation_time.strftime(settings.TIME_FORMAT)

	class Meta:
		model = CommentModel
		fields = (
			'id', 'text', 'points', 'author',
			'creation_date', 'creation_time', 'answers'
		)


class CreateArtworkSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = ArtworkModel
		fields = (
			'id', 'description', 'tags', 'images', 'author'
		)


class EditArtworkSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = ArtworkModel
		fields = (
			'id', 'description', 'tags'
		)


class ReadOnlyArtworkSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)
	tags = serializers.SerializerMethodField(read_only=True)
	voted = serializers.SerializerMethodField(read_only=True)
	can_vote = serializers.SerializerMethodField(read_only=True)
	discussions_ids = serializers.SerializerMethodField(read_only=True)
	author = serializers.SerializerMethodField(read_only=True)
	images = serializers.SerializerMethodField(read_only=True)
	creation_date = serializers.SerializerMethodField(read_only=True)
	creation_time = serializers.SerializerMethodField(read_only=True)

	@staticmethod
	def get_tags(obj):
		return [tag.text for tag in obj.tags.all()]

	def get_voted(self, obj):
		request = self.context.get('request')
		# return request.user.is_authenticated and request.user.artworks.filter(pk=obj.id).exists()
		return request.user.is_authenticated and obj.voters.filter(pk=request.user.id).exists()

	def get_can_vote(self, obj):
		return obj.author.pk != self.context.get('request').user.pk

	@staticmethod
	def get_discussions_ids(obj):
		return [comment.id for comment in obj.comments.all()]

	def get_author(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	def get_images(self, obj):
		request = self.context.get('request')
		links = []
		images = obj.images.all()
		for image in images:
			links.append(request.build_absolute_uri(image.url))

		if len(links) == 0:
			links.append(settings.DEFAULT_NO_IMAGE_URL)

		return links

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
			'image', 'author', 'voted', 'discussions_ids'
		)


# Requires instance fields:
#   - voters: ForeignKey
#   - points: Float
class VoteSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	mark = serializers.IntegerField(required=True)

	def calc_points(self, curr_points, curr_voters_count, mark):
		return curr_points

	def update(self, instance, validated_data):
		request = self.context.get('request')
		if instance.voters.filter(pk=request.user.id).exists():
			raise ValidationError('re-voting is forbidden')

		mark = validated_data['mark']
		if mark not in self.Meta.mark_range:
			raise ValidationError('mark is out of range')

		instance.voters.add(request.user)
		instance.points = self.calc_points(
			instance.points, instance.voters.count(), mark
		)
		instance.save()
		return instance

	class Meta:
		mark_range = range(0)


class VoteForArtworkSerializer(VoteSerializer):

	def calc_points(self, curr_points, curr_voters_count, mark):
		return ((curr_points * curr_voters_count) + mark) / (curr_voters_count + 1)

	class Meta:
		model = ArtworkModel
		fields = ('id', 'mark')
		mark_range = range(-10, 12)


class VoteForCommentSerializer(VoteSerializer):

	def calc_points(self, curr_points, curr_voters_count, mark):
		return curr_points + mark

	class Meta:
		model = CommentModel
		fields = ('id', 'mark')
		mark_range = range(-1, 2)

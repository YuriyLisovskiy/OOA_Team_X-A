from django.conf import settings
from rest_framework import serializers

from artwork.models import Tag, Artwork, Comment
from core.models import User


class TagSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = Tag
		fields = ('id', 'text')


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
		model = User
		fields = ('id', 'username', 'avatar')


class ReadOnlyCommentSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)
	answers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
	author = serializers.SerializerMethodField(read_only=True)

	def get_author(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	class Meta:
		model = Comment
		fields = ('id', 'text', 'points', 'author', 'creation_date', 'creation_time', 'answers')


class ReadOnlyArtworkSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)
	tags = serializers.SerializerMethodField(read_only=True)
	voted = serializers.SerializerMethodField(read_only=True)
	discussions_ids = serializers.SerializerMethodField(read_only=True)
	author = serializers.SerializerMethodField(read_only=True)
	image = serializers.SerializerMethodField(read_only=True)

	@staticmethod
	def get_tags(obj):
		return [tag.text for tag in obj.tags.all()]

	def get_voted(self, obj):
		request = self.context.get('request')
		return request.user.is_authenticated and request.user.artworks.filter(pk=obj.id).exists()

	@staticmethod
	def get_discussions_ids(obj):
		return [comment.id for comment in obj.comments.all()]

	def get_author(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	def get_image(self, obj):
		request = self.context.get('request')
		if obj.image:
			return request.build_absolute_uri(obj.image.url)

		return settings.DEFAULT_NO_IMAGE_URL

	class Meta:
		model = Artwork
		fields = (
			'id', 'description', 'tags', 'points', 'creation_date', 'creation_time',
			'image', 'author', 'voted', 'discussions_ids'
		)


# Requires instance fields:
#   - voters: ForeignKey
#   - points: Integer
class VoteSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField()
	is_voted = serializers.SerializerMethodField()

	def get_is_voted(self, obj):
		return self.context.get('is_voted_result')

	def update(self, instance, validated_data):
		request = self.context.get('request')
		user_exists = instance.voters.filter(pk=request.user.id).exists()
		if user_exists:
			instance.voters.remove(request.user)
		else:
			instance.voters.add(request.user)

		self.context['is_voted_result'] = not user_exists
		instance.points += (-1 if user_exists else 1)
		instance.save()
		return instance


class VoteForArtworkSerializer(VoteSerializer):

	class Meta:
		model = Artwork
		fields = ('id', 'points', 'is_voted')


class VoteForCommentSerializer(VoteSerializer):

	class Meta:
		model = Comment
		fields = ('id', 'points', 'is_voted')

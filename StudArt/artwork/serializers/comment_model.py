from django.conf import settings
from rest_framework import serializers

from artwork.models import CommentModel
from artwork.serializers.common import VoteSerializer, ReadOnlyUserLinkSerializer
from core.validators import RequiredValidator


class CommentDetailsSerializer(serializers.ModelSerializer):
	author = serializers.SerializerMethodField()
	creation_date = serializers.SerializerMethodField()
	creation_time = serializers.SerializerMethodField()

	def __init__(self, *args, **kwargs):
		super(CommentDetailsSerializer, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].read_only = True

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


class CreateCommentSerializer(serializers.ModelSerializer):
	author_details = serializers.SerializerMethodField(read_only=True)

	def get_author_details(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	class Meta:
		model = CommentModel
		fields = ('id', 'text', 'author', 'author_details', 'artwork')
		read_only_fields = ('id', 'author_details')
		extra_kwargs = {
			'text': {'write_only': True},
			'author': {'write_only': True},
			'artwork': {'write_only': True}
		}
		validators = [
			RequiredValidator(fields=('text', 'author', 'artwork'))
		]


class CreateCommentReplySerializer(serializers.ModelSerializer):
	author_details = serializers.SerializerMethodField(read_only=True)

	def get_author_details(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	class Meta:
		model = CommentModel
		fields = ('id', 'text', 'author', 'author_details', 'comment')
		read_only_fields = ('id', 'author_details')
		extra_kwargs = {
			'text': {'write_only': True},
			'author': {'write_only': True},
			'comment': {'write_only': True}
		}
		validators = [
			RequiredValidator(fields=('text', 'author', 'comment'))
		]


class VoteForCommentSerializer(VoteSerializer):

	def calc_points(self, curr_points, curr_voters_count, mark):
		return curr_points + mark

	class Meta:
		model = CommentModel
		fields = ('mark', 'points')
		mark_range = range(-1, 2)
		validators = [
			RequiredValidator(fields=('mark',))
		]

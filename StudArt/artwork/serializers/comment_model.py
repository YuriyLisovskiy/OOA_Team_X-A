from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from artwork.models import CommentModel
from artwork.serializers.common import ReadOnlyUserLinkSerializer
from core.validators import RequiredValidator


class CommentDetailsSerializer(serializers.ModelSerializer):
	author = serializers.SerializerMethodField()
	up_voted = serializers.SerializerMethodField()
	down_voted = serializers.SerializerMethodField()
	creation_date = serializers.SerializerMethodField()
	creation_time = serializers.SerializerMethodField()

	def __init__(self, *args, **kwargs):
		super(CommentDetailsSerializer, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].read_only = True

	def get_author(self, obj):
		return ReadOnlyUserLinkSerializer(obj.author, context=self.context).data

	def get_up_voted(self, obj):
		request = self.context.get('request', None)
		return request and obj.up_voters.filter(pk=request.user.id).exists()

	def get_down_voted(self, obj):
		request = self.context.get('request', None)
		return request and obj.down_voters.filter(pk=request.user.id).exists()

	@staticmethod
	def get_creation_date(obj):
		return obj.creation_date.strftime(settings.DATE_FORMAT)

	@staticmethod
	def get_creation_time(obj):
		return obj.creation_time.strftime(settings.TIME_FORMAT)

	class Meta:
		model = CommentModel
		fields = (
			'id', 'text', 'points', 'author', 'up_voted', 'down_voted',
			'creation_date', 'creation_time'
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


class EditCommentSerializer(serializers.ModelSerializer):

	class Meta:
		model = CommentModel
		fields = ('text',)
		extra_kwargs = {
			'text': {'write_only': True}
		}
		validators = [
			RequiredValidator(fields=('text',))
		]


class VoteForCommentSerializer(serializers.ModelSerializer):
	mark = serializers.IntegerField(write_only=True)

	def update(self, instance, validated_data):
		mark = validated_data['mark']
		if mark not in self.Meta.mark_range:
			raise ValidationError('mark is out of range')

		request = self.context.get('request')
		if request.user.id == instance.author.id:
			raise ValidationError('self-voting is forbidden')

		up_voted = False
		down_voted = False
		if instance.up_voters.filter(pk=request.user.id).exists():
			up_voted = True
			if mark > 0:
				raise ValidationError('re-up-voting is forbidden')

			instance.up_voters.remove(request.user)

		if instance.down_voters.filter(pk=request.user.id).exists():
			down_voted = True
			if mark < 0:
				raise ValidationError('re-down-voting is forbidden')

			instance.down_voters.remove(request.user)

		new_points = instance.points + mark
		if mark > 0:
			if down_voted:
				new_points += 1

			instance.up_voters.add(request.user)
		else:
			if up_voted:
				new_points -= 1

			instance.down_voters.add(request.user)

		instance.points = new_points
		instance.save()
		return instance

	class Meta:
		model = CommentModel
		fields = ('mark', 'points')
		read_only_fields = ('points',)
		mark_range = [-1, 1]
		validators = [
			RequiredValidator(fields=('mark',))
		]


class CancelVoteForCommentSerializer(serializers.ModelSerializer):

	def update(self, instance, validated_data):
		request = self.context.get('request')
		to_sub = 0
		if instance.up_voters.filter(pk=request.user.id).exists():
			to_sub = 1
			instance.up_voters.remove(request.user)

		if instance.down_voters.filter(pk=request.user.id).exists():
			to_sub = -1
			instance.down_voters.remove(request.user)

		instance.points = instance.points - to_sub
		instance.save()
		return instance

	class Meta:
		model = CommentModel
		fields = ('points',)
		read_only_fields = ('points',)

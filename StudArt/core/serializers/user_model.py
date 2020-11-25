from rest_framework import serializers

from core.models import UserModel
from core.serializers.common import UserBlacklistSerializer, AuthorSubscriptionSerializer
from core.utils import build_full_url
from core.validators import RequiredValidator


class UserDetailsSerializer(serializers.ModelSerializer):
	avatar_link = serializers.SerializerMethodField()

	def __init__(self, *args, **kwargs):
		super(UserDetailsSerializer, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].read_only = True

	def get_avatar_link(self, obj):
		return build_full_url(
			self.context.get('request', None),
			obj.avatar
		)

	class Meta:
		model = UserModel
		fields = (
			'id', 'first_name', 'last_name', 'username',
			'email', 'avatar_link', 'is_superuser', 'rating',
		)


class EditSelfUserSerializer(serializers.ModelSerializer):
	avatar_link = serializers.SerializerMethodField()

	def get_avatar_link(self, obj):
		return build_full_url(
			self.context.get('request', None),
			obj.avatar
		)

	class Meta:
		model = UserModel
		fields = (
			'first_name', 'last_name', 'avatar', 'avatar_link'
		)
		read_only_fields = ('avatar_link',)
		extra_kwargs = {
			'first_name': {'write_only': True},
			'last_name': {'write_only': True},
			'avatar': {'write_only': True}
		}


class BlockUserSerializer(UserBlacklistSerializer):

	def _modify(self, instance, obj):
		instance.blocked_users.add(obj)
		return instance

	class Meta:
		model = UserModel
		exists = False
		fields = ('author_pk',)
		extra_kwargs = {
			'author_pk': {'write_only': True},
		}
		validators = [
			RequiredValidator(fields=('author_pk',))
		]


class UnblockUserSerializer(UserBlacklistSerializer):

	def _modify(self, instance, obj):
		instance.blocked_users.remove(obj)
		return instance


class SubscribeToAuthorSerializer(AuthorSubscriptionSerializer):

	def _modify(self, instance, obj):
		instance.subscriptions.add(obj)
		return instance

	class Meta:
		model = UserModel
		exists = False
		fields = ('author_pk',)
		extra_kwargs = {
			'author_pk': {'write_only': True},
		}
		validators = [
			RequiredValidator(fields=('author_pk',))
		]


class UnsubscribeFromAuthorSerializer(AuthorSubscriptionSerializer):

	def _modify(self, instance, obj):
		instance.subscriptions.remove(obj)
		return instance

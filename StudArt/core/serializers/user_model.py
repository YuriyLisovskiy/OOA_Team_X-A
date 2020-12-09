from rest_framework import serializers

from core.models import UserModel
from core.serializers.common import UserBlacklistSerializer, AuthorSubscriptionSerializer
from core.utils import build_full_url
from core.validators import RequiredValidator


class UserDetailsSerializer(serializers.ModelSerializer):
	avatar_link = serializers.SerializerMethodField()
	is_subscribed = serializers.SerializerMethodField()
	is_blocked = serializers.SerializerMethodField()

	def __init__(self, *args, **kwargs):
		super(UserDetailsSerializer, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].read_only = True

	def _is_authenticated(self):
		request = self.context.get('request', None)
		return request and request.user.is_authenticated, request

	def get_avatar_link(self, obj):
		return build_full_url(
			self.context.get('request', None),
			obj.avatar
		)

	def get_is_subscribed(self, obj):
		ok, request = self._is_authenticated()
		return ok and request.user.id != obj.id and request.user.subscriptions.filter(pk=obj.pk).exists()

	def get_is_blocked(self, obj):
		ok, request = self._is_authenticated()
		return ok and request.user.id != obj.id and request.user.blocked_users.filter(pk=obj.pk).exists()

	class Meta:
		model = UserModel
		fields = (
			'id', 'first_name', 'last_name', 'username', 'email',
			'avatar_link', 'is_superuser', 'rating', 'is_banned',
			'is_subscribed', 'is_blocked', 'show_full_name', 'show_rating',
			'show_subscriptions'
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
			'first_name', 'last_name', 'avatar', 'avatar_link',
			'show_full_name', 'show_rating', 'show_subscriptions'
		)
		read_only_fields = ('avatar_link',)
		extra_kwargs = {
			'avatar': {'write_only': True}
		}


class BlockUserSerializer(UserBlacklistSerializer):

	def _modify(self, instance, obj):
		instance.blocked_users.add(obj)
		instance.subscriptions.remove(obj)
		return instance

	class Meta:
		model = UserModel
		exists = False
		fields = ('author_pk',)
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
		validators = [
			RequiredValidator(fields=('author_pk',))
		]


class UnsubscribeFromAuthorSerializer(AuthorSubscriptionSerializer):

	def _modify(self, instance, obj):
		instance.subscriptions.remove(obj)
		return instance

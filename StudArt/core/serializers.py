from django.conf import settings
from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import NotFound

from core.models import UserModel
from core.validators import RequiredValidator


class UserSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = UserModel
		fields = (
			'id', 'first_name', 'last_name', 'username',
			'email', 'avatar', 'is_superuser', 'rating',
		)


class ReadOnlyUserSerializer(UserSerializer):
	avatar = serializers.SerializerMethodField()

	def get_avatar(self, obj):
		request = self.context.get('request')
		url = obj.avatar.url if obj.avatar else settings.DEFAULT_NO_IMAGE_URL
		return request.build_absolute_uri(url)


class CreateUserSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = UserModel
		fields = ('id', 'first_name', 'last_name', 'username', 'email')
		validators = [
			RequiredValidator(
				fields=('first_name', 'last_name', 'username', 'email')
			)
		]


class SimpleUserSerializer(UserSerializer):
	username = serializers.CharField(read_only=True)
	email = serializers.EmailField(read_only=True)
	is_superuser = serializers.BooleanField(read_only=True)
	rating = serializers.FloatField(read_only=True)


class SelfEditUserSerializer(SimpleUserSerializer):
	avatar = serializers.ImageField(read_only=True)


class UploadAvatarUserSerializer(SimpleUserSerializer):
	first_name = serializers.CharField(read_only=True)
	last_name = serializers.CharField(read_only=True)


class _UserBlacklistSerializer(serializers.ModelSerializer):
	user_pk = serializers.SerializerMethodField(required=True)

	def _negate(self, bool_res):
		return bool_res if self.Meta.exists else not bool_res

	def _modify(self, instance, obj):
		return lambda *args, **kwargs: instance

	def update(self, instance, validated_data):
		obj = UserModel.objects.filter(pk=validated_data['user_pk'])
		if not obj.exists():
			raise NotFound('user not found')

		if self._negate(instance.blocked_users.filter(obj).exists()):
			instance = self._modify(instance, obj)

		instance.save()
		return instance

	class Meta:
		model = UserModel
		exists = True


class BlockUserSerializer(_UserBlacklistSerializer):

	def _modify(self, instance, obj):
		instance.blocked_users.add(obj)
		return instance

	class Meta:
		model = UserModel
		exists = False


class UnblockUserSerializer(_UserBlacklistSerializer):

	def _modify(self, instance, obj):
		instance.blocked_users.remove(obj)
		return instance


class _AuthorSubscriptionSerializer(serializers.ModelSerializer):
	user_pk = serializers.SerializerMethodField(required=True)

	def _negate(self, bool_res):
		return bool_res if self.Meta.exists else not bool_res

	def _modify(self, instance, obj):
		return lambda *args, **kwargs: instance

	def update(self, instance, validated_data):
		obj = UserModel.objects.filter(pk=validated_data['user_pk'])
		if not obj.exists():
			raise NotFound('author not found')

		if self._negate(instance.subscriptions.filter(obj).exists()):
			instance = self._modify(instance, obj)

		instance.save()
		return instance

	def _get_query(self, instance, validated_data):
		return Q(text=validated_data['tag_text'])

	class Meta:
		model = UserModel
		exists = True


class SubscribeToAuthorSerializer(_AuthorSubscriptionSerializer):

	def _modify(self, instance, obj):
		instance.subscriptions.add(obj)
		return instance

	class Meta:
		model = UserModel
		exists = False


class UnsubscribeFromAuthorSerializer(_AuthorSubscriptionSerializer):

	def _modify(self, instance, obj):
		instance.subscriptions.remove(obj)
		return instance

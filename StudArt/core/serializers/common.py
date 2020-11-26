from rest_framework import serializers
from rest_framework.exceptions import NotFound

from core.models import UserModel
from core.validators import RequiredValidator


class UserBlacklistSerializer(serializers.ModelSerializer):
	author_pk = serializers.IntegerField()

	def _negate(self, bool_res):
		return bool_res if self.Meta.exists else not bool_res

	def _modify(self, instance, obj):
		return lambda *args, **kwargs: instance

	def update(self, instance, validated_data):
		obj = UserModel.objects.filter(pk=validated_data['author_pk'])
		if not obj.exists():
			raise NotFound('author not found')

		if self._negate(instance.blocked_users.filter(obj).exists()):
			instance = self._modify(instance, obj)

		instance.save()
		return instance

	class Meta:
		model = UserModel
		exists = True
		fields = ('author_pk',)
		extra_kwargs = {
			'author_pk': {'write_only': True},
		}
		validators = [
			RequiredValidator(fields=('author_pk',))
		]


class AuthorSubscriptionSerializer(serializers.ModelSerializer):
	author_pk = serializers.IntegerField(required=True)

	def _negate(self, bool_res):
		return bool_res if self.Meta.exists else not bool_res

	def _modify(self, instance, obj):
		return lambda *args, **kwargs: instance

	def update(self, instance, validated_data):
		obj = UserModel.objects.filter(pk=validated_data['author_pk'])
		if not obj.exists():
			raise NotFound('author not found')

		if self._negate(instance.subscriptions.filter(obj).exists()):
			instance = self._modify(instance, obj)

		instance.save()
		return instance

	class Meta:
		model = UserModel
		exists = True
		fields = ('author_pk',)
		extra_kwargs = {
			'author_pk': {'write_only': True},
		}
		validators = [
			RequiredValidator(fields=('author_pk',))
		]

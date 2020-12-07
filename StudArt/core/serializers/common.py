from rest_framework import serializers
from rest_framework.exceptions import NotFound, ValidationError

from core.models import UserModel
from core.validators import RequiredValidator


class UserBlacklistSerializer(serializers.ModelSerializer):
	author_pk = serializers.IntegerField(write_only=True)

	def _negate(self, bool_res):
		return bool_res if self.Meta.exists else not bool_res

	def _modify(self, instance, obj):
		return lambda *args, **kwargs: instance

	def update(self, instance, validated_data):
		obj = UserModel.objects.filter(pk=validated_data['author_pk'])
		if not obj.exists():
			raise NotFound('author not found')

		obj = obj.first()
		if self._negate(instance.blocked_users.filter(pk=obj.pk).exists()):
			instance = self._modify(instance, obj)

		instance.save()
		return instance

	class Meta:
		model = UserModel
		exists = True
		fields = ('author_pk',)
		validators = [
			RequiredValidator(fields=('author_pk',))
		]


class AuthorSubscriptionSerializer(serializers.ModelSerializer):
	author_pk = serializers.IntegerField(write_only=True)

	def _negate(self, bool_res):
		return bool_res if self.Meta.exists else not bool_res

	def _modify(self, instance, obj):
		return lambda *args, **kwargs: instance

	def update(self, instance, validated_data):
		obj = UserModel.objects.filter(pk=validated_data.pop('author_pk'))
		if not obj.exists():
			raise NotFound('author not found')

		obj = obj.first()
		if self._negate(instance.subscriptions.filter(pk=obj.pk).exists()):
			instance = self._modify(instance, obj)

		instance.save()
		return instance

	class Meta:
		model = UserModel
		exists = True
		fields = ('author_pk',)
		validators = [
			RequiredValidator(fields=('author_pk',))
		]

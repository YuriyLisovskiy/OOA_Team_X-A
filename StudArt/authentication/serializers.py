from django.conf import settings
from rest_framework import serializers

from core.models import UserModel
from core.validators import (
	RequiredValidator, UsernameValidator, PasswordValidator
)


class RegisterUserSerializer(serializers.ModelSerializer):
	avatar = serializers.SerializerMethodField()

	def get_avatar(self, obj):
		request = self.context.get('request', None)
		if request and obj.avatar:
			return request.build_absolute_uri(obj.avatar.url)

		return settings.DEFAULT_NO_IMAGE_URL

	def create(self, validated_data):
		password = validated_data.pop('password', None)
		instance = self.Meta.model(**validated_data)
		if password is not None:
			instance.set_password(password)

		instance.save()
		return instance

	class Meta:
		model = UserModel
		fields = (
			'id', 'username', 'email', 'password', 'first_name',
			'last_name', 'avatar', 'is_superuser', 'rating'
		)
		read_only_fields = (
			'id', 'first_name', 'last_name', 'avatar', 'rating', 'is_superuser'
		)
		extra_kwargs = {
			'password': {'write_only': True},
		}
		validators = [
			RequiredValidator(fields=('username', 'email', 'password')),
			UsernameValidator(),
			PasswordValidator()
		]

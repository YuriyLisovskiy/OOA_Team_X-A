from django.conf import settings
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from core.models import UserModel
from core.validators import RequiredValidator


class UserWithTokenSerializer(serializers.ModelSerializer):
	token = serializers.SerializerMethodField()
	avatar = serializers.SerializerMethodField()

	def get_token(self, obj):
		# jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
		# jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
		# payload = jwt_payload_handler(obj)
		# token = jwt_encode_handler(payload)
		return 'token'

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
			'token', 'id', 'username', 'email', 'password',
			'first_name', 'last_name', 'avatar', 'is_superuser', 'rating'
		)
		read_only_fields = (
			'id', 'token', 'first_name', 'last_name', 'avatar', 'rating', 'is_superuser'
		)
		extra_kwargs = {
			'password': {'write_only': True},
		}
		validators = [
			RequiredValidator(fields=('username', 'email', 'password'))
		]

from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from core.models import User


class UserSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = User
		fields = ('id', 'first_name', 'last_name', 'username', 'email', 'avatar',)


class UserWithTokenSerializer(serializers.ModelSerializer):
	token = serializers.SerializerMethodField()
	password = serializers.CharField(write_only=True)
	first_name = serializers.CharField(read_only=True)
	last_name = serializers.CharField(read_only=True)
	avatar = serializers.ImageField(read_only=True)
	id = serializers.IntegerField(read_only=True)

	def get_token(self, obj):
		jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
		jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
		payload = jwt_payload_handler(obj)
		token = jwt_encode_handler(payload)
		return token

	def create(self, validated_data):
		password = validated_data.pop('password', None)
		instance = self.Meta.model(**validated_data)
		if password is not None:
			instance.set_password(password)

		instance.save()
		return instance

	class Meta:
		model = User
		fields = ('token', 'id', 'username', 'email', 'password', 'first_name', 'last_name', 'avatar')

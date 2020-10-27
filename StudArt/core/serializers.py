from rest_framework import serializers

from core.models import User


class UserSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = User
		fields = ('id', 'first_name', 'last_name', 'username', 'email', 'avatar', 'is_superuser', 'rating')


class SimpleUserSerializer(UserSerializer):
	username = serializers.CharField(read_only=True)
	email = serializers.EmailField(read_only=True)
	is_superuser = serializers.BooleanField(read_only=True)
	rating = serializers.FloatField(read_only=True)

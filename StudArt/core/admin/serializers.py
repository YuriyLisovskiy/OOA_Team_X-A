from rest_framework import serializers

from core.models import UserModel


class BanningUserSerializer(serializers.ModelSerializer):

	@property
	def _ban(self):
		return True

	def update(self, instance, validated_data):
		instance.is_banned = self._ban
		instance.save()
		return instance

	class Meta:
		models = UserModel


class BanUserSerializer(BanningUserSerializer):

	@property
	def _ban(self):
		return True


class UnbanUserSerializer(BanningUserSerializer):

	@property
	def _ban(self):
		return False

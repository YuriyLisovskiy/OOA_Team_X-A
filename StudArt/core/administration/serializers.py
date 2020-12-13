from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.models import UserModel


class BanningUserSerializer(serializers.ModelSerializer):

	@property
	def _ban(self):
		return True

	def update(self, instance, validated_data):
		request = self.context.get('request')
		if request.user.id == instance.id:
			raise ValidationError('unable to ban or unban self')

		if instance.is_active != self._ban:
			raise ValidationError('unable to {}ban user'.format('un' if not self._ban else ''))

		instance.is_active = not self._ban
		instance.save()
		return instance

	class Meta:
		model = UserModel
		fields = set()


class BanUserSerializer(BanningUserSerializer):

	@property
	def _ban(self):
		return True


class UnbanUserSerializer(BanningUserSerializer):

	@property
	def _ban(self):
		return False

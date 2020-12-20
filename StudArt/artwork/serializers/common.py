from django.conf import settings
from rest_framework import serializers

from core.models import UserModel


class ReadOnlyUserLinkSerializer(serializers.ModelSerializer):
	avatar = serializers.SerializerMethodField()

	def get_avatar(self, obj):
		request = self.context.get('request')
		if obj.avatar:
			return request.build_absolute_uri(obj.avatar.url)

		return settings.DEFAULT_NO_IMAGE_URL

	class Meta:
		model = UserModel
		read_only_fields = ('id', 'username', 'avatar')
		fields = ('id', 'username', 'avatar')

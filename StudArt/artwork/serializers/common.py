from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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


# Requires instance fields:
#   - voters: ForeignKeyField
#   - points: FloatField
class VoteSerializer(serializers.ModelSerializer):
	mark = serializers.IntegerField(required=True, write_only=True)
	points = serializers.FloatField(read_only=True)

	def calc_points(self, curr_points, curr_voters_count, mark):
		return curr_points

	def update(self, instance, validated_data):
		request = self.context.get('request')
		if instance.voters.filter(pk=request.user.id).exists():
			raise ValidationError('re-voting is forbidden')

		mark = validated_data['mark']
		if mark not in self.Meta.mark_range:
			raise ValidationError('mark is out of range')

		instance.voters.add(request.user)
		instance.points = self.calc_points(
			instance.points, instance.voters.count(), mark
		)
		instance.save()
		return instance

	class Meta:
		mark_range = range(0)

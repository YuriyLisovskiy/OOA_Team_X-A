from rest_framework import serializers

from artwork.models import TagModel
from core.validators import RequiredValidator


class TagDetailsSerializer(serializers.ModelSerializer):

	class Meta:
		model = TagModel
		fields = ('text',)
		read_only_fields = ('text',)


class CreateTagModelSerializer(serializers.ModelSerializer):

	class Meta:
		model = TagModel
		fields = ('text',)
		validators = [
			RequiredValidator(fields=('text',))
		]

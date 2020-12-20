from rest_framework import serializers

from artwork.models import ImageModel
from core.validators import RequiredValidator


class CreateImageModelSerializer(serializers.ModelSerializer):

	class Meta:
		model = ImageModel
		fields = ('id', 'image', 'artwork')
		read_only_fields = ('id',)
		extra_kwargs = {
			'image': {'write_only': True},
			'artwork': {'write_only': True}
		}
		validators = [
			RequiredValidator(fields=('image', 'artwork'))
		]

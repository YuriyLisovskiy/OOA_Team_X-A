from factory import Faker, Factory, django

from artwork import models


class ArtworkFactory(django.DjangoModelFactory):
	class Meta:
		model = models.ArtworkModel

	description = Faker('description')
	points = Faker('number')

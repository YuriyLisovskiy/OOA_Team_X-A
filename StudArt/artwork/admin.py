from django.contrib import admin
from artwork.models import TagModel, ArtworkModel

admin.site.register(TagModel)
admin.site.register(ArtworkModel)

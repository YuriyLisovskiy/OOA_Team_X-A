from django.contrib import admin
from artwork.models import (
	TagModel, ArtworkModel, ImageModel, CommentModel
)

admin.site.register(TagModel)
admin.site.register(ArtworkModel)
admin.site.register(ImageModel)
admin.site.register(CommentModel)

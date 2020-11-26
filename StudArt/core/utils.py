from django.conf import settings


def build_full_url(request, image_obj):
	if request and image_obj:
		return request.build_absolute_uri(image_obj.url)

	return settings.DEFAULT_NO_IMAGE_URL

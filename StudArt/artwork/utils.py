from artwork.models import TagModel
from artwork.serializers import TagModelSerializer


def ensure_tags_exist(tags):
	if len(tags) == 0:
		return False

	for req_tag in tags:
		if not TagModel.objects.filter(text=req_tag).exists():
			serializer = TagModelSerializer(data={
				'text': req_tag
			})
			serializer.is_valid(raise_exception=True)
			serializer.save()

	return True

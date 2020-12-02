from django.conf import settings
from rest_framework.pagination import PageNumberPagination

from artwork.models import CommentModel


class ArtworkSetPagination(PageNumberPagination):
	page_size = 6
	page_size_query_param = 'page_size'
	max_page_size = 6

	def get_paginated_response(self, data):
		list_of_lists = []
		if self.request.query_params:
			columns = int(self.request.query_params['columns'])
			for i in range(0, columns):
				list_of_lists.append([])
			for idx, item in enumerate(data):
				for i in range(0, columns):
					if idx % columns == i:
						list_of_lists[i].append(item)
						break

		return super().get_paginated_response(list_of_lists)


class CommentSetPagination(PageNumberPagination):
	page_size = settings.REST_FRAMEWORK['PAGE_SIZE']
	page_size_query_param = 'page_size'

	def get_page_size(self, request):
		if request.query_params.get('answers', 'false') == 'true':
			return CommentModel.objects.count()

		return self.page_size

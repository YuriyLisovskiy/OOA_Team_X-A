from rest_framework.pagination import PageNumberPagination


class ArtworkSetPagination(PageNumberPagination):
	page_size = 6
	page_size_query_param = 'page_size'
	max_page_size = 6

	def get_paginated_response(self, data):
		first = []
		second = []
		third = []
		for idx, item in enumerate(data):
			if idx % 3 == 0:
				first.append(item)
			elif idx % 3 == 1:
				second.append(item)
			elif idx % 3 == 2:
				third.append(item)

		return super().get_paginated_response([first, second, third])

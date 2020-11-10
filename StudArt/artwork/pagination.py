from rest_framework.pagination import PageNumberPagination


class ArtworkSetPagination(PageNumberPagination):
	page_size = 3
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

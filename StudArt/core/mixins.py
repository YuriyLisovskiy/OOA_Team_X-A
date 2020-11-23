from rest_framework.response import Response


class RequestUserViewMixin:

	def get_object(self):
		return self.request.user


class DifferentModelUpdateAPIViewMixin:

	def _get_serializer_data(self, request):
		return None

	def put(self, request, *args, **kwargs):
		resp = super().put(request, *args, **kwargs)
		if resp.status_code != Response.status_code:
			return resp

		return Response(self._get_serializer_data(request))

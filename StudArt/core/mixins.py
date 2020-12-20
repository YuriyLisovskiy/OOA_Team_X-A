from django.http import QueryDict
from rest_framework import exceptions
from rest_framework.response import Response


class CustomUpdateModelMixin:

	def update(self, request, *args, **kwargs):
		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		serializer = self.get_serializer(
			instance, data=request.data,
			partial=partial, context={'request': request}
		)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)

		if getattr(instance, '_prefetched_objects_cache', None):
			# If 'prefetch_related' has been applied to a queryset, we need to
			# forcibly invalidate the prefetch cache on the instance.
			instance._prefetched_objects_cache = {}

		return Response(serializer.data)

	@staticmethod
	def perform_update(serializer):
		serializer.save()

	def partial_update(self, request, *args, **kwargs):
		kwargs['partial'] = True
		return self.update(request, *args, **kwargs)


class UpdateUserModelMixin(CustomUpdateModelMixin):

	def get_object(self):
		return self.request.user

	def get_serializer(self, *args, **kwargs):
		return self.serializer_class(*args, **kwargs)

	def put(self, request, *args, **kwargs):
		return self.update(request, *args, **kwargs)

	def patch(self, request, *args, **kwargs):
		return self.partial_update(request, *args, **kwargs)


class APIViewValidationMixin:
	validators = set()

	def validate_data(self, request):
		data = request.data.dict() if isinstance(request.data, QueryDict) else request.data
		try:
			for validator in self.validators:
				validator(data)
		except exceptions.ValidationError as exc:
			return exc

		return data

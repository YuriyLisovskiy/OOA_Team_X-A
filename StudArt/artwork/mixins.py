from core.models import UserModel


class BlacklistMixin:

	@staticmethod
	def _is_superuser(request):
		return request.user.is_superuser

	@staticmethod
	def _is_self(request, obj):
		return request.user.pk == obj.pk

	@staticmethod
	def _is_in_blacklist(request, obj):
		return obj.blocked_users.filter(pk=request.user.pk).exists()

	def is_blacklisted(self, request, obj):
		if isinstance(obj, UserModel):
			return not self._is_superuser(request) and \
				not self._is_self(request, obj) and \
				self._is_in_blacklist(request, obj)

		raise TypeError('invalid obj type: {}'.format(type(obj)))

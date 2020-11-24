from rest_framework import permissions


class ModifyArtworkPermission(permissions.BasePermission):

	@staticmethod
	def _1h_passed(obj):
		return obj.creation_date_time

	@staticmethod
	def _is_owner(request, obj):
		return obj.author.pk == request.user.pk

	@staticmethod
	def _has_comments(obj):
		return obj.comments.exists()

	def has_object_permission(self, request, view, obj):
		superuser = request.user.is_superuser
		is_owner = self._is_owner(request, obj)
		has_comments = self._has_comments(obj)
		time_passed = self._1h_passed(obj)
		return superuser or (is_owner and not time_passed and not has_comments)

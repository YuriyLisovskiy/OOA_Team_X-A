import datetime as dt

from rest_framework import permissions


# `has_object_permission` returns True if user is superuser
#   or object was created less than 1 hour and user is an
#   author of this object and `additional_checks` returns True.
#   `additional_checks` can be overwritten and will affect on
#   the result if user is not superuser.
#
# ATTENTION: Requires `author` attribute of type `UserModel`
class BaseModifyPermission(permissions.BasePermission):

	one_h_as_sec = 3600

	def _1h_passed(self, obj):
		return (dt.datetime.now(tz=dt.timezone.utc) - obj.creation_date_time).seconds >= self.one_h_as_sec

	@staticmethod
	def _is_owner(request, obj):
		return obj.author.pk == request.user.pk

	def additional_checks(self, obj):
		return True

	def has_object_permission(self, request, view, obj):
		superuser = request.user.is_superuser
		is_owner = self._is_owner(request, obj)
		more_checks = self.additional_checks(obj)
		time_passed = self._1h_passed(obj)
		return superuser or (is_owner and not time_passed and more_checks)


class ModifyArtworkPermission(BaseModifyPermission):

	@staticmethod
	def _has_comments(obj):
		return obj.comments.exists()

	@staticmethod
	def _has_votes(obj):
		return obj.voters.count() > 0

	def additional_checks(self, obj):
		return not self._has_comments(obj) and not self._has_votes(obj)


class ModifyCommentPermission(BaseModifyPermission):

	@staticmethod
	def _has_answers(obj):
		return obj.answers.exists()

	def additional_checks(self, obj):
		return not self._has_answers(obj)

from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    Allows access only to superusers.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)


class SelfBanPermission(BasePermission):
    """
    Self banning is forbidden.
    """

    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.pk != obj.pk)

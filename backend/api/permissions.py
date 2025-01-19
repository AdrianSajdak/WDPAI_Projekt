from rest_framework import permissions

class AdminRequired(permissions.BasePermission):
    """
    Allows access only if user.is_superuser = True.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

class TrainerRequired(permissions.BasePermission):
    """
    Allows access only if user.is_trainer = True OR user.is_superuser = True.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and (request.user.is_trainer or request.user.is_superuser)
        )

from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS

class AdminRequired(BasePermission):
    """
    Allows access only if user.is_superuser = True.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

class TrainerRequired(BasePermission):
    """
    Allows access only if user.is_trainer = True OR user.is_superuser = True.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and (request.user.is_trainer or request.user.is_superuser)
        )
    
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_superuser

# api/permissions.py
from rest_framework import permissions

class AdminRequired(permissions.BasePermission):
    """
    Zezwala tylko, jeśli user.is_superuser = True
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

class TrainerRequired(permissions.BasePermission):
    """
    Zezwala tylko, jeśli user.is_trainer = True LUB user.is_superuser
    """
    def has_permission(self, request, view):
        return bool(
            request.user 
            and (request.user.is_trainer or request.user.is_superuser)
        )

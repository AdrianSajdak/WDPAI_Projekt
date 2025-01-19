# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterUserView, google_login,
    MembershipPlanViewSet, MembershipViewSet,
    GroupClassViewSet, TrainerViewSet, get_current_user, UserViewSet,
)

router = DefaultRouter()
router.register(r'membership-plans', MembershipPlanViewSet, basename='membership-plan')
router.register(r'memberships', MembershipViewSet, basename='membership')
router.register(r'classes', GroupClassViewSet, basename='classes')
router.register(r'trainers', TrainerViewSet, basename='trainers')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('google-login/', google_login, name='google-login'),
    path('me/', get_current_user, name='me'),
]

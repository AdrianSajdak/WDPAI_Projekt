# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterUserView, google_login,
    MembershipPlanViewSet, MembershipViewSet,
    GroupClassViewSet, TrainerViewSet
)

router = DefaultRouter()
router.register(r'membership-plans', MembershipPlanViewSet, basename='membership-plan')
router.register(r'memberships', MembershipViewSet, basename='membership')
router.register(r'classes', GroupClassViewSet, basename='classes')
router.register(r'trainers', TrainerViewSet, basename='trainers')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('google-login/', google_login, name='google-login'),
]

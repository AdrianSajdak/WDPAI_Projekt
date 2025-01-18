# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    MembershipPlan,
    Membership,
    GroupClass,
    Trainer
)

CustomUser = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_trainer']

# ----------------------
#   Memberships
# ----------------------
class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'

# ----------------------
#   Classes
# ----------------------
class GroupClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupClass
        fields = '_all_'  # w tym: name, description, start_time, end_time, capacity, class_type, trainer, attendees

# ----------------------
#   Trainer
# ----------------------
class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

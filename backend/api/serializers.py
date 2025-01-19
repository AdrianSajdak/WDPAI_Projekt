from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    MembershipPlan,
    Membership,
    GroupClass,
    Trainer
)

CustomUser = get_user_model()

# -------------------------------------------------
#  Custom User
# -------------------------------------------------
class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying user info (no password creation logic here).
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_trainer']


class RegisterUserSerializer(serializers.ModelSerializer):
    """
    Serializer used for user registration. Handles password hashing.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


# -------------------------------------------------
#  Membership Plan
# -------------------------------------------------
class MembershipPlanSerializer(serializers.ModelSerializer):
    """
    Enforces validation in the model's clean() method.
    """
    class Meta:
        model = MembershipPlan
        fields = '__all__'

    def validate(self, attrs):
        # You can also call .clean() on the model to ensure
        # the logic for multiples of 30 days is enforced
        plan = MembershipPlan(**attrs)
        plan.clean()  # raises ValidationError if invalid
        return attrs


# -------------------------------------------------
#  Membership
# -------------------------------------------------
class MembershipSerializer(serializers.ModelSerializer):
    # is_active is read-only, derived from model property
    is_active = serializers.ReadOnlyField()

    class Meta:
        model = Membership
        fields = ['id', 'user', 'plan', 'start_date', 'end_date', 'is_active']


# -------------------------------------------------
#  Classes
# -------------------------------------------------
class GroupClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupClass
        fields = '__all__'


# -------------------------------------------------
#  Trainer
# -------------------------------------------------
class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

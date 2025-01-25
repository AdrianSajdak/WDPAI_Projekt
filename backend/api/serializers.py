# backend/api/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from datetime import date, timedelta
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
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_trainer', 'is_superuser', 'is_staff']

class RegisterUserSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = MembershipPlan
        fields = '__all__'

# -------------------------------------------------
#  Membership
# -------------------------------------------------
class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = '__all__'

    def get_is_active(self, obj):
        return obj.is_active
    
# -------------------------------------------------
#  Classes
# -------------------------------------------------
class GroupClassSerializer(serializers.ModelSerializer):
    trainer = serializers.PrimaryKeyRelatedField(read_only=True)
    trainer_name = serializers.SerializerMethodField()
    date_local = serializers.SerializerMethodField()  

    class Meta:
        model = GroupClass
        fields = [
            'id', 'name', 'trainer', 'trainer_name', 
            'date_time', 'date_local', 'capacity', 
            'attendees', 'class_type'
        ]

    def get_trainer_name(self, obj):
        if obj.trainer:
            return f"{obj.trainer.first_name} {obj.trainer.last_name}"
        return "No trainer"

    def get_date_local(self, obj):
        """Zwraca sformatowaną datę i godzinę np. 'DD.MM.YYYY HH:MM'."""
        return obj.date_time.strftime("%d.%m.%Y %H:%M")

# -------------------------------------------------
#  Trainer
# -------------------------------------------------
class TrainerSerializer(serializers.ModelSerializer):
    """
    Zmieniamy tak, aby wybierać istniejącego usera, zamiast tworzyć nowego.
    """
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source='user'
    )
    specialization = serializers.CharField(required=False)
    photo = serializers.ImageField(required=False)

    class Meta:
        model = Trainer
        fields = ['id', 'user_id', 'specialization', 'photo']

    def create(self, validated_data):
        user = validated_data['user']
        # Ustawiamy user.is_trainer = True
        user.is_trainer = True
        user.save()

        # Tworzymy obiekt Trainer
        trainer = Trainer.objects.create(**validated_data)

        # Tworzymy "trainer membership" w razie potrzeby
        self._create_trainer_membership(user)

        return trainer

    def _create_trainer_membership(self, user):
        from .models import MembershipPlan, Membership
        import datetime

        # Szukamy lub tworzymy plan "Trainer Membership"
        plan, _ = MembershipPlan.objects.get_or_create(
            name="Trainer Membership",
            defaults={
                "description": "Membership for trainers (unlimited)",
                "price": 0,
                "duration_days": 999999  # może być 999999 lub cokolwiek
            }
        )
        # Ustawiamy membership "bez końca" (end_date=None) lub daleka data
        Membership.objects.create(
            user=user,
            plan=plan,
            start_date=datetime.date.today(),
            end_date=None
        )

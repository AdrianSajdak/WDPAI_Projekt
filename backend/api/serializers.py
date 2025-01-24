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
        fields = ['id', 'username', 'email', 'is_trainer', 'is_superuser', 'is_staff']


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
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Membership
        fields = '__all__'



# -------------------------------------------------
#  Classes
# -------------------------------------------------
class GroupClassSerializer(serializers.ModelSerializer):
    trainer = serializers.PrimaryKeyRelatedField(read_only=True)
    trainer_name = serializers.SerializerMethodField()
    start_local = serializers.SerializerMethodField()
    end_local = serializers.SerializerMethodField()

    class Meta:
        model = GroupClass
        fields = [
            'id', 'name', 'trainer', 'trainer_name', 'start_time', 'end_time', 'start_local', 'end_local', 'capacity', 'attendees'
        ]

    def get_trainer_name(self, obj):
        if obj.trainer:
            return f"{obj.trainer.first_name} {obj.trainer.last_name}"
        return "No trainer"
    
    def get_start_local(self, obj):
        # formatuj np. DD.MM.YYYY HH:MM
        return obj.start_time.strftime("%d.%m.%Y %H:%M")

    def get_end_local(self, obj):
        return obj.end_time.strftime("%d.%m.%Y %H:%M")

# -------------------------------------------------
#  Trainer
# -------------------------------------------------
class TrainerSerializer(serializers.ModelSerializer):
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')
    email = serializers.ReadOnlyField(source='user.email')
    specialization = serializers.CharField(required=False)
    photo = serializers.ImageField(required=False)
    
    class Meta:
        model = Trainer
        fields = ['id', 'first_name', 'last_name', 'email', 'specialization', 'photo']

    def create(self, validated_data):
        # Wyciągamy dane
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password', None)  # moze byc None

        # Tworzymy usera
        # username = np. email lub generujemy
        username = email
        user = CustomUser.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        if password:
            user.set_password(password)
        else:
            # jesli nie podano password – generujemy random
            from django.contrib.auth.hashers import make_password
            user.password = make_password(CustomUser.objects.make_random_password())
        user.save()

        # Tworzymy obiekt Trainer
        trainer = Trainer.objects.create(user=user, **validated_data)
        return trainer
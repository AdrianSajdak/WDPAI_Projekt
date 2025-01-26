# backend/api/views.py

from django.contrib.auth import get_user_model
from rest_framework import generics, status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.db import transaction
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import datetime, timedelta
from .permissions import AdminRequired, TrainerRequired
from .models import CustomUser, MembershipPlan, Membership, GroupClass, Trainer
from .serializers import (
    CustomUserSerializer,
    RegisterUserSerializer,
    MembershipPlanSerializer,
    MembershipSerializer,
    GroupClassSerializer,
    TrainerSerializer
)

CustomUser = get_user_model()

# -------------------------------------------------
#  USER REGISTRATION
# -------------------------------------------------
class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.AllowAny]


from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({"error": "Google token is missing."},
                        status=status.HTTP_400_BAD_REQUEST)
    from django.conf import settings
    CLIENT_ID = getattr(settings, 'GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID')

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            CLIENT_ID
        )
        email = idinfo.get('email')
        name = idinfo.get('name', '')

        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': name.split(' ')[0] if name else '',
                'last_name': ' '.join(name.split(' ')[1:]) if len(name.split(' ')) > 1 else '',
            }
        )
        if created:
            user.set_password(CustomUser.objects.make_random_password())
            user.save()

        # Teraz generujemy tokeny JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            "access": access_token,
            "refresh": refresh_token,
            "user": CustomUserSerializer(user).data
        }, status=200)

    except ValueError:
        return Response({"error": "Invalid Google token."},
                        status=status.HTTP_400_BAD_REQUEST)


# -------------------------------------------------
#  MEMBERSHIP PLANS
#   (Ukrycie "Trainer Membership" w listach)
# -------------------------------------------------
class MembershipPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MembershipPlanSerializer
    
    def get_queryset(self):
        qs = MembershipPlan.objects.all()
        # Ukrywamy plan "Trainer Membership" w listach
        if self.action == 'list':
            qs = qs.exclude(name="Trainer Membership")
        return qs

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        else:
            return [AdminRequired()]


# -------------------------------------------------
#  MEMBERSHIP
# -------------------------------------------------
class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    def get_permissions(self):
        # Dodajemy 'end' do listy akcji dostępnych dla zalogowanego usera
        if self.action in ['create', 'list', 'retrieve', 'end']:
            return [permissions.IsAuthenticated()]
        else:
            return [AdminRequired()]

    def get_queryset(self):
        user = self.request.user
        now = timezone.now().date()
        return Membership.objects.filter(
            user=user
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gt=now)
        ).order_by('-start_date')

    def perform_create(self, serializer):
        user = self.request.user
        now = timezone.now().date()
        future_or_active = Membership.objects.filter(
        user=user
        ).filter(
        Q(end_date__isnull=True) | Q(end_date__gt=now)
        )
        if future_or_active.exists():
            raise ValidationError("You already have a membership pending or active.")

        serializer.save(user=user)


    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def end(self, request, pk=None):
        membership = self.get_object()

        # w get_queryset już jest user=..., więc membership musi należeć do request.user
        # ale jakby co:
        if membership.user != request.user and not request.user.is_superuser:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        # Ustawiamy end_date = today => membership staje się nieaktywny
        membership.end_date = timezone.now().date()
        membership.save()
        return Response({"detail": "Membership ended."}, status=status.HTTP_200_OK)


# -------------------------------------------------
#  CLASSES
# -------------------------------------------------
class GroupClassViewSet(viewsets.ModelViewSet):
    serializer_class = GroupClassSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [TrainerRequired()]
        return super().get_permissions()

    def get_queryset(self):
        now = timezone.now()
        return GroupClass.objects.filter(date_time__gte=now)


    def perform_create(self, serializer):
        # Tworzenie zajęć => trainer = request.user
        serializer.save(trainer=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        with transaction.atomic():
            group_class = self.get_object()
            if request.user in group_class.attendees.all():
                return Response({"detail": "You are already registered for this class."},
                                status=status.HTTP_400_BAD_REQUEST)
            if group_class.attendees.count() >= group_class.capacity:
                return Response({"detail": "No available spots."},
                                status=status.HTTP_400_BAD_REQUEST)
            group_class.attendees.add(request.user)
            return Response({"detail": "You have joined the class."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        group_class = self.get_object()
        if request.user not in group_class.attendees.all():
            return Response({"detail": "You are not enrolled in this class."},
                            status=status.HTTP_400_BAD_REQUEST)
        group_class.attendees.remove(request.user)
        return Response({"detail": "You have left the class."}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.is_superuser or instance.trainer == request.user:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)


# -------------------------------------------------
#  TRAINER
# -------------------------------------------------
class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    permission_classes = [AdminRequired]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    user = request.user
    serializer = CustomUserSerializer(user)
    return Response(serializer.data, status=200)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [TrainerRequired()]
        return [permissions.IsAdminUser()]

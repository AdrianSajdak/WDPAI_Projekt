# api/views.py

from django.contrib.auth import get_user_model
from rest_framework import generics, status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .permissions import AdminRequired, TrainerRequired
from .models import CustomUser, MembershipPlan, Membership, GroupClass, Trainer
from .serializers import (
    CustomUserSerializer,
    MembershipPlanSerializer,
    MembershipSerializer,
    GroupClassSerializer,
    TrainerSerializer
)

CustomUser = get_user_model()

# ----------------------
#   USER REGISTRATION
# ----------------------
class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # np. z domyślnym hasłem lub logiką ustalania hasła
        user = serializer.save()
        user.set_password(self.request.data.get('password'))
        user.save()

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({"error": "Brak tokenu Google"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        # Zweryfikuj token
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), "GOOGLE_CLIENT_ID")
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
            user.save()
        # Zwracamy np. CustomUserSerializer (lub token JWT)
        return Response(CustomUserSerializer(user).data)
    except ValueError:
        return Response({"error": "Nieprawidłowy token Google"}, status=status.HTTP_400_BAD_REQUEST)

# ----------------------
#   MEMBERSHIP PLANS
# ----------------------
class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    # Tylko admin może tworzyć/edytować
    permission_classes = [AdminRequired]
# ----------------------
#   MEMBERSHIP
# ----------------------
class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    def get_permissions(self):
        # Tylko admin może tworzyć i usuwać membershipy.
        # Zwykły user może "zobaczyć" swoje membershipy?
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [AdminRequired()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Membership.objects.all()
        # Zwykły user → widzi tylko swoje
        return Membership.objects.filter(user=user)

# ----------------------
#   CLASSES
# ----------------------
class GroupClassViewSet(viewsets.ModelViewSet):
    queryset = GroupClass.objects.all()
    serializer_class = GroupClassSerializer
    # Domyślnie widoczne dla zalogowanych, a zapisy przy join/leave
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [TrainerRequired()]  # Tylko trener (lub admin)
        return super().get_permissions()

    def perform_create(self, serializer):
        # Ustawiamy, że autorem zajęć jest zalogowany trener
        serializer.save(trainer=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        group_class = self.get_object()
        if request.user in group_class.attendees.all():
            return Response({"detail": "Jesteś już zapisany na te zajęcia."}, status=status.HTTP_400_BAD_REQUEST)
        if group_class.attendees.count() >= group_class.capacity:
            return Response({"detail": "Brak wolnych miejsc."}, status=status.HTTP_400_BAD_REQUEST)
        group_class.attendees.add(request.user)
        return Response({"detail": "Zapisano na zajęcia."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        group_class = self.get_object()
        if request.user not in group_class.attendees.all():
            return Response({"detail": "Nie jesteś zapisany na te zajęcia."}, status=status.HTTP_400_BAD_REQUEST)
        group_class.attendees.remove(request.user)
        return Response({"detail": "Wypisano z zajęć."}, status=status.HTTP_200_OK)

# ----------------------
#   TRAINER
# ----------------------
class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    # Tylko admin może tworzyć/edytować trainerów
    permission_classes = [AdminRequired]

    # ewentualnie: read-only dla innych:
    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:
    #         return [permissions.AllowAny()]
    #     return [AdminRequired()]
    def perform_create(self, serializer):
        return serializer.save()

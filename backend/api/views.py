from django.contrib.auth import get_user_model
from rest_framework import generics, status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

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
    # No need for perform_create to handle password hashing, 
    # it's handled in RegisterUserSerializer.create()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_login(request):
    """
    Example Google Login flow using an ID token.
    - You need to verify the token with Google's OAuth2 library.
    - Retrieve user info. If user doesn't exist, create one.
    - Returns a basic user representation (CustomUserSerializer).
    """
    token = request.data.get('token')
    if not token:
        return Response(
            {"error": "Google token is missing."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Use your actual Google CLIENT_ID from settings or env variable
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
        # If created is True, new user was just created.
        # If you want to set a random password or do other logic, do it here.
        if created:
            user.set_password(CustomUser.objects.make_random_password())
            user.save()

        return Response(CustomUserSerializer(user).data)

    except ValueError:
        return Response(
            {"error": "Invalid Google token."},
            status=status.HTTP_400_BAD_REQUEST
        )


# -------------------------------------------------
#  MEMBERSHIP PLANS
# -------------------------------------------------
class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    # Only admin can create/update/delete a plan
    permission_classes = [AdminRequired]


# -------------------------------------------------
#  MEMBERSHIP
# -------------------------------------------------
class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    def get_permissions(self):
        if self.action == 'create':
            # Allow all authenticated users to buy
            return [permissions.IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [AdminRequired()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Membership.objects.all()
        # Normal user sees only their memberships
        return Membership.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        If an admin is creating a membership, they can specify any user.
        If a normal user (somehow) is creating - enforced by permissions check - 
        it would default to them. (But effectively blocked by AdminRequired anyway.)
        """
        if self.request.user.is_superuser:
            serializer.save()
        else:
            serializer.save(user=self.request.user)


# -------------------------------------------------
#  CLASSES
# -------------------------------------------------
class GroupClassViewSet(viewsets.ModelViewSet):
    queryset = GroupClass.objects.all()
    serializer_class = GroupClassSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        """
        Only a trainer or admin can create/update/destroy.
        Everyone (logged-in or read-only) can list or retrieve.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [TrainerRequired()]
        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Sets the trainer to the logged-in user who is creating the class.
        """
        serializer.save(trainer=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        """
        A user can join a class if there is capacity.
        Uses a database transaction to avoid race conditions.
        """
        with transaction.atomic():
            group_class = self.get_object()
            if request.user in group_class.attendees.all():
                return Response(
                    {"detail": "You are already registered for this class."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if group_class.attendees.count() >= group_class.capacity:
                return Response(
                    {"detail": "No available spots."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            group_class.attendees.add(request.user)
            return Response({"detail": "You have joined the class."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        """
        A user can leave a class if they are currently enrolled.
        """
        group_class = self.get_object()
        if request.user not in group_class.attendees.all():
            return Response(
                {"detail": "You are not enrolled in this class."},
                status=status.HTTP_400_BAD_REQUEST
            )
        group_class.attendees.remove(request.user)
        return Response({"detail": "You have left the class."}, status=status.HTTP_200_OK)


# -------------------------------------------------
#  TRAINER
# -------------------------------------------------
class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    # Only admin can manage trainer objects (create/update/delete).
    permission_classes = [AdminRequired]

    # Example of read-only for non-admins:
    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:
    #         return [permissions.AllowAny()]
    #     return [AdminRequired()]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Returns the current logged-in user's information.
    """
    user = request.user
    serializer = CustomUserSerializer(user)
    return Response(serializer.data, status=200)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Return a list of all users.
    Only trainer or admin can list them.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        # For example: let only trainers/admin see it
        if self.action in ['list', 'retrieve']:
            return [TrainerRequired()]
        return [permissions.IsAdminUser()]
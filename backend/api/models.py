# api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_trainer = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class MembershipPlan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField(default=30)

    def __str__(self):
        return self.name

class Membership(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='memberships')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE, related_name='memberships')
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"

class GroupClass(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    capacity = models.PositiveIntegerField(default=10)

    attendees = models.ManyToManyField(CustomUser, blank=True, related_name='classes_joined')

    def __str__(self):
        return f"{self.name} ({self.start_time} - {self.end_time})"

def trainer_upload_path(instance, filename):
    return f"trainers/{instance.id}/{filename}"

class Trainer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='trainer_profile')
    specialization = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to=trainer_upload_path, blank=True, null=True)

    def __str__(self):
        return f"Trener {self.user.username}"

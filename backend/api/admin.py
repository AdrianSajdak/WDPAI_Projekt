from django.contrib import admin

# Register your models here.
from .models import *



admin.site.register(CustomUser)
admin.site.register(MembershipPlan)
admin.site.register(Membership)
admin.site.register(GroupClass)
admin.site.register(Trainer)

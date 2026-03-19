from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["twitch_username", "email", "twitch_id", "created_at"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Twitch", {"fields": ("twitch_id", "twitch_username", "avatar_url")}),
    )

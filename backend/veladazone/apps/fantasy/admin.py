from django.contrib import admin
from .models import FantasyLeague, LeagueMember


@admin.register(FantasyLeague)
class FantasyLeagueAdmin(admin.ModelAdmin):
    list_display = ["name", "creator", "invite_code", "created_at"]


@admin.register(LeagueMember)
class LeagueMemberAdmin(admin.ModelAdmin):
    list_display = ["league", "user", "joined_at"]

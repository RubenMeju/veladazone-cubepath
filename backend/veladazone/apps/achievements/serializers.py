# ── serializers.py ────────────────────────────────────────────────────────────

from rest_framework import serializers
from .models import Achievement, UserAchievement


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["slug", "name", "description", "emoji", "category", "points"]


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer()

    class Meta:
        model = UserAchievement
        fields = ["achievement", "unlocked_at"]

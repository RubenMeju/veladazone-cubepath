from rest_framework import serializers
from .models import Argument, Prediction
from veladazone.apps.fighters.serializers import FightSerializer, FighterSerializer


class PredictionSerializer(serializers.ModelSerializer):
    fight = FightSerializer(read_only=True)
    predicted_winner = FighterSerializer(read_only=True)
    previous_winner = FighterSerializer(read_only=True)

    class Meta:
        model = Prediction
        fields = [
            "id",
            "fight",
            "predicted_winner",
            "previous_winner",
            "ai_comment",
            "is_correct",
            "betrayal_count",
            "created_at",
        ]
        read_only_fields = ["ai_comment", "is_correct", "betrayal_count", "created_at"]


class ArgumentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    fighter_name = serializers.SerializerMethodField()
    fighter_flag = serializers.SerializerMethodField()

    class Meta:
        model = Argument
        fields = ['id', 'username', 'avatar', 'fighter_name', 'fighter_flag', 'text', 'votes', 'created_at']

    def get_username(self, obj):
        return obj.user.display_name  # type: ignore

    def get_avatar(self, obj):
        return obj.user.avatar_url  # type: ignore

    def get_fighter_name(self, obj):
        return obj.fighter_supported.name

    def get_fighter_flag(self, obj):
        return obj.fighter_supported.country_flag
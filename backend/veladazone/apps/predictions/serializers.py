from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Argument, ArgumentReply, ArgumentVote, Prediction
from veladazone.apps.fighters.serializers import FightSerializer, FighterSerializer

User = get_user_model()


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


class SimpleUserSerializer(serializers.Serializer):
    """Serializer simple para el usuario"""

    id = serializers.IntegerField()
    username = serializers.CharField()
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        return getattr(obj, "avatar_url", None)


class ArgumentReplySerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = ArgumentReply
        fields = ["id", "user", "text", "created_at"]


class ArgumentSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    fighter_name = serializers.CharField(
        source="fighter_supported.name", read_only=True
    )
    fighter_flag = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    user_voted = serializers.SerializerMethodField()

    # Respuestas anidadas
    replies = ArgumentReplySerializer(many=True, read_only=True)

    class Meta:
        model = Argument
        fields = [
            "id",
            "user",
            "username",  # para compatibilidad con frontend
            "text",
            "fighter_supported",
            "fighter_name",
            "fighter_flag",
            "vote_count",
            "user_voted",
            "edited",
            "created_at",
            "replies",
        ]
        read_only_fields = ["user", "edited", "created_at"]

    def get_username(self, obj):
        return obj.user.username

    def get_fighter_flag(self, obj):
        return getattr(obj.fighter_supported, "country_flag", "")

    def get_vote_count(self, obj):
        return obj.argument_votes.count()

    def get_user_voted(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return ArgumentVote.objects.filter(user=request.user, argument=obj).exists()

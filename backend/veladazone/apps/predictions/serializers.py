from rest_framework import serializers
from .models import Argument, ArgumentReply, ArgumentVote, Prediction
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


class ArgumentReplySerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = ArgumentReply
        fields = ["id", "username", "avatar", "text", "created_at"]

    def get_username(self, obj):
        return obj.user.display_name  # type: ignore

    def get_avatar(self, obj):
        return obj.user.avatar_url  # type: ignore


class ArgumentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    fighter_name = serializers.SerializerMethodField()
    fighter_flag = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    replies = ArgumentReplySerializer(many=True, read_only=True)
    user_voted = serializers.SerializerMethodField()
    user_replied = serializers.SerializerMethodField()
    edited = serializers.BooleanField(read_only=True)

    class Meta:
        model = Argument
        fields = [
            "id",
            "username",
            "avatar",
            "fighter_name",
            "fighter_flag",
            "text",
            "vote_count",
            "replies",
            "user_voted",
            "user_replied",
            "edited",
            "created_at",
        ]

    def get_username(self, obj):
        return obj.user.display_name  # type: ignore

    def get_avatar(self, obj):
        return obj.user.avatar_url  # type: ignore

    def get_fighter_name(self, obj):
        return obj.fighter_supported.name

    def get_fighter_flag(self, obj):
        return obj.fighter_supported.country_flag

    def get_vote_count(self, obj):
        return obj.argument_votes.count()  # type: ignore

    def get_user_voted(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.argument_votes.filter(user=request.user).exists()  # type: ignore

    def get_user_replied(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.replies.filter(user=request.user).exists()  # type: ignore

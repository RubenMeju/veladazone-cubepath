from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.timesince import timesince
from django.utils.timezone import now

from veladazone.apps.fighters.models import Fight, Fighter
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

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.timesince import timesince
from django.utils.timezone import now

from veladazone.apps.fighters.models import Fight, Fighter
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


class ArgumentReplySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    avatar = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()  # 👈 añadir

    class Meta:
        model = ArgumentReply
        fields = ["id", "username", "avatar", "text", "created_at", "time_ago", "replies"]  # 👈 añadir replies

    def get_avatar(self, obj):
        return getattr(obj.user, "avatar_url", None)

    def get_time_ago(self, obj):
        return f"Hace {timesince(obj.created_at, now())}"

    def get_replies(self, obj):
        # Solo 2 niveles de profundidad máximo
        children = obj.child_replies.select_related("user").order_by("created_at")
        return ArgumentReplySerializer(children, many=True, context=self.context).data

class ArgumentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    avatar = serializers.SerializerMethodField()
    fighter_name = serializers.CharField(
        source="fighter_supported.name", read_only=True
    )
    vote_count = serializers.SerializerMethodField()
    user_voted = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    # ← Añadir estos dos campos write-only
    fight = serializers.PrimaryKeyRelatedField(
        queryset=Fight.objects.all(), write_only=True
    )
    fighter_supported = serializers.PrimaryKeyRelatedField(
        queryset=Fighter.objects.all(), write_only=True
    )

    class Meta:
        model = Argument
        fields = [
            "id",
            "username",
            "avatar",
            "text",
            "fight",  # ← añadir
            "fighter_supported",
            "fighter_name",
            "vote_count",
            "user_voted",
            "edited",
            "created_at",
            "time_ago",
            "replies",
        ]
        read_only_fields = [
            "username",
            "edited",
            "created_at",
            "vote_count",
            "user_voted",
            "time_ago",
            "replies",
        ]
    
    def get_avatar(self, obj):  
        return getattr(obj.user, "avatar_url", None)

    def get_vote_count(self, obj):
        return obj.argument_votes.count()

    def get_user_voted(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.argument_votes.filter(user=request.user).exists()

    def get_time_ago(self, obj):
        return f"Hace {timesince(obj.created_at, now())}"

    def get_replies(self, obj):
        request = self.context.get("request")
        limit = int(request.query_params.get("replies_limit", 5)) if request else 5
        qs = obj.replies.all().order_by("created_at")[:limit]
        return ArgumentReplySerializer(qs, many=True, context=self.context).data

    def validate_text(self, value):
        if len(value) > 600:
            raise serializers.ValidationError(
                "El comentario no puede superar 600 caracteres"
            )
        return value

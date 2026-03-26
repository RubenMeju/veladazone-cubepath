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


class SimpleUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        return getattr(obj, 'avatar_url', None)


class ArgumentReplySerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = ArgumentReply
        fields = ['id', 'user', 'text', 'created_at']
        # Quitamos la recursión profunda por ahora (evita complicaciones)


class ArgumentSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    fighter_name = serializers.CharField(source='fighter_supported.name', read_only=True)
    fighter_flag = serializers.SerializerMethodField()   # si tienes bandera en Fighter
    vote_count = serializers.SerializerMethodField()
    user_voted = serializers.SerializerMethodField()

    replies = ArgumentReplySerializer(many=True, read_only=True)

    class Meta:
        model = Argument
        fields = [
            'id',
            'user',
            'username',                    # para compatibilidad temporal
            'text',
            'fighter_supported',
            'fighter_name',
            'fighter_flag',
            'vote_count',
            'user_voted',
            'edited',
            'created_at',
            'replies'
        ]
        read_only_fields = ['user', 'edited', 'created_at']

    def get_username(self, obj):
        return obj.user.username

    def get_fighter_flag(self, obj):
        # Ajusta según tu modelo Fighter (puede ser None)
        return getattr(obj.fighter_supported, 'country_flag', '')

    def get_vote_count(self, obj):
        return obj.argument_votes.count()

    def get_user_voted(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return ArgumentVote.objects.filter(
            user=request.user, 
            argument=obj
        ).exists()
    user = serializers.SerializerMethodField()
    fighter_supported_name = serializers.CharField(source='fighter_supported.name', read_only=True)
    vote_count = serializers.IntegerField(source='vote_count', read_only=True)
    replies = ArgumentReplySerializer(many=True, read_only=True, source='replies')

    class Meta:
        model = Argument
        fields = [
            'id', 'user', 'text', 'fighter_supported', 'fighter_supported_name',
            'vote_count', 'created_at', 'updated_at', 'edited', 'replies'
        ]
        read_only_fields = ['user', 'edited']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            # añade avatar si lo tienes
        }
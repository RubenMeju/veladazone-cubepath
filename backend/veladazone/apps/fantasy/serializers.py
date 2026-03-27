from rest_framework import serializers
from .models import FantasyLeague, LeagueMember


class FantasyLeagueSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    invite_code = serializers.SerializerMethodField()

    class Meta:
        model = FantasyLeague
        fields = [
            "id",
            "name",
            "invite_code",
            "member_count",
            "created_at",
            "is_private",
        ]

    def get_member_count(self, obj):
        return obj.members.count()

    def get_invite_code(self, obj):
        request = self.context.get("request")
        # Si es privada, solo los miembros ven el código
        if obj.is_private:
            if request and request.user in obj.members.all():
                return obj.invite_code
            return None
        # Si es pública, mostrar siempre el código (puede ser None)
        return obj.invite_code


class LeagueDetailSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = FantasyLeague
        fields = [
            "id",
            "name",
            "invite_code",
            "created_at",
            "is_private",
            "member_count",
        ]

    def get_member_count(self, obj):
        return obj.members.count()

from rest_framework import serializers
from .models import FantasyLeague, LeagueMember


class FantasyLeagueSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    invite_code = serializers.SerializerMethodField()

    class Meta:
        model = FantasyLeague
        fields = ['id', 'name', 'invite_code', 'member_count', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_invite_code(self, obj):
        request = self.context.get('request')
        if request and obj.creator == request.user:
            return obj.invite_code
        return None


class LeagueDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = FantasyLeague
        fields = ['id', 'name', 'invite_code', 'created_at']

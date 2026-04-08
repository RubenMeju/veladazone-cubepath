from rest_framework import serializers
from .models import Fighter, Edition, Fight


class FighterSerializer(serializers.ModelSerializer):
    record = serializers.SerializerMethodField()

    class Meta:
        model = Fighter
        fields = [
            "id",
            "name",
            "slug",
            "country",
            "country_flag",
            "avatar_url",
            "twitter",
            "twitch",
            "bio",
            "channel_id",
            "record",
        ]

    def get_record(self, obj):
        return obj.record


class FightSerializer(serializers.ModelSerializer):
    fighter1 = FighterSerializer(read_only=True)
    fighter2 = FighterSerializer(read_only=True)
    winner = FighterSerializer(read_only=True)

    class Meta:
        model = Fight
        fields = [
            "id",
            "fighter1",
            "fighter2",
            "winner",
            "is_main_event",
            "order",
            "result_method",
            "is_completed",
            "youtube_url",
        ]


class EditionSerializer(serializers.ModelSerializer):
    fights = FightSerializer(many=True, read_only=True)

    class Meta:
        model = Edition
        fields = ["id", "number", "year", "date", "venue", "city", "fights"]

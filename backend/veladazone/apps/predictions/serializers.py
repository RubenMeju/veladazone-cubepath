from rest_framework import serializers
from .models import Prediction
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

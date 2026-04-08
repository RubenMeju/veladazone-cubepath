# veladazone/apps/blog/serializers.py
from rest_framework import serializers
from .models import BlogPost
from veladazone.apps.fighters.serializers import FighterSerializer


class BlogPostSerializer(serializers.ModelSerializer):
    fighter = FighterSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "fighter",
            "youtube_id",
            "title",
            "thumbnail_url",
            "published_at",
            "view_count",
            "relevance_score",
            "ai_summary",
            "ai_quote",
            "ai_tags",
            "status",
        ]
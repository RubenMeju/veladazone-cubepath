# backend/apps/blog/tasks.py
from django.conf import settings
from celery import shared_task
from googleapiclient.discovery import build

from veladazone.apps.fighters.models import Fighter
from .models import BlogPost
from .ai_classifier import classify_video
import redis, json

YT = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)
r = redis.Redis.from_url(settings.REDIS_URL)


@shared_task(name="blog.fetch_fighter_videos")
def fetch_fighter_videos(fighter_id=None):
    fighters = Fighter.objects.filter(channel_id__isnull=False)
    if fighter_id:
        fighters = fighters.filter(id=fighter_id)

    for fighter in fighters:
        _process_fighter_channel(fighter)


def _process_fighter_channel(fighter):
    # Busca los últimos 10 videos del canal
    response = (
        YT.search()
        .list(
            channelId=fighter.channel_id,
            order="date",
            maxResults=10,
            type="video",
            part="snippet",
        )
        .execute()
    )

    for item in response.get("items", []):
        video_id = item["id"]["videoId"]

        # Skip si ya existe en BD
        if BlogPost.objects.filter(youtube_id=video_id).exists():
            continue

        snippet = item["snippet"]

        # Clasificar con IA
        result = classify_video(snippet["title"], snippet["description"])

        # Guardar siempre el resultado (para stats), publicar solo si es Velada
        post = BlogPost.objects.create(
            fighter=fighter,
            youtube_id=video_id,
            title=snippet["title"],
            description=snippet["description"],
            thumbnail_url=snippet["thumbnails"]["high"]["url"],
            channel_id=fighter.channel_id,
            published_at=snippet["publishedAt"],
            is_velada=result["is_velada"],
            relevance_score=result["relevance_score"],
            ai_summary=result.get("summary", ""),
            ai_quote=result.get("quote", ""),
            ai_tags=result.get("tags", []),
            # Auto-publish si relevance > 0.7, sino pendiente para revisión
            status=(
                "published"
                if result["is_velada"] and result["relevance_score"] > 0.7
                else "pending"
            ),
        )

        # Invalidar cache del blog
        r.delete("blog:list:*")

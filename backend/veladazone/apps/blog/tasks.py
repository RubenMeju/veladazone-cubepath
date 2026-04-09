from django.conf import settings
from django.utils import timezone
from celery import shared_task
from googleapiclient.discovery import build
from datetime import timedelta
from typing import Optional

from veladazone.apps.fighters.models import Fighter
from .models import BlogPost
from .ai_classifier import classify_video
import redis

YT = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)
r: redis.Redis = redis.Redis.from_url(settings.REDIS_URL)  # type: ignore
assert r is not None, "Redis connection failed"

VELADA_KEYWORDS = [
    "velada",
    "boxeo",
    "pelea",
    "combate",
    "entrenamiento",
    "sparring",
    "ring",
    "guantes",
    "rival",
    "plex",
    "illojuan",
    "grefg",
    "rivers",
    "fernanfloo",
    "perxitaa",
    "momo",
    "luisito",
    "weigh",
    "pesaje",
    "cara a cara",
    "rueda de prensa",
]


def _title_looks_relevant(title: str) -> bool:
    title_lower = title.lower()
    return any(kw in title_lower for kw in VELADA_KEYWORDS)


def _invalidate_blog_cache() -> None:
    try:
        keys = r.keys("blog:list:*")  # type: ignore
        if keys:
            r.delete(*keys)  # type: ignore
    except Exception:
        pass


@shared_task(name="blog.fetch_fighter_videos")
def fetch_fighter_videos(fighter_id=None, initial=False):
    fighters = Fighter.objects.filter(channel_id__isnull=False).exclude(channel_id="")
    if fighter_id:
        fighters = fighters.filter(id=fighter_id)

    for fighter in fighters:
        _process_fighter_channel(fighter, initial=initial)


def _process_fighter_channel(fighter, initial=False):
    if initial:
        published_after = (timezone.now() - timedelta(weeks=3)).strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        max_results = 50
    else:
        published_after = (timezone.now() - timedelta(hours=7)).strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        max_results = 10

    response = (
        YT.search()
        .list(
            channelId=fighter.channel_id,
            order="date",
            maxResults=max_results,
            type="video",
            part="snippet",
            publishedAfter=published_after,
        )
        .execute()
    )

    for item in response.get("items", []):
        video_id = item["id"]["videoId"]

        if BlogPost.objects.filter(youtube_id=video_id).exists():
            continue

        snippet = item["snippet"]
        title = snippet["title"]

        if not _title_looks_relevant(title):
            BlogPost.objects.create(
                fighter=fighter,
                youtube_id=video_id,
                title=title,
                description=snippet["description"],
                thumbnail_url=snippet["thumbnails"]["high"]["url"],
                channel_id=fighter.channel_id,
                published_at=snippet["publishedAt"],
                is_velada=False,
                relevance_score=0.0,
                ai_summary="",
                ai_quote="",
                ai_tags=[],
                status="rejected",
            )
            continue

        result = classify_video(title, snippet["description"])

        BlogPost.objects.create(
            fighter=fighter,
            youtube_id=video_id,
            title=title,
            description=snippet["description"],
            thumbnail_url=snippet["thumbnails"]["high"]["url"],
            channel_id=fighter.channel_id,
            published_at=snippet["publishedAt"],
            is_velada=result["is_velada"],
            relevance_score=result["relevance_score"],
            ai_summary=result.get("summary", ""),
            ai_quote=result.get("quote", ""),
            ai_tags=result.get("tags", []),
            status=(
                "published"
                if result["is_velada"] and result["relevance_score"] > 0.7
                else "pending"
            ),
        )

        _invalidate_blog_cache()

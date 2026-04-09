"""
Cuando añadas un peleador nuevo, lanzar una vez fetch_fighter_videos.delay(fighter_id=X, initial=True) para recuperar las 3 semanas anteriores
"""

from django.conf import settings
from django.utils import timezone
from celery import shared_task
from googleapiclient.discovery import build
from datetime import timedelta

from veladazone.apps.fighters.models import Fighter
from .models import BlogPost
from .ai_classifier import classify_video
import redis

YT = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)
r: redis.Redis = redis.Redis.from_url(settings.REDIS_URL)  # type: ignore

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

# Set de youtube_ids ya vistos en este ciclo para evitar re-evaluar
# videos irrelevantes que no se guardan en BD
_seen_this_cycle: set[str] = set()


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
    _seen_this_cycle.clear()  # reset al inicio de cada ciclo

    fighters = Fighter.objects.filter(channel_id__isnull=False).exclude(channel_id="")
    if fighter_id:
        fighters = fighters.filter(id=fighter_id)

    for fighter in fighters:
        _process_fighter_channel(fighter, initial=initial)

    _invalidate_blog_cache()  # una sola invalidación al final del ciclo


def _process_fighter_channel(fighter, initial: bool = False) -> None:
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

        # Skip si ya está en BD o ya lo vimos en este ciclo
        if video_id in _seen_this_cycle:
            continue
        if BlogPost.objects.filter(youtube_id=video_id).exists():
            _seen_this_cycle.add(video_id)
            continue

        snippet = item["snippet"]
        title = snippet["title"]

        # Pre-filtro por título sin llamar a Groq
        if not _title_looks_relevant(title):
            _seen_this_cycle.add(video_id)
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

        _seen_this_cycle.add(video_id)

    # Cache invalidada una sola vez al final del ciclo completo (en fetch_fighter_videos)

def _process_extra_channel(channel, initial: bool = False) -> None:
    if initial:
        published_after = (timezone.now() - timedelta(weeks=3)).strftime("%Y-%m-%dT%H:%M:%SZ")
        max_results = 50
    else:
        published_after = (timezone.now() - timedelta(hours=7)).strftime("%Y-%m-%dT%H:%M:%SZ")
        max_results = 10

    response = (
        YT.search()
        .list(
            channelId=channel.channel_id,
            order="date",
            maxResults=max_results,
            type="video",
            part="snippet",
            publishedAfter=published_after,
        )
        .execute()
    )

    keywords = channel.get_keywords()  # ← keywords del canal

    for item in response.get("items", []):
        video_id = item["id"]["videoId"]

        if video_id in _seen_this_cycle:
            continue
        if BlogPost.objects.filter(youtube_id=video_id).exists():
            _seen_this_cycle.add(video_id)
            continue

        snippet = item["snippet"]
        title = snippet["title"]

        # Filtra con las keywords específicas del canal
        title_lower = title.lower()
        if not any(kw in title_lower for kw in keywords):
            _seen_this_cycle.add(video_id)
            continue

        result = classify_video(title, snippet["description"])

        BlogPost.objects.create(
            fighter=None,
            youtube_id=video_id,
            title=title,
            description=snippet["description"],
            thumbnail_url=snippet["thumbnails"]["high"]["url"],
            channel_id=channel.channel_id,
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
        _seen_this_cycle.add(video_id)
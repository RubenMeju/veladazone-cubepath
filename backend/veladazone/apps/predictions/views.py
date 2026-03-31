import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Prefetch, Count, Q
from typing import cast, Optional
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response
from django.core.cache import cache
from rest_framework.request import Request as DRFRequest

from veladazone.apps.users.models import User as CustomUser
from veladazone.apps.predictions.pagination import ArgumentPagination

from .models import Argument, ArgumentReply, ArgumentVote, Prediction
from .serializers import (
    ArgumentReplySerializer,
    ArgumentSerializer,
    PredictionSerializer,
)
from veladazone.apps.fighters.models import Fight, Fighter


def generate_ai_comment(fighter_name: str, opponent_name: str, edition: int) -> str:
    """Call Groq API to generate an epic Spanish boxing commentator line."""
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "user",
                    "content": (
                        f"Eres un comentarista épico de boxeo español para La Velada del Año {edition}. "
                        f"El usuario acaba de apostar por {fighter_name} contra {opponent_name}. "
                        f"Genera UNA sola frase épica, dramática y divertida en español (máximo 2 líneas) "
                        f"al estilo de los grandes eventos de boxeo. "
                        f"Menciona a {fighter_name} como el elegido. Sin emojis. Solo texto épico."
                    ),
                }
            ],
            "max_tokens": 150,
            "temperature": 0.9,
        }
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return f"¡{fighter_name} ha sido elegido para escribir su leyenda esta noche!"


def get_badge(correct: int, total: int) -> dict:
    if total == 0:
        return {"label": "Novato", "color": "#6b7280", "emoji": "🥊"}
    accuracy = (correct / total) * 100
    if correct >= 8 and accuracy >= 80:
        return {"label": "Oráculo", "color": "#f4a261", "emoji": "🔮"}
    elif correct >= 5 and accuracy >= 65:
        return {"label": "Experto", "color": "#e63946", "emoji": "🏆"}
    elif correct >= 3 and accuracy >= 50:
        return {"label": "Analista", "color": "#9146FF", "emoji": "📊"}
    return {"label": "Novato", "color": "#6b7280", "emoji": "🥊"}


class PredictionViewSet(viewsets.ModelViewSet):
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Prediction.objects.filter(user=self.request.user).select_related(
            "fight", "predicted_winner", "fight__fighter1", "fight__fighter2"
        )

    def create(self, request, *args, **kwargs):
        fight_id = request.data.get("fight_id")
        winner_id = request.data.get("predicted_winner_id")

        try:
            fight = Fight.objects.select_related("fighter1", "fighter2", "edition").get(
                id=fight_id
            )
            winner = Fighter.objects.get(id=winner_id)
        except (Fight.DoesNotExist, Fighter.DoesNotExist):
            return Response(
                {"error": "Combate o luchador no encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if winner not in [fight.fighter1, fight.fighter2]:
            return Response(
                {"error": "El luchador no participa en este combate"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing = Prediction.objects.filter(user=request.user, fight=fight).first()
        betrayal_count = 0
        previous_winner = None
        if existing and existing.predicted_winner != winner:
            betrayal_count = existing.betrayal_count + 1
            previous_winner = existing.predicted_winner

        opponent = fight.fighter2 if winner == fight.fighter1 else fight.fighter1
        ai_comment = generate_ai_comment(
            winner.name, opponent.name, fight.edition.number
        )

        prediction, created = Prediction.objects.update_or_create(
            user=request.user,
            fight=fight,
            defaults={
                "predicted_winner": winner,
                "previous_winner": previous_winner,
                "ai_comment": ai_comment,
                "betrayal_count": betrayal_count,
            },
        )

        cache.delete("leaderboard")
        cache.delete("community_stats")

        return Response(
            PredictionSerializer(prediction).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        pagination_class=None,
    )
    def top_leaderboard(self, request):
        """Devuelve solo los 10 primeros del leaderboard, sin paginación"""
        User = get_user_model()

        users = (
            User.objects.annotate(
                total=Count("predictions"),
                correct=Count("predictions", filter=Q(predictions__is_correct=True)),
            )
            .filter(total__gt=0)
            .order_by("-correct", "-total")[:10]  # Solo top 10
        )

        data = [
            {
                "rank": i + 1,
                "username": u.username,
                "avatar": getattr(u, "avatar_url", None),
                "correct": getattr(u, "correct", 0),
                "total": getattr(u, "total", 0),
                "accuracy": (
                    round((getattr(u, "correct", 0) / getattr(u, "total", 1)) * 100)
                    if getattr(u, "total", 0) > 0
                    else 0
                ),
                "badge": get_badge(getattr(u, "correct", 0), getattr(u, "total", 0)),
            }
            for i, u in enumerate(users)
        ]

        return Response(data)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def leaderboard(self, request):
        """Paginated leaderboard with limit and offset."""
        from django.db.models import Count, Q

        UserModel = get_user_model()
        limit = int(request.query_params.get("limit", 50))
        offset = int(request.query_params.get("offset", 0))

        users = (
            UserModel.objects.annotate(
                total=Count("predictions"),
                correct=Count("predictions", filter=Q(predictions__is_correct=True)),
            )
            .filter(total__gt=0)
            .order_by("-correct", "-total")[offset : offset + limit]
            .values(
                "id", "username", "avatar_url", "total", "correct", "twitch_username"
            )
        )

        data = [
            {
                "rank": offset + i + 1,
                "username": u.get("twitch_username") or u["username"],
                "avatar": u.get("avatar_url"),
                "correct": u["correct"],
                "total": u["total"],
                "accuracy": (
                    round((u["correct"] / u["total"]) * 100) if u["total"] > 0 else 0
                ),
                "badge": get_badge(u["correct"], u["total"]),
            }
            for i, u in enumerate(users)
        ]

        next_offset = offset + limit if len(users) == limit else None
        return Response({"results": data, "nextOffset": next_offset})

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def community_stats(self, request):
        """Returns community vote % per fight."""

        cached = cache.get("community_stats")
        if cached:
            return Response(cached)

        fights: list = list(
            Fight.objects.filter(edition__number=6).prefetch_related("predictions")
        )
        result = []
        for fight in fights:
            total = fight.predictions.count()  # type: ignore
            f1_votes = fight.predictions.filter(predicted_winner=fight.fighter1).count()  # type: ignore
            f2_votes = fight.predictions.filter(predicted_winner=fight.fighter2).count()  # type: ignore
            result.append(
                {
                    "fight_id": fight.id,
                    "fighter1_pct": (
                        round((f1_votes / total) * 100) if total > 0 else 50
                    ),
                    "fighter2_pct": (
                        round((f2_votes / total) * 100) if total > 0 else 50
                    ),
                    "total_votes": total,
                }
            )
        cache.set("community_stats", result, 60)  # 1 minuto

        return Response(result)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def betrayals(self, request):
        """Returns total betrayals and details per fight."""
        predictions = Prediction.objects.filter(
            user=request.user, betrayal_count__gt=0
        ).select_related(
            "fight__fighter1", "fight__fighter2", "predicted_winner", "previous_winner"
        )

        total = sum(p.betrayal_count for p in predictions)

        details = [
            {
                "fight": f"{p.fight.fighter1.name} vs {p.fight.fighter2.name}",
                "betrayed": p.previous_winner.name if p.previous_winner else None,
                "current": p.predicted_winner.name,
                "times": p.betrayal_count,
            }
            for p in predictions
        ]

        return Response(
            {
                "total_betrayals": total,
                "details": details,
            }
        )


class ArgumentViewSet(viewsets.ModelViewSet):
    serializer_class = ArgumentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = ArgumentPagination

    def get_queryset(self):
        request = cast(DRFRequest, self.request)
        user = request.user if request.user.is_authenticated else None

        queryset = (
            Argument.objects.select_related("user", "fighter_supported")
            .prefetch_related(
                Prefetch(
                    "replies",
                    queryset=ArgumentReply.objects.select_related("user")
                    .prefetch_related(
                        Prefetch(
                            "child_replies",
                            queryset=ArgumentReply.objects.select_related(
                                "user"
                            ).order_by("created_at"),
                        )
                    )
                    .filter(parent=None)
                    .order_by("created_at"),
                ),
            )
            .annotate(vote_count=Count("argument_votes"))
        )

        if user:
            queryset = queryset.prefetch_related(
                Prefetch(
                    "argument_votes",
                    queryset=ArgumentVote.objects.filter(user=user),
                    to_attr="user_votes",
                )
            )

        fight_id_str: Optional[str] = request.query_params.get("fight")
        if fight_id_str and fight_id_str.isdigit():
            queryset = queryset.filter(fight_id=int(fight_id_str))

        return queryset.order_by("-created_at")

    def perform_create(self, serializer):
        request = cast(DRFRequest, self.request)
        serializer.save(user=request.user)

    def create(self, request: DRFRequest, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reply(self, request: DRFRequest, pk: Optional[int] = None) -> Response:
        argument = self.get_object()
        text: str = (request.data.get("text") or "").strip()
        parent_reply_id = request.data.get("parent_reply_id")

        if not text:
            return Response({"error": "El texto es requerido"}, status=400)

        parent = None
        if parent_reply_id is not None:  # ✅ cambio clave
            try:
                parent = ArgumentReply.objects.get(
                    id=parent_reply_id, argument=argument
                )
            except ArgumentReply.DoesNotExist:
                return Response({"error": "Reply padre no encontrado"}, status=400)

        reply = ArgumentReply.objects.create(
            user=request.user,
            argument=argument,
            parent=parent,
            text=text,
        )

        serializer = ArgumentReplySerializer(reply, context={"request": request})
        return Response(serializer.data, status=201)


class CartelPublicoView(generics.ListAPIView):
    serializer_class = PredictionSerializer
    permission_classes = []  # público, sin auth

    def get_queryset(self):
        username = self.kwargs["username"]
        return (
            Prediction.objects.filter(
                user__twitch_username__iexact=username,  # case-insensitive
                fight__edition=6,
            )
            .select_related(
                "fight__fighter1",
                "fight__fighter2",
                "predicted_winner",
            )
            .order_by("-fight__is_main_event", "fight__order")
        )

import requests
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Argument, Prediction
from .serializers import ArgumentSerializer, PredictionSerializer
from veladazone.apps.fighters.models import Fight, Fighter


def generate_ai_comment(fighter_name: str, opponent_name: str, edition: int) -> str:
    """Call Gemini API to generate an epic Spanish boxing commentator line."""
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.GEMINI_API_KEY}"
        prompt = (
            f"Eres un comentarista épico de boxeo español para La Velada del Año {edition}. "
            f"El usuario acaba de apostar por {fighter_name} contra {opponent_name}. "
            f"Genera UNA sola frase épica, dramática y divertida en español (máximo 2 líneas) "
            f"al estilo de los grandes eventos de boxeo. "
            f"Menciona a {fighter_name} como el elegido. Sin emojis. Solo texto épico."
        )
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        response = requests.post(url, json=payload, timeout=10)
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return f"¡{fighter_name} ha sido elegido para escribir su leyenda esta noche!"


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

        # Comprueba si ya existe una predicción
        existing = Prediction.objects.filter(user=request.user, fight=fight).first()
        betrayal_count = 0
        previous_winner = None

        if existing and existing.predicted_winner != winner:
            # ¡Traición! El usuario cambia de luchador
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

        return Response(
            PredictionSerializer(prediction).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def leaderboard(self, request):
        """Global leaderboard ranked by prediction accuracy."""
        from django.db.models import Count, Q
        from django.contrib.auth import get_user_model

        User = get_user_model()

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

        users: list = list(
            User.objects.annotate(
                total=Count("predictions"),
                correct=Count("predictions", filter=Q(predictions__is_correct=True)),
            )
            .filter(total__gt=0)
            .order_by("-correct", "-total")[:10]
        )

        data = [
            {
                "rank": i + 1,
                "username": u.display_name,
                "avatar": u.avatar_url,
                "correct": u.correct,
                "total": u.total,
                "accuracy": round((u.correct / u.total) * 100) if u.total > 0 else 0,
                "badge": get_badge(u.correct, u.total),
            }
            for i, u in enumerate(users)
        ]
        return Response(data)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def community_stats(self, request):
        """Returns community vote % per fight."""
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
    http_method_names = ["get", "post", "delete"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Argument.objects.select_related(
            "user", "fighter_supported", "fight"
        ).prefetch_related("replies__user", "argument_votes")
        fight_id = self.request.query_params.get("fight")  # type: ignore
        if fight_id:
            qs = qs.filter(fight_id=fight_id)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def create(self, request, *args, **kwargs):
        fight_id = request.data.get("fight_id")
        fighter_id = request.data.get("fighter_id")
        text = request.data.get("text", "").strip()

        if not text or len(text) > 280:
            return Response(
                {"error": "El argumento debe tener entre 1 y 280 caracteres"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            fight = Fight.objects.get(id=fight_id)
            fighter = Fighter.objects.get(id=fighter_id)
        except (Fight.DoesNotExist, Fighter.DoesNotExist):
            return Response(
                {"error": "Combate o luchador no encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if fighter not in [fight.fighter1, fight.fighter2]:
            return Response(
                {"error": "El luchador no participa en este combate"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Comprueba si ya existe y si puede editar
        existing = Argument.objects.filter(user=request.user, fight=fight).first()
        if existing:
            if existing.edited:
                return Response(
                    {"error": "Solo puedes editar tu argumento una vez"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if existing.vote_count >= 3:
                return Response(
                    {"error": "No puedes editar un argumento con 3 o más votos"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        argument, created = Argument.objects.update_or_create(
            user=request.user,
            fight=fight,
            defaults={
                "fighter_supported": fighter,
                "text": text,
                "edited": existing is not None,  # True si estaba editando, False si es nuevo
            },
        )

        return Response(
            ArgumentSerializer(argument, context={"request": request}).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def vote(self, request, pk=None):
        argument = self.get_object()
        if argument.user == request.user:
            return Response(
                {"error": "No puedes votar tu propio argumento"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vote, created = ArgumentVote.objects.get_or_create(
            user=request.user, argument=argument
        )
        if not created:
            vote.delete()
            return Response({"voted": False, "vote_count": argument.vote_count})

        return Response({"voted": True, "vote_count": argument.vote_count})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reply(self, request, pk=None):
        argument = self.get_object()
        text = request.data.get("text", "").strip()

        if not text or len(text) > 280:
            return Response(
                {"error": "La respuesta debe tener entre 1 y 280 caracteres"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reply, created = ArgumentReply.objects.get_or_create(
            user=request.user, argument=argument, defaults={"text": text}
        )

        if not created:
            return Response(
                {"error": "Ya has respondido a este argumento"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            ArgumentReplySerializer(reply).data, status=status.HTTP_201_CREATED
        )

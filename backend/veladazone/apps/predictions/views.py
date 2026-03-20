import requests
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Prediction
from .serializers import PredictionSerializer
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

        opponent = fight.fighter2 if winner == fight.fighter1 else fight.fighter1
        ai_comment = generate_ai_comment(
            winner.name, opponent.name, fight.edition.number
        )

        prediction, created = Prediction.objects.update_or_create(
            user=request.user,
            fight=fight,
            defaults={"predicted_winner": winner, "ai_comment": ai_comment},
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

        users = (
            User.objects.annotate(
                total=Count("predictions"),
                correct=Count("predictions", filter=Q(predictions__is_correct=True)),
            )
            .filter(total__gt=0)
            .order_by("-correct", "-total")[:10]
        )

        def get_badge(correct, total):
            if total == 0:
                return {"label": "Novato", "color": "#6b7280", "emoji": "🥊"}
            accuracy = (correct / total) * 100
            if correct >= 8 and accuracy >= 80:
                return {"label": "Oráculo", "color": "#f4a261", "emoji": "🔮"}
            elif correct >= 5 and accuracy >= 65:
                return {"label": "Experto", "color": "#e63946", "emoji": "🏆"}
            elif correct >= 3 and accuracy >= 50:
                return {"label": "Analista", "color": "#9146FF", "emoji": "📊"}
            else:
                return {"label": "Novato", "color": "#6b7280", "emoji": "🥊"}

        data = [
            {
                "rank": i + 1,
                "username": u.display_name,
                "avatar": u.avatar_url,
                "correct": u.correct,
                "total": u.total,
                "accuracy": round((u.correct / u.total) * 100) if u.total > 0 else 0,
            }
            for i, u in enumerate(users)
        ]
        return Response(data)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def community_stats(self, request):
        """Returns community vote % per fight."""
        from django.db.models import Count

        fights = Fight.objects.filter(edition__number=6).prefetch_related("predictions")
        result = []
        for fight in fights:
            total = fight.predictions.count()
            f1_votes = fight.predictions.filter(predicted_winner=fight.fighter1).count()
            f2_votes = fight.predictions.filter(predicted_winner=fight.fighter2).count()
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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.shortcuts import redirect
from django.conf import settings
from django.views import View
from django.contrib.auth import get_user_model

from veladazone.apps.fantasy.models import FantasyLeague
from veladazone.apps.achievements.service import check_achievements  # ← NUEVO
from .serializers import UserSerializer


User = get_user_model()


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class TwitchCallbackView(View):
    """After Twitch OAuth, set JWT in HttpOnly cookies and redirect to frontend."""

    def get(self, request):
        if request.user.is_authenticated:
            refresh = RefreshToken.for_user(request.user)
            frontend_url = settings.FRONTEND_URL

            state = request.GET.get("state", "")
            from_pwa = ":from_pwa" in state

            access_token = str(refresh.access_token)  # type: ignore
            refresh_token_str = str(refresh)

            # ── Logro de primer login ────────────────────────────────────────
            check_achievements(request.user, trigger="login")
            # ── Fin logros ───────────────────────────────────────────────────

            if from_pwa:
                response = redirect(
                    f"{frontend_url}/auth/callback"
                    f"?access_token={access_token}"
                    f"&refresh_token={refresh_token_str}"
                    f"&from_pwa=true"
                )
            else:
                response = redirect(f"{frontend_url}/auth/callback")

            response.set_cookie(
                "access_token",
                access_token,
                max_age=86400 * 7,
                httponly=True,
                secure=True,
                samesite="None",
            )
            response.set_cookie(
                "refresh_token",
                refresh_token_str,
                max_age=86400 * 30,
                httponly=True,
                secure=True,
                samesite="None",
            )
            return response

        return redirect(f"{settings.FRONTEND_URL}/?error=auth_failed")


class TokenRefreshView(APIView):
    """Refresh access token using refresh token from cookie."""

    permission_classes = []

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            response = Response({"detail": "Token refreshed"})
            response.set_cookie(
                "access_token",
                new_access,
                max_age=86400 * 7,
                httponly=True,
                secure=True,
                samesite="Lax",
            )
            return response
        except (TokenError, InvalidToken):
            return Response({"error": "Invalid refresh token"}, status=401)


class LogoutView(View):
    """Clear JWT cookies."""

    def get(self, request):
        response = redirect(settings.FRONTEND_URL)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class MyStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Count, Q
        from veladazone.apps.predictions.models import Prediction

        stats = Prediction.objects.filter(user=request.user).aggregate(
            total=Count("id"), correct=Count("id", filter=Q(is_correct=True))
        )

        total = stats["total"] or 0
        correct = stats["correct"] or 0
        accuracy = round((correct / total) * 100) if total > 0 else 0

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

        return Response(
            {
                "total": total,
                "correct": correct,
                "accuracy": accuracy,
                "badge": get_badge(correct, total),
            }
        )


class PublicProfileView(APIView):
    permission_classes = []

    def get(self, request, username):
        try:
            user = User.objects.get(twitch_username__iexact=username)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

        from django.db.models import Count, Q
        from veladazone.apps.predictions.models import Prediction, Argument

        # Incrementa contador de visitas
        user.profile_views = (user.profile_views or 0) + 1  # type: ignore
        user.save(update_fields=["profile_views"])

        # ── Logros de visitas de perfil ──────────────────────────────────────
        check_achievements(
            user,
            trigger="profile_visited",
            profile_views=user.profile_views,  # type: ignore
        )
        # ── Fin logros ───────────────────────────────────────────────────────

        # Stats
        stats = Prediction.objects.filter(user=user).aggregate(
            total=Count("id"),
            correct=Count("id", filter=Q(is_correct=True)),
        )
        total = stats["total"] or 0
        correct = stats["correct"] or 0
        accuracy = round((correct / total) * 100) if total > 0 else 0

        # Predicciones
        predictions = (
            Prediction.objects.filter(user=user)
            .select_related("fight__fighter1", "fight__fighter2", "predicted_winner")
            .order_by("-created_at")
        )

        # Argumentos del usuario (primer nivel) con votos
        arguments = (
            Argument.objects.filter(user=user)
            .select_related("fight__fighter1", "fight__fighter2", "fighter_supported")
            .annotate(vote_count=Count("argument_votes"))
            .order_by("-created_at")[:5]
        )

        # Ligas creadas
        leagues_created = FantasyLeague.objects.filter(creator=user).values(
            "id", "name", "is_private"
        )

        # Ligas en las que está unido (excluyendo creadas para no duplicar)
        leagues_joined = (
            FantasyLeague.objects.filter(members=user)
            .exclude(creator=user)
            .values("id", "name", "is_private")
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
            return {"label": "Novato", "color": "#6b7280", "emoji": "🥊"}

        return Response(
            {
                "username": user.twitch_username,  # type: ignore
                "display_name": user.display_name,  # type: ignore
                "avatar": user.avatar_url,  # type: ignore
                "profile_views": user.profile_views,  # type: ignore
                "stats": {
                    "total": total,
                    "correct": correct,
                    "accuracy": accuracy,
                    "badge": get_badge(correct, total),
                },
                "betrayal_count": sum(
                    p.betrayal_count
                    for p in Prediction.objects.filter(user=user, betrayal_count__gt=0)
                ),
                "predictions": [
                    {
                        "fight": f"{p.fight.fighter1.name} vs {p.fight.fighter2.name}",
                        "pick": p.predicted_winner.name,
                        "pick_flag": p.predicted_winner.country_flag,
                        "is_correct": p.is_correct,
                    }
                    for p in predictions
                ],
                "arguments": [
                    {
                        "fight": f"{a.fight.fighter1.name} vs {a.fight.fighter2.name}",
                        "fighter": a.fighter_supported.name,
                        "text": a.text,
                        "votes": getattr(a, "vote_count", 0),
                    }
                    for a in arguments
                ],
                "leagues_created": list(leagues_created),
                "leagues_joined": list(leagues_joined),
            }
        )


class DNAView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from veladazone.apps.predictions.models import Prediction
        import requests as http_requests

        predictions = Prediction.objects.filter(user=request.user).select_related(
            "fight__fighter1", "fight__fighter2", "predicted_winner"
        )

        if not predictions.exists():
            return Response({"error": "No tienes predicciones aún"}, status=400)

        total = predictions.count()
        betrayals = sum(p.betrayal_count for p in predictions)

        community_picks = 0
        underdog_picks = 0
        spanish_picks = 0
        foreign_picks = 0

        from veladazone.apps.predictions.models import Prediction as P
        from django.db.models import Count

        for pred in predictions:
            f1_votes = P.objects.filter(
                fight=pred.fight, predicted_winner=pred.fight.fighter1
            ).count()
            f2_votes = P.objects.filter(
                fight=pred.fight, predicted_winner=pred.fight.fighter2
            ).count()
            total_votes = f1_votes + f2_votes

            if total_votes > 0:
                picked_votes = (
                    f1_votes
                    if pred.predicted_winner == pred.fight.fighter1
                    else f2_votes
                )
                pct = (picked_votes / total_votes) * 100
                if pct >= 50:
                    community_picks += 1
                else:
                    underdog_picks += 1

            if pred.predicted_winner.country in ["España", "Spain"]:
                spanish_picks += 1
            else:
                foreign_picks += 1

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
                            f"Eres un analista épico de La Velada del Año. "
                            f"Analiza el perfil de predictor del usuario con estos datos: "
                            f"- Total de predicciones: {total}/10 "
                            f"- Picks con la comunidad (favoritos): {community_picks} "
                            f"- Picks contra la comunidad (underdogs): {underdog_picks} "
                            f"- Picks de luchadores españoles: {spanish_picks} "
                            f"- Picks de luchadores extranjeros: {foreign_picks} "
                            f"- Número de traiciones (cambios de pick): {betrayals} "
                            f"Genera un análisis épico y dramático en español de máximo 3 líneas "
                            f"describiendo su personalidad como predictor de La Velada. "
                            f"Sé creativo, usa metáforas de boxeo. Sin emojis. "
                            f"Empieza siempre con un título de una sola palabra en mayúsculas que defina su tipo de predictor "
                            f"(ejemplo: ESTRATEGA, REBELDE, TRAIDOR, VISIONARIO, COBARDE, LEAL, etc) "
                            f"seguido de dos puntos y el análisis."
                        ),
                    }
                ],
                "max_tokens": 200,
                "temperature": 0.9,
            }
            response = http_requests.post(
                url, headers=headers, json=payload, timeout=10
            )
            data = response.json()
            dna_text = data["choices"][0]["message"]["content"].strip()
        except Exception:
            dna_text = "MISTERIOSO: Tu estilo de predicción desafía todo análisis. Eres un enigma en el ring."

        # Trigger de logros al generar DNA
        check_achievements(request.user, trigger="dna_generated")
        # ------------------------------
        return Response(
            {
                "dna": dna_text,
                "stats": {
                    "total": total,
                    "community_picks": community_picks,
                    "underdog_picks": underdog_picks,
                    "spanish_picks": spanish_picks,
                    "foreign_picks": foreign_picks,
                    "betrayals": betrayals,
                },
            }
        )

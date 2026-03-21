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

            response = redirect(f"{frontend_url}/auth/callback")

            # Set tokens in HttpOnly cookies
            response.set_cookie(
                "access_token",
                str(refresh.access_token),  # type: ignore
                max_age=86400 * 7,  # 7 días (antes era 3600 = 1 hora)
                httponly=True,
                secure=True,
                samesite="Lax",
            )
            response.set_cookie(
                "refresh_token",
                str(refresh),
                max_age=86400 * 30,  # 30 días
                httponly=True,
                secure=True,
                samesite="Lax",
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
                max_age=86400 * 7,  # 7 días
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

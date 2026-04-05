from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count

from .models import Achievement, UserAchievement
from veladazone.apps.achievements.serializers import (
    AchievementSerializer,
    UserAchievementSerializer,
)


class MyAchievementsView(APIView):
    """Logros del usuario autenticado, con los no desbloqueados (visibles) al final."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        User = get_user_model()

        unlocked_qs = (
            UserAchievement.objects.filter(user=request.user)
            .select_related("achievement")
            .order_by("-unlocked_at")
        )

        unlocked_slugs = set(ua.achievement.slug for ua in unlocked_qs)

        # Todos los logros no secretos que aún no tiene
        locked_qs = Achievement.objects.filter(is_secret=False).exclude(
            slug__in=unlocked_slugs
        )

        total_points = sum(ua.achievement.points for ua in unlocked_qs)

        return Response(
            {
                "total_points": total_points,
                "unlocked_count": len(unlocked_slugs),
                "unlocked": UserAchievementSerializer(unlocked_qs, many=True).data,
                "locked": AchievementSerializer(locked_qs, many=True).data,
            }
        )


class UnreadAchievementsView(APIView):
    """
    Logros recién desbloqueados que aún no se han mostrado al usuario.
    El frontend hace polling ligero (o lo consulta al cargar) y los muestra
    como notificación toast. Llamar a POST /achievements/mark-read/ para limpiar.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        unread = UserAchievement.objects.filter(
            user=request.user, notified=False
        ).select_related("achievement")
        return Response(UserAchievementSerializer(unread, many=True).data)

    def post(self, request):
        """Marca todos los no leídos como notificados."""
        UserAchievement.objects.filter(user=request.user, notified=False).update(
            notified=True
        )
        return Response({"ok": True})


class PublicAchievementsView(APIView):
    """Logros públicos de un usuario por username (para el perfil público)."""

    permission_classes = [AllowAny]

    def get(self, request, username):
        User = get_user_model()
        try:
            user = User.objects.get(twitch_username__iexact=username)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

        unlocked_qs = (
            UserAchievement.objects.filter(user=user)
            .select_related("achievement")
            .order_by("-unlocked_at")
        )

        total_points = sum(ua.achievement.points for ua in unlocked_qs)

        return Response(
            {
                "total_points": total_points,
                "achievements": UserAchievementSerializer(unlocked_qs, many=True).data,
            }
        )


class AchievementLeaderboardView(APIView):
    """Ranking por puntos de logros — distinto al de predicciones."""

    permission_classes = [AllowAny]

    def get(self, request):
        User = get_user_model()

        # Agrupamos UserAchievement → suma de puntos por usuario
        top = (
            UserAchievement.objects.select_related("user", "achievement")
            .values("user__twitch_username", "user__avatar_url")
            .annotate(
                total_points=Sum("achievement__points"),
                achievement_count=Count("id"),
            )
            .order_by("-total_points")[:50]
        )

        data = [
            {
                "rank": i + 1,
                "username": row["user__twitch_username"],
                "avatar": row["user__avatar_url"],
                "total_points": row["total_points"],
                "achievement_count": row["achievement_count"],
            }
            for i, row in enumerate(top)
        ]

        return Response(data)

class AchievementCatalogView(APIView):
    """Catálogo público de todos los logros no secretos."""
    permission_classes = [AllowAny]
 
    def get(self, request):
        achievements = Achievement.objects.filter(is_secret=False).order_by(
            "category", "points"
        )
        return Response(AchievementSerializer(achievements, many=True).data)
 
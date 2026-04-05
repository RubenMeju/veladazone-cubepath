from rest_framework import viewsets, status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import permission_classes

from veladazone.apps.achievements.service import check_achievements  # ← NUEVO

from .models import FantasyLeague, LeagueMember
from .serializers import FantasyLeagueSerializer


class FantasyLeagueViewSet(viewsets.ModelViewSet):
    serializer_class = FantasyLeagueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FantasyLeague.objects.filter(
            Q(members=user) | Q(is_private=False)
        ).distinct()

    def create(self, request, *args, **kwargs):
        is_private = request.data.get("is_private", True)
        if isinstance(is_private, str):
            is_private = is_private.lower() in ["true", "1"]

        league = FantasyLeague.objects.create(
            name=request.data.get("name"), creator=request.user, is_private=is_private
        )

        LeagueMember.objects.create(league=league, user=request.user)

        # ── Logros de liga ───────────────────────────────────────────────────
        check_achievements(request.user, trigger="league_created")
        # ── Fin logros ───────────────────────────────────────────────────────

        serializer = FantasyLeagueSerializer(league, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def join(self, request):
        code = request.data.get("invite_code", "").upper()
        league_id = request.data.get("league_id")

        league = None

        if code:
            try:
                league = FantasyLeague.objects.get(invite_code=code, is_private=True)
            except FantasyLeague.DoesNotExist:
                return Response({"error": "Código de invitación no válido"}, status=404)
        elif league_id:
            try:
                league = FantasyLeague.objects.get(pk=league_id, is_private=False)
            except FantasyLeague.DoesNotExist:
                return Response({"error": "Liga pública no encontrada"}, status=404)
        else:
            return Response(
                {"error": "Debes proporcionar invite_code o league_id"}, status=400
            )

        member, created = LeagueMember.objects.get_or_create(
            league=league, user=request.user
        )
        if not created:
            return Response({"error": "Ya eres miembro de esta liga"}, status=400)

        # ── Logros de liga ───────────────────────────────────────────────────
        check_achievements(request.user, trigger="league_joined")
        # ── Fin logros ───────────────────────────────────────────────────────

        serializer = FantasyLeagueSerializer(league, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def leaderboard(self, request, pk=None):
        league = self.get_object()
        members = LeagueMember.objects.filter(league=league).select_related("user")

        data = sorted(
            [
                {
                    "username": m.user.display_name,
                    "avatar": m.user.avatar_url,
                    "points": m.points,
                }
                for m in members
            ],
            key=lambda x: x["points"],
            reverse=True,
        )

        for i, d in enumerate(data):
            d["rank"] = i + 1

        return Response(data)


class LeaguePreviewView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        invite_code = request.query_params.get("invite_code", "")
        if not invite_code:
            return Response({"error": "invite_code es requerido"}, status=400)

        invite_code = invite_code.upper()
        league = get_object_or_404(FantasyLeague, invite_code=invite_code)

        return Response(
            {
                "id": league.id,
                "name": league.name,
                "member_count": league.members.count(),
                "is_private": league.is_private,
            }
        )

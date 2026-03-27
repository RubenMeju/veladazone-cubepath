from rest_framework import viewsets, status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import permission_classes

from .models import FantasyLeague, LeagueMember
from .serializers import FantasyLeagueSerializer


class FantasyLeagueViewSet(viewsets.ModelViewSet):
    serializer_class = FantasyLeagueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Devuelve ligas donde el usuario es miembro o ligas públicas.
        """
        user = self.request.user
        return FantasyLeague.objects.filter(
            Q(members=user) | Q(is_private=False)
        ).distinct()

    def create(self, request, *args, **kwargs):
        """
        Crear una liga. `is_private` por defecto es True si no se especifica.
        """
        # Convertir is_private a booleano si viene como string
        is_private = request.data.get("is_private", True)
        if isinstance(is_private, str):
            is_private = is_private.lower() in ["true", "1"]

        league = FantasyLeague.objects.create(
            name=request.data.get("name"), creator=request.user, is_private=is_private
        )

        # El creador siempre se une automáticamente
        LeagueMember.objects.create(league=league, user=request.user)

        serializer = FantasyLeagueSerializer(league, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def join(self, request):
        """
        Unirse a una liga:
        - Con invite_code → liga privada
        - Con league_id → liga pública
        """
        code = request.data.get("invite_code", "").upper()
        league_id = request.data.get("league_id")

        league = None

        if code:
            # Liga privada
            try:
                league = FantasyLeague.objects.get(invite_code=code, is_private=True)
            except FantasyLeague.DoesNotExist:
                return Response({"error": "Código de invitación no válido"}, status=404)
        elif league_id:
            # Liga pública
            try:
                league = FantasyLeague.objects.get(pk=league_id, is_private=False)
            except FantasyLeague.DoesNotExist:
                return Response({"error": "Liga pública no encontrada"}, status=404)
        else:
            return Response(
                {"error": "Debes proporcionar invite_code o league_id"}, status=400
            )

        # Crear miembro si no existe
        member, created = LeagueMember.objects.get_or_create(
            league=league, user=request.user
        )
        if not created:
            return Response({"error": "Ya eres miembro de esta liga"}, status=400)

        serializer = FantasyLeagueSerializer(league, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def leaderboard(self, request, pk=None):
        """
        Devuelve el ranking de miembros de la liga por puntos.
        """
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

        # Añadir ranking
        for i, d in enumerate(data):
            d["rank"] = i + 1

        return Response(data)


@permission_classes([AllowAny])
class LeaguePreviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        invite_code = request.query_params.get("invite_code")
        league = get_object_or_404(FantasyLeague, invite_code=invite_code)
        return Response(
            {
                "id": league.id,
                "name": league.name,
                "member_count": league.members.count(),
                "is_private": league.is_private,
            }
        )

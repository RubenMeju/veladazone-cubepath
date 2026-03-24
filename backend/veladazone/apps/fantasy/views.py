from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import FantasyLeague, LeagueMember
from .serializers import FantasyLeagueSerializer


class FantasyLeagueViewSet(viewsets.ModelViewSet):
    serializer_class = FantasyLeagueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FantasyLeague.objects.filter(members=self.request.user)

    def create(self, request, *args, **kwargs):
        league = FantasyLeague.objects.create(
            name=request.data.get("name"), creator=request.user
        )
        LeagueMember.objects.create(league=league, user=request.user)
        return Response(
            FantasyLeagueSerializer(league).data, status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["post"])
    def join(self, request):
        code = request.data.get("invite_code", "").upper()
        try:
            league = FantasyLeague.objects.get(invite_code=code)
        except FantasyLeague.DoesNotExist:
            return Response(
                {"error": "Código de invitación no válido"},
                status=status.HTTP_404_NOT_FOUND,
            )

        _, created = LeagueMember.objects.get_or_create(
            league=league, user=request.user
        )
        if not created:
            return Response(
                {"error": "Ya eres miembro de esta liga"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(FantasyLeagueSerializer(league).data)

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

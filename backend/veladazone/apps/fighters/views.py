from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
import requests
from django.conf import settings
from django.db import models
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Fighter, Edition, Fight
from .serializers import FighterSerializer, EditionSerializer, FightSerializer


class FighterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fighter.objects.all()
    serializer_class = FighterSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        edition = self.request.query_params.get("edition")  # type: ignore
        if edition:
            qs = qs.filter(
                models.Q(fights_as_fighter1__edition__number=edition)
                | models.Q(fights_as_fighter2__edition__number=edition)
            ).distinct()
        return qs


class EditionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Edition.objects.prefetch_related(
        "fights__fighter1", "fights__fighter2", "fights__winner"
    ).all()
    serializer_class = EditionSerializer
    permission_classes = [AllowAny]
    lookup_field = "number"


class FightViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fight.objects.select_related(
        "fighter1", "fighter2", "winner", "edition"
    ).all()
    serializer_class = FightSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        edition = self.request.query_params.get("edition")
        if edition:
            qs = qs.filter(edition__number=edition)
        return qs


@api_view(["GET"])
@permission_classes([AllowAny])
def fighter_ai_analysis(request, fighter_id):
    try:
        fighter = Fighter.objects.get(id=fighter_id)
    except Fighter.DoesNotExist:
        return Response({"error": "Luchador no encontrado"}, status=404)

    wins = fighter.record.get("wins", 0)
    losses = fighter.record.get("losses", 0)

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
                        f"Analiza al luchador {fighter.name} de {fighter.country}. "
                        f"Tiene {wins} victorias y {losses} derrotas en La Velada. "
                        f"{'Su bio: ' + fighter.bio if fighter.bio else ''} "
                        f"Genera un análisis épico y dramático en español de máximo 3 líneas. "
                        f"Habla de su estilo, sus fortalezas y su legado en La Velada. Sin emojis."
                    ),
                }
            ],
            "max_tokens": 200,
            "temperature": 0.85,
        }
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        data = response.json()
        analysis = data["choices"][0]["message"]["content"].strip()
    except Exception:
        analysis = f"{fighter.name} es una leyenda de La Velada cuya historia aún está siendo escrita."

    return Response({"analysis": analysis})

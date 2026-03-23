from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
import requests
from django.conf import settings
from django.db import models
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Fighter, Edition, Fight
from .serializers import FighterSerializer, EditionSerializer, FightSerializer
from django.core.cache import cache
from django_ratelimit.decorators import ratelimit


def get_or_generate(cache_key: str, generator_fn, timeout: int = 60 * 60 * 24):
    """Intenta obtener de caché, si no existe genera y guarda."""
    cached = cache.get(cache_key)
    if cached:
        return cached
    result = generator_fn()
    cache.set(cache_key, result, timeout)
    return result


class FighterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fighter.objects.all()
    serializer_class = FighterSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        edition = self.request.query_params.get("edition")
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
@ratelimit(key="ip", rate="10/m", method="GET", block=True)
def fighter_ai_analysis(request, fighter_id):
    try:
        fighter = Fighter.objects.get(id=fighter_id)
    except Fighter.DoesNotExist:
        return Response({"error": "Luchador no encontrado"}, status=404)

    cache_key = f"fighter_analysis_{fighter_id}"

    def generate():
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
            return data["choices"][0]["message"]["content"].strip()
        except Exception:
            return f"{fighter.name} es una leyenda de La Velada cuya historia aún está siendo escrita."

    analysis = get_or_generate(cache_key, generate)
    return Response({"analysis": analysis})


@api_view(["GET"])
@permission_classes([AllowAny])
@ratelimit(key="ip", rate="10/m", method="GET", block=True)
def fight_ai_prediction(request, fight_id):
    try:
        fight = Fight.objects.select_related("fighter1", "fighter2", "edition").get(
            id=fight_id
        )
    except Fight.DoesNotExist:
        return Response({"error": "Combate no encontrado"}, status=404)

    cache_key = f"fight_prediction_{fight_id}"

    def generate():
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
                            f"Eres un experto analista de La Velada del Año {fight.edition.number}. "
                            f"Analiza el combate entre {fight.fighter1.name} ({fight.fighter1.country}) "
                            f"y {fight.fighter2.name} ({fight.fighter2.country}). "
                            f"Da tu predicción de quién ganará y por qué en máximo 2 líneas épicas en español. "
                            f"Formato: empieza con el nombre del ganador predicho seguido de dos puntos y tu argumento. "
                            f"Sin emojis. Solo análisis épico."
                        ),
                    }
                ],
                "max_tokens": 150,
                "temperature": 0.75,
            }
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            data = response.json()
            prediction_text = data["choices"][0]["message"]["content"].strip()

            fighter1_name = fight.fighter1.name.lower()
            fighter2_name = fight.fighter2.name.lower()
            predicted_fighter = None
            if fighter1_name in prediction_text.lower()[:50]:
                predicted_fighter = {
                    "id": fight.fighter1.id,
                    "name": fight.fighter1.name,
                    "flag": fight.fighter1.country_flag,
                }
            elif fighter2_name in prediction_text.lower()[:50]:
                predicted_fighter = {
                    "id": fight.fighter2.id,
                    "name": fight.fighter2.name,
                    "flag": fight.fighter2.country_flag,
                }

            return {
                "prediction": prediction_text,
                "predicted_fighter": predicted_fighter,
            }
        except Exception:
            return {
                "prediction": "La IA no se atreve a predecir este combate. ¡Demasiado épico!",
                "predicted_fighter": None,
            }

    result = get_or_generate(cache_key, generate)
    return Response(result)


@api_view(["GET"])
@permission_classes([AllowAny])
@ratelimit(key="ip", rate="10/m", method="GET", block=True)
def edition_ai_summary(request, edition_number):
    try:
        edition = Edition.objects.prefetch_related(
            "fights__fighter1", "fights__fighter2", "fights__winner"
        ).get(number=edition_number)
    except Edition.DoesNotExist:
        return Response({"error": "Edición no encontrada"}, status=404)

    cache_key = f"edition_summary_{edition_number}"

    def generate():
        fights_info = []
        for fight in edition.fights.all():
            if fight.winner:
                fights_info.append(
                    f"{fight.winner.name} venció a "
                    f"{''.join([fight.fighter1.name if fight.winner == fight.fighter2 else fight.fighter2.name])}"
                    f"{' (' + fight.result_method + ')' if fight.result_method else ''}"
                )
        fights_text = ", ".join(fights_info) if fights_info else "combates pendientes"

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
                            f"Eres un narrador épico de La Velada del Año. "
                            f"Narra la Velada del Año {edition_number} celebrada en {edition.year} "
                            f"en {edition.venue or 'recinto desconocido'}, {edition.city or 'España'}. "
                            f"Resultados: {fights_text}. "
                            f"Genera un resumen épico y dramático en español de máximo 4 líneas "
                            f"como si fuera la intro de un documental de boxeo. "
                            f"Menciona el año y el lugar. Sin emojis. Solo narrativa épica."
                        ),
                    }
                ],
                "max_tokens": 250,
                "temperature": 0.85,
            }
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
        except Exception:
            return f"La Velada del Año {edition_number} pasó a la historia como una noche inolvidable."

    summary = get_or_generate(cache_key, generate)
    return Response({"summary": summary})

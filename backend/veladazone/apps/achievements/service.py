"""
achievements/service.py
────────────────────────────────────────────────────────────────
Servicio centralizado para evaluar y otorgar logros.

Uso desde cualquier view:
    from veladazone.apps.achievements.service import check_achievements
    new = check_achievements(user, trigger="prediction_created")
    # new → lista de Achievement recién desbloqueados (para mostrar en UI)
────────────────────────────────────────────────────────────────
"""

from __future__ import annotations
from typing import TYPE_CHECKING

from django.db.models import Count, Q

from .models import Achievement, UserAchievement

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractBaseUser


# ── Triggers disponibles ──────────────────────────────────────────────────────
#
#  prediction_created   → cuando el usuario hace o actualiza una predicción
#  predictions_complete → cuando el usuario completa las 10 predicciones
#  argument_created     → cuando publica un argumento
#  argument_voted       → cuando alguien vota su argumento
#  league_created       → cuando crea una Fantasy League
#  league_joined        → cuando se une a una Fantasy League
#  profile_visited      → cuando su perfil recibe visitas (pasar profile_views)
#  login                → primer login / registro
#
# ─────────────────────────────────────────────────────────────────────────────


def _already_has(user, slug: str) -> bool:
    return UserAchievement.objects.filter(user=user, achievement__slug=slug).exists()


def _award(user, slug: str) -> Achievement | None:
    """Otorga el logro si existe y el usuario no lo tiene ya. Devuelve el Achievement o None."""
    if _already_has(user, slug):
        return None
    try:
        achievement = Achievement.objects.get(slug=slug)
    except Achievement.DoesNotExist:
        return None
    UserAchievement.objects.create(user=user, achievement=achievement)
    return achievement


def check_achievements(user, trigger: str, **ctx) -> list[Achievement]:
    """
    Evalúa qué logros deben desbloquearse para `user` dado el `trigger`.
    Devuelve la lista de logros recién desbloqueados (puede estar vacía).
    """
    new: list[Achievement] = []

    # ── Lazy imports para evitar circulares ──────────────────────────────────
    from veladazone.apps.predictions.models import Prediction, Argument
    from veladazone.apps.fantasy.models import FantasyLeague

    # ════════════════════════════════════════════════════════════════════════
    #  LOGIN / REGISTRO
    # ════════════════════════════════════════════════════════════════════════
    if trigger == "login":
        if a := _award(user, "primer-login"):
            new.append(a)

        # Early adopter: primeros 200 usuarios registrados
        from django.contrib.auth import get_user_model

        User = get_user_model()
        if User.objects.filter(date_joined__lte=user.date_joined).count() <= 200:
            if a := _award(user, "early-adopter"):
                new.append(a)

    # ════════════════════════════════════════════════════════════════════════
    #  PREDICCIONES
    # ════════════════════════════════════════════════════════════════════════
    if trigger in ("prediction_created", "predictions_complete"):
        predictions = Prediction.objects.filter(user=user)
        total = predictions.count()
        correct = predictions.filter(is_correct=True).count()
        betrayals = sum(p.betrayal_count for p in predictions)
        edition_preds = predictions.filter(fight__edition__number=6)

        # Primera predicción
        if total >= 1:
            if a := _award(user, "primera-prediccion"):
                new.append(a)

        # Cartel completo (10 predicciones en la edición actual)
        if edition_preds.count() >= 10:
            if a := _award(user, "cartel-completo"):
                new.append(a)

        # Precisión perfecta: 10/10 correctas
        if total >= 10 and correct == total:
            if a := _award(user, "precision-perfecta"):
                new.append(a)

        # Oráculo: 8+ correctas con 80%+ accuracy
        if total > 0 and correct >= 8 and (correct / total) >= 0.8:
            if a := _award(user, "oraculo"):
                new.append(a)

        # Leal: cartel completo sin traiciones
        if edition_preds.count() >= 10 and betrayals == 0:
            if a := _award(user, "leal"):
                new.append(a)

        # Traidor: 5+ traiciones acumuladas
        if betrayals >= 5:
            if a := _award(user, "traidor"):
                new.append(a)

        # Gran traidor: 10+ traiciones
        if betrayals >= 10:
            if a := _award(user, "gran-traidor"):
                new.append(a)

    # ════════════════════════════════════════════════════════════════════════
    #  DEBATE / ARGUMENTOS
    # ════════════════════════════════════════════════════════════════════════
    if trigger == "argument_created":
        arg_count = Argument.objects.filter(user=user).count()

        if arg_count >= 1:
            if a := _award(user, "primer-argumento"):
                new.append(a)

        if arg_count >= 5:
            if a := _award(user, "debatidor"):
                new.append(a)

        if arg_count >= 20:
            if a := _award(user, "veterano-del-ring"):
                new.append(a)

    if trigger == "argument_voted":
        # ctx["total_votes"] → votos totales acumulados en todos sus argumentos
        from django.db.models import Sum

        total_votes = (
            Argument.objects.filter(user=user).aggregate(total=Count("argument_votes"))[
                "total"
            ]
            or 0
        )
        # ctx puede traer el argumento específico para comprobar votos en uno solo
        argument = ctx.get("argument")
        if argument:
            single_votes = argument.argument_votes.count()
            if single_votes >= 10:
                if a := _award(user, "argumento-viral"):
                    new.append(a)

        if total_votes >= 1:
            if a := _award(user, "primer-voto-recibido"):
                new.append(a)

        if total_votes >= 50:
            if a := _award(user, "influencer"):
                new.append(a)

    # ════════════════════════════════════════════════════════════════════════
    #  FANTASY LEAGUES
    # ════════════════════════════════════════════════════════════════════════
    if trigger == "league_created":
        if a := _award(user, "creador-de-liga"):
            new.append(a)

        leagues_created = FantasyLeague.objects.filter(creator=user).count()
        if leagues_created >= 3:
            if a := _award(user, "comisionado"):
                new.append(a)

    if trigger == "league_joined":
        if a := _award(user, "espiritu-de-equipo"):
            new.append(a)

        total_leagues = (
            FantasyLeague.objects.filter(members=user).count()
            + FantasyLeague.objects.filter(creator=user).count()
        )
        if total_leagues >= 3:
            if a := _award(user, "multijugador"):
                new.append(a)

    # ════════════════════════════════════════════════════════════════════════
    #  PERFIL
    # ════════════════════════════════════════════════════════════════════════
    if trigger == "profile_visited":
        views = ctx.get("profile_views", 0)
        if views >= 10:
            if a := _award(user, "en-el-mapa"):
                new.append(a)
        if views >= 100:
            if a := _award(user, "celebridad"):
                new.append(a)
        if views >= 500:
            if a := _award(user, "leyenda"):
                new.append(a)

    return new

"""
achievements/service.py  — v2 con 50 logros
"""

from __future__ import annotations
from typing import TYPE_CHECKING

from .models import Achievement, UserAchievement

if TYPE_CHECKING:
    pass


def _already_has(user, slug: str) -> bool:
    return UserAchievement.objects.filter(user=user, achievement__slug=slug).exists()


def _award(user, slug: str) -> Achievement | None:
    if _already_has(user, slug):
        return None
    try:
        achievement = Achievement.objects.get(slug=slug)
    except Achievement.DoesNotExist:
        return None
    UserAchievement.objects.create(user=user, achievement=achievement)
    return achievement


def check_achievements(user, trigger: str, **ctx) -> list[Achievement]:
    new: list[Achievement] = []

    from veladazone.apps.predictions.models import Prediction, Argument
    from veladazone.apps.fantasy.models import FantasyLeague

    # ── LOGIN ─────────────────────────────────────────────────────────────────
    if trigger == "login":
        if a := _award(user, "primer-login"):
            new.append(a)

        from django.contrib.auth import get_user_model

        User = get_user_model()
        if User.objects.filter(date_joined__lte=user.date_joined).count() <= 200:
            if a := _award(user, "early-adopter"):
                new.append(a)

        # Veterano V edición — registrado antes de una fecha concreta
        from django.utils import timezone
        import datetime

        velada_vi_start = timezone.make_aware(datetime.datetime(2025, 6, 1))
        if user.date_joined < velada_vi_start:
            if a := _award(user, "veterano-v5"):
                new.append(a)

    # ── PREDICCIONES ──────────────────────────────────────────────────────────
    if trigger in ("prediction_created", "predictions_complete"):
        predictions = Prediction.objects.filter(user=user)
        total = predictions.count()
        correct = predictions.filter(is_correct=True).count()
        betrayals = sum(p.betrayal_count for p in predictions)
        edition_preds = predictions.filter(fight__edition__number=6)
        edition_count = edition_preds.count()

        if total >= 1:
            if a := _award(user, "primera-prediccion"):
                new.append(a)

        if edition_count >= 5:
            if a := _award(user, "cinco-predicciones"):
                new.append(a)

        if edition_count >= 10:
            if a := _award(user, "cartel-completo"):
                new.append(a)

        if correct >= 1:
            if a := _award(user, "primera-victoria"):
                new.append(a)

        if correct >= 5:
            if a := _award(user, "adivinador-serie"):
                new.append(a)

        if total >= 10 and correct == total:
            if a := _award(user, "precision-perfecta"):
                new.append(a)

        if total > 0 and correct >= 8 and (correct / total) >= 0.8:
            if a := _award(user, "oraculo"):
                new.append(a)

        if edition_count >= 10 and betrayals == 0:
            if a := _award(user, "leal"):
                new.append(a)

        if betrayals >= 5:
            if a := _award(user, "traidor"):
                new.append(a)

        if betrayals >= 10:
            if a := _award(user, "gran-traidor"):
                new.append(a)

        # Underdog hunter: acertó 3+ predicciones donde votó contra la mayoría
        if trigger == "predictions_complete":
            underdog_correct = _count_underdog_correct(user, predictions)
            if underdog_correct >= 3:
                if a := _award(user, "underdog-hunter"):
                    new.append(a)

            # Vox Populi: siempre votó con la mayoría
            community_picks, _ = _count_community_vs_underdog(user, predictions)
            if total > 0 and community_picks == total:
                if a := _award(user, "con-la-comunidad"):
                    new.append(a)

        # Racha de 3 consecutivas correctas
        if _has_streak(predictions, 3):
            if a := _award(user, "racha-3"):
                new.append(a)

    # ── ARGUMENTO CREADO ──────────────────────────────────────────────────────
    if trigger == "argument_created":
        arg_count = Argument.objects.filter(user=user).count()

        if arg_count >= 1:
            if a := _award(user, "primer-argumento"):
                new.append(a)
        if arg_count >= 5:
            if a := _award(user, "debatidor"):
                new.append(a)
        if arg_count >= 10:
            if a := _award(user, "diez-argumentos"):
                new.append(a)
        if arg_count >= 20:
            if a := _award(user, "veterano-del-ring"):
                new.append(a)

    # ── REPLY CREADO ──────────────────────────────────────────────────────────
    if trigger == "reply_created":
        if a := _award(user, "primera-replica"):
            new.append(a)

    # ── VOTO RECIBIDO ─────────────────────────────────────────────────────────
    if trigger == "argument_voted":
        from django.db.models import Count

        total_votes = (
            Argument.objects.filter(user=user).aggregate(total=Count("argument_votes"))[
                "total"
            ]
            or 0
        )
        argument = ctx.get("argument")

        if total_votes >= 1:
            if a := _award(user, "primer-voto-recibido"):
                new.append(a)
        if total_votes >= 20:
            if a := _award(user, "veinte-votos"):
                new.append(a)
        if total_votes >= 50:
            if a := _award(user, "influencer"):
                new.append(a)
        if total_votes >= 100:
            if a := _award(user, "cien-votos"):
                new.append(a)

        if argument:
            single_votes = argument.argument_votes.count()
            if single_votes >= 10:
                if a := _award(user, "argumento-viral"):
                    new.append(a)

    # ── LIGAS ─────────────────────────────────────────────────────────────────
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

    # ── PERFIL VISITADO ───────────────────────────────────────────────────────
    if trigger == "profile_visited":
        views = ctx.get("profile_views", 0)
        if views >= 10:
            if a := _award(user, "en-el-mapa"):
                new.append(a)
        if views >= 50:
            if a := _award(user, "cincuenta-visitas"):
                new.append(a)
        if views >= 100:
            if a := _award(user, "celebridad"):
                new.append(a)
        if views >= 200:
            if a := _award(user, "doscientas-visitas"):
                new.append(a)
        if views >= 500:
            if a := _award(user, "leyenda"):
                new.append(a)

    # ── DNA GENERADO ──────────────────────────────────────────────────────────
    if trigger == "dna_generated":
        if a := _award(user, "dna-generado"):
            new.append(a)

    # ── CARTEL COMPARTIDO ─────────────────────────────────────────────────────
    if trigger == "cartel_shared":
        if a := _award(user, "cartel-compartido"):
            new.append(a)

    # ── LOGROS META (se evalúan tras cualquier trigger) ───────────────────────
    new += _check_meta_achievements(user)

    return new


# ── Helpers ───────────────────────────────────────────────────────────────────


def _has_streak(predictions, n: int) -> bool:
    """¿Hay N predicciones correctas consecutivas ordenadas por fecha?"""
    ordered = list(
        predictions.order_by("created_at").values_list("is_correct", flat=True)
    )
    streak = 0
    for is_correct in ordered:
        streak = streak + 1 if is_correct else 0
        if streak >= n:
            return True
    return False


def _count_community_vs_underdog(user, predictions):
    """Devuelve (community_picks, underdog_picks) para el usuario."""
    from veladazone.apps.predictions.models import Prediction as P

    community = underdog = 0
    for pred in predictions:
        f1 = P.objects.filter(
            fight=pred.fight, predicted_winner=pred.fight.fighter1
        ).count()
        f2 = P.objects.filter(
            fight=pred.fight, predicted_winner=pred.fight.fighter2
        ).count()
        total = f1 + f2
        if total == 0:
            continue
        picked = f1 if pred.predicted_winner == pred.fight.fighter1 else f2
        if (picked / total) >= 0.5:
            community += 1
        else:
            underdog += 1
    return community, underdog


def _count_underdog_correct(user, predictions):
    """Cuántas veces acertó apostando contra la mayoría."""
    from veladazone.apps.predictions.models import Prediction as P

    count = 0
    for pred in predictions.filter(is_correct=True):
        f1 = P.objects.filter(
            fight=pred.fight, predicted_winner=pred.fight.fighter1
        ).count()
        f2 = P.objects.filter(
            fight=pred.fight, predicted_winner=pred.fight.fighter2
        ).count()
        total = f1 + f2
        if total == 0:
            continue
        picked = f1 if pred.predicted_winner == pred.fight.fighter1 else f2
        if (picked / total) < 0.5:
            count += 1
    return count


def _check_meta_achievements(user) -> list[Achievement]:
    """Logros que dependen de otros logros (meta-logros)."""
    from veladazone.apps.achievements.models import UserAchievement

    new = []

    unlocked = UserAchievement.objects.filter(user=user).select_related("achievement")
    unlocked_slugs = {ua.achievement.slug for ua in unlocked}
    total_points = sum(ua.achievement.points for ua in unlocked)
    unlocked_count = len(unlocked_slugs)

    categories_with_achievements = {ua.achievement.category for ua in unlocked}
    all_categories = {"predicciones", "debate", "social", "ligas", "especial"}

    # Todoterreno: logro en cada categoría
    if all_categories.issubset(categories_with_achievements):
        if a := _award(user, "todo-en-uno"):
            new.append(a)

    # Triple dígito: 100 puntos
    if total_points >= 100:
        if a := _award(user, "cien-puntos"):
            new.append(a)

    # Coleccionista: 20 logros
    if unlocked_count >= 20:
        if a := _award(user, "coleccionista"):
            new.append(a)

    # Leyenda total: 40 logros
    if unlocked_count >= 40:
        if a := _award(user, "leyenda-total"):
            new.append(a)

    return new

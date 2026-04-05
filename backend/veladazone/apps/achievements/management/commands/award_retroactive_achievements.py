"""
management/commands/award_retroactive_achievements.py

Evalúa todos los usuarios existentes y otorga los logros que merecen
según su actividad actual. Idempotente — no duplica logros.

Uso:
    python manage.py award_retroactive_achievements
    python manage.py award_retroactive_achievements --dry-run
    python manage.py award_retroactive_achievements --username rubius
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db.models import Count, Q


class Command(BaseCommand):
    help = "Otorga logros retroactivos a todos los usuarios según su actividad actual."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Muestra qué lograría cada usuario sin guardar nada.",
        )
        parser.add_argument(
            "--username",
            type=str,
            help="Ejecuta solo para un usuario concreto (twitch_username).",
        )

    def handle(self, *args, **options):
        from veladazone.apps.achievements.service import check_achievements
        from veladazone.apps.achievements.models import UserAchievement
        from veladazone.apps.predictions.models import Prediction, Argument
        from veladazone.apps.fantasy.models import FantasyLeague

        User = get_user_model()
        dry_run = options["dry_run"]
        username_filter = options.get("username")

        if dry_run:
            self.stdout.write(self.style.WARNING("── DRY RUN — no se guardará nada ──"))

        qs = User.objects.all()
        if username_filter:
            qs = qs.filter(twitch_username__iexact=username_filter)

        total_users = qs.count()
        total_awarded = 0

        for user in qs.iterator():
            before = set(
                UserAchievement.objects.filter(user=user).values_list(
                    "achievement__slug", flat=True
                )
            )

            if not dry_run:
                # Dispara todos los triggers relevantes
                check_achievements(user, trigger="login")
                check_achievements(user, trigger="prediction_created")
                check_achievements(user, trigger="predictions_complete")
                check_achievements(user, trigger="argument_created")

                # Votos recibidos en argumentos
                from veladazone.apps.predictions.models import Argument as Arg

                for arg in Arg.objects.filter(user=user).prefetch_related(
                    "argument_votes"
                ):
                    if arg.argument_votes.exists():
                        check_achievements(user, trigger="argument_voted", argument=arg)

                check_achievements(user, trigger="league_created")
                check_achievements(user, trigger="league_joined")
                check_achievements(
                    user,
                    trigger="profile_visited",
                    profile_views=getattr(user, "profile_views", 0) or 0,
                )

                after = set(
                    UserAchievement.objects.filter(user=user).values_list(
                        "achievement__slug", flat=True
                    )
                )
                new_slugs = after - before
            else:
                # En dry-run simulamos contando manualmente
                new_slugs = self._simulate(user)

            if new_slugs:
                total_awarded += len(new_slugs)
                name = getattr(user, "twitch_username", None) or user.username
                self.stdout.write(
                    self.style.SUCCESS(
                        f"  {name}: +{len(new_slugs)} logros → {', '.join(new_slugs)}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ {total_users} usuarios procesados · {total_awarded} logros otorgados"
            )
        )

    def _simulate(self, user):
        """Versión dry-run: devuelve slugs que se otorgarían sin escribir en DB."""
        from veladazone.apps.achievements.models import Achievement, UserAchievement
        from veladazone.apps.predictions.models import Prediction, Argument
        from veladazone.apps.fantasy.models import FantasyLeague
        from django.db.models import Count, Q, Sum
        from django.contrib.auth import get_user_model

        already = set(
            UserAchievement.objects.filter(user=user).values_list(
                "achievement__slug", flat=True
            )
        )
        would_get = set()

        def maybe(slug):
            if slug not in already:
                would_get.add(slug)

        # Login
        maybe("primer-login")
        User = get_user_model()
        if User.objects.filter(date_joined__lte=user.date_joined).count() <= 200:
            maybe("early-adopter")

        # Predicciones
        preds = Prediction.objects.filter(user=user)
        total = preds.count()
        correct = preds.filter(is_correct=True).count()
        betrayals = sum(p.betrayal_count for p in preds)
        edition_preds = preds.filter(fight__edition__number=6).count()

        if total >= 1:
            maybe("primera-prediccion")
        if edition_preds >= 10:
            maybe("cartel-completo")
        if total >= 10 and correct == total:
            maybe("precision-perfecta")
        if total > 0 and correct >= 8 and (correct / total) >= 0.8:
            maybe("oraculo")
        if edition_preds >= 10 and betrayals == 0:
            maybe("leal")
        if betrayals >= 5:
            maybe("traidor")
        if betrayals >= 10:
            maybe("gran-traidor")

        # Argumentos
        args = Argument.objects.filter(user=user)
        arg_count = args.count()
        if arg_count >= 1:
            maybe("primer-argumento")
        if arg_count >= 5:
            maybe("debatidor")
        if arg_count >= 20:
            maybe("veterano-del-ring")

        total_votes = args.aggregate(t=Count("argument_votes"))["t"] or 0
        if total_votes >= 1:
            maybe("primer-voto-recibido")
        if total_votes >= 50:
            maybe("influencer")
        if args.annotate(vc=Count("argument_votes")).filter(vc__gte=10).exists():
            maybe("argumento-viral")

        # Ligas
        leagues_created = FantasyLeague.objects.filter(creator=user).count()
        if leagues_created >= 1:
            maybe("creador-de-liga")
        if leagues_created >= 3:
            maybe("comisionado")

        leagues_joined = (
            FantasyLeague.objects.filter(members=user).exclude(creator=user).count()
        )
        if leagues_joined >= 1:
            maybe("espiritu-de-equipo")
        if (leagues_created + leagues_joined) >= 3:
            maybe("multijugador")

        # Perfil
        views = getattr(user, "profile_views", 0) or 0
        if views >= 10:
            maybe("en-el-mapa")
        if views >= 100:
            maybe("celebridad")
        if views >= 500:
            maybe("leyenda")

        return would_get

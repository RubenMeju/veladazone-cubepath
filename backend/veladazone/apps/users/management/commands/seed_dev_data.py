import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from veladazone.apps.fighters.models import Fight
from veladazone.apps.predictions.models import (
    Prediction,
    Argument,
    ArgumentVote,
    ArgumentReply,
)
from veladazone.apps.fantasy.models import FantasyLeague, LeagueMember


class Command(BaseCommand):
    help = "Seed completo de datos fake para desarrollo"

    def add_arguments(self, parser):
        parser.add_argument("--users", type=int, default=100)

    def handle(self, *args, **kwargs):
        User = get_user_model()
        total_users = kwargs["users"]

        self.stdout.write("🚀 Generando usuarios...")
        users = []

        for i in range(total_users):
            username = f"user_{i}"

            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@test.com",
                    "twitch_username": username,
                    "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
                },
            )

            users.append(user)

        fights = Fight.objects.filter(edition__number=6)

        self.stdout.write("🥊 Generando predicciones...")

        for user in users:
            for fight in fights:

                # 80% de usuarios participan
                if random.random() > 0.8:
                    continue

                # Sesgo realista (no 50/50)
                if random.random() < 0.6:
                    winner = fight.fighter1
                else:
                    winner = fight.fighter2

                prediction, _ = Prediction.objects.update_or_create(
                    user=user,
                    fight=fight,
                    defaults={
                        "predicted_winner": winner,
                    },
                )

                # 🗡️ Simular traición (cambio de pick)
                if random.random() < 0.2:
                    new_winner = (
                        fight.fighter2
                        if winner == fight.fighter1
                        else fight.fighter1
                    )

                    prediction.previous_winner = winner
                    prediction.predicted_winner = new_winner
                    prediction.betrayal_count = 1
                    prediction.save()

        self.stdout.write("💬 Generando argumentos...")

        sample_texts = [
            "Va a ganar fácil.",
            "Tiene mejor cardio.",
            "Es superior técnicamente.",
            "Confío en su experiencia.",
            "Este combate es suyo.",
        ]

        arguments = []

        for user in users[:50]:  # solo algunos usuarios comentan
            for fight in fights:

                if random.random() > 0.5:
                    continue

                fighter = random.choice([fight.fighter1, fight.fighter2])

                arg = Argument.objects.create(
                    user=user,
                    fight=fight,
                    fighter_supported=fighter,
                    text=random.choice(sample_texts),
                )

                arguments.append(arg)

        self.stdout.write("👍 Generando votos...")

        for user in users:
            for arg in random.sample(arguments, min(len(arguments), 20)):
                if random.random() < 0.3:
                    ArgumentVote.objects.get_or_create(user=user, argument=arg)

        self.stdout.write("💬 Generando replies...")

        for arg in arguments[:30]:
            for _ in range(random.randint(1, 3)):
                ArgumentReply.objects.create(
                    user=random.choice(users),
                    argument=arg,
                    text="No estoy de acuerdo 😂",
                )

        self.stdout.write("🏆 Generando ligas fantasy...")

        for i in range(5):
            creator = random.choice(users)

            league = FantasyLeague.objects.create(
                name=f"Liga_{i}",
                creator=creator,
            )

            members = random.sample(users, 10)

            for user in members:
                LeagueMember.objects.get_or_create(
                    league=league,
                    user=user,
                )

        self.stdout.write(self.style.SUCCESS("✅ SEED COMPLETADO"))
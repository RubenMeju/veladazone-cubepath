from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Crea un usuario fake para desarrollo local"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username = "devuser"

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": "dev@local.com",
                "is_staff": True,
                "is_active": True,
                "twitch_username": "devuser",  # 👈 esto faltaba
            },
        )

        if not created and not user.twitch_username:
            # Actualiza si ya existía pero sin twitch_username
            user.twitch_username = "devuser"
            user.save()
            self.stdout.write(self.style.SUCCESS("✅ twitch_username actualizado"))

        if created:
            user.set_unusable_password()
            user.save()
            self.stdout.write(self.style.SUCCESS(f"✅ Usuario '{username}' creado"))
        else:
            self.stdout.write(self.style.WARNING(f"⚠️  Usuario '{username}' ya existía"))

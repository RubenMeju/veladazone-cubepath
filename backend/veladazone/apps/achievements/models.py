from django.db import models
from django.conf import settings


class Achievement(models.Model):
    """Catálogo de logros disponibles en la plataforma."""

    class Category(models.TextChoices):
        PREDICCIONES = "predicciones", "Predicciones"
        DEBATE = "debate", "Debate"
        SOCIAL = "social", "Social"
        LIGAS = "ligas", "Ligas Fantasy"
        ESPECIAL = "especial", "Especial"

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=80)
    description = models.CharField(max_length=200)
    emoji = models.CharField(max_length=8, default="🏅")
    category = models.CharField(max_length=20, choices=Category.choices)
    # Puntos que suma al score de logros del usuario (para el ranking de logros)
    points = models.PositiveSmallIntegerField(default=10)
    is_secret = models.BooleanField(default=False)  # oculto hasta desbloquearlo

    class Meta:
        ordering = ["category", "slug"]

    def __str__(self):
        return f"{self.emoji} {self.name}"


class UserAchievement(models.Model):
    """Relación entre usuario y logro desbloqueado."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="achievements",
    )
    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name="user_achievements",
    )
    unlocked_at = models.DateTimeField(auto_now_add=True)
    notified = models.BooleanField(default=False)  # para notificación in-app

    class Meta:
        unique_together = ("user", "achievement")
        ordering = ["-unlocked_at"]

    def __str__(self):
        return f"{self.user} → {self.achievement}"

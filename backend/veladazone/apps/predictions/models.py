from django.db import models
from django.conf import settings
from veladazone.apps.fighters.models import Fight, Fighter


class Prediction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="predictions"
    )
    fight = models.ForeignKey(
        Fight, on_delete=models.CASCADE, related_name="predictions"
    )
    predicted_winner = models.ForeignKey(Fighter, on_delete=models.CASCADE)
    previous_winner = models.ForeignKey(
        Fighter,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="betrayals_received",
    )
    ai_comment = models.TextField(null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
    betrayal_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "fight"]

    def __str__(self):
        return f"{self.user} predice {self.predicted_winner} en {self.fight}"

    def check_result(self):
        if self.fight.is_completed and self.fight.winner:
            self.is_correct = self.predicted_winner == self.fight.winner
            self.save()


## MODO DEBATE
class Argument(models.Model):
    """Comentario principal defendiendo a un luchador"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="arguments"
    )
    fight = models.ForeignKey(Fight, on_delete=models.CASCADE, related_name="arguments")
    fighter_supported = models.ForeignKey(
        Fighter, on_delete=models.CASCADE, related_name="arguments_supported"
    )
    text = models.TextField(max_length=600)  # más largo que 280
    edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]  # quitamos unique_together

    def __str__(self):
        return f"{self.user.username} en {self.fight}"


class ArgumentVote(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="argument_votes",
    )
    argument = models.ForeignKey(
        Argument, on_delete=models.CASCADE, related_name="argument_votes"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "argument"]

    def __str__(self):
        return f"{self.user} votó {self.argument}"


class ArgumentReply(models.Model):
    """Respuestas (soporta 1 o 2 niveles de anidación)"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="argument_replies",
    )
    # Respuesta a un comentario principal
    argument = models.ForeignKey(
        Argument,
        on_delete=models.CASCADE,
        related_name="replies",
        null=True,
        blank=True,
    )
    # Respuesta a otra respuesta (para hilos anidados)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="child_replies",
    )
    text = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Reply by {self.user} "

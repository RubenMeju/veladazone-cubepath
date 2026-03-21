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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="arguments"
    )
    fight = models.ForeignKey(Fight, on_delete=models.CASCADE, related_name="arguments")
    fighter_supported = models.ForeignKey(
        Fighter, on_delete=models.CASCADE, related_name="arguments"
    )
    text = models.CharField(max_length=280)
    edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "fight"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} defiende a {self.fighter_supported} en {self.fight}"

    @property
    def vote_count(self):
        return self.argument_votes.count()


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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="argument_replies",
    )
    argument = models.ForeignKey(
        Argument, on_delete=models.CASCADE, related_name="replies"
    )
    text = models.CharField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "argument"]
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.user} respondió a {self.argument}"

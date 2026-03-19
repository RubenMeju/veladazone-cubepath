from django.db import models
from django.conf import settings
from veladazone.apps.fighters.models import Fight, Fighter


class Prediction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='predictions')
    fight = models.ForeignKey(Fight, on_delete=models.CASCADE, related_name='predictions')
    predicted_winner = models.ForeignKey(Fighter, on_delete=models.CASCADE)
    ai_comment = models.TextField(null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'fight']

    def __str__(self):
        return f"{self.user} predice {self.predicted_winner} en {self.fight}"

    def check_result(self):
        if self.fight.is_completed and self.fight.winner:
            self.is_correct = self.predicted_winner == self.fight.winner
            self.save()

import string
import random
from django.db import models
from django.conf import settings
from veladazone.apps.fighters.models import Fight, Fighter


def generate_invite_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


class FantasyLeague(models.Model):
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_leagues')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='LeagueMember', related_name='leagues')
    invite_code = models.CharField(max_length=8, unique=True, default=generate_invite_code)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class LeagueMember(models.Model):
    league = models.ForeignKey(FantasyLeague, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['league', 'user']

    @property
    def points(self):
        from veladazone.apps.predictions.models import Prediction
        correct = Prediction.objects.filter(
            user=self.user,
            fight__edition__number=6,
            is_correct=True
        )
        total = 0
        for p in correct:
            total += 20 if p.fight.is_main_event else 10
        return total

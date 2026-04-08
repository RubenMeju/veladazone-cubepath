from django.db import models


class Fighter(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    country = models.CharField(max_length=100)
    country_flag = models.CharField(max_length=10, default='🏳️')
    avatar_url = models.URLField(null=True, blank=True)
    twitter = models.CharField(max_length=100, null=True, blank=True)
    twitch = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    channel_id = models.CharField(max_length=50, blank=True, default="")


    def __str__(self):
        return self.name

    @property
    def record(self):
        from django.db.models import Q
        wins = self.fights_won.count()
        losses = Fight.objects.filter(
            Q(fighter1=self) | Q(fighter2=self)
        ).filter(is_completed=True).exclude(winner=self).exclude(winner=None).count()
        return {'wins': wins, 'losses': losses}


class Edition(models.Model):
    number = models.IntegerField(unique=True)
    year = models.IntegerField()
    date = models.DateField(null=True, blank=True)
    venue = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f'Velada del Año {self.number}'

    class Meta:
        ordering = ['number']


class Fight(models.Model):
    edition = models.ForeignKey(Edition, on_delete=models.CASCADE, related_name='fights')
    fighter1 = models.ForeignKey(Fighter, on_delete=models.CASCADE, related_name='fights_as_fighter1')
    fighter2 = models.ForeignKey(Fighter, on_delete=models.CASCADE, related_name='fights_as_fighter2')
    winner = models.ForeignKey(Fighter, on_delete=models.SET_NULL, null=True, blank=True, related_name='fights_won')
    is_main_event = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    result_method = models.CharField(
        max_length=20,
        choices=[('ko', 'KO'), ('points', 'Puntos'), ('tko', 'TKO'), ('pending', 'Pendiente')],
        default='pending'
    )
    is_completed = models.BooleanField(default=False)
    youtube_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f'{self.fighter1} vs {self.fighter2} — Velada {self.edition.number}'

    class Meta:
        ordering = ['edition', '-is_main_event', 'order']

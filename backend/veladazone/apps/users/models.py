from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    twitch_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    twitch_username = models.CharField(max_length=100, null=True, blank=True)
    avatar_url = models.URLField(null=True, blank=True)
    profile_views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.twitch_username or self.username

    @property
    def display_name(self):
        return self.twitch_username or self.username

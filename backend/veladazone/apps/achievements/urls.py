# veladazone/apps/achievements/urls.py
from django.urls import path
from .views import (
    AchievementCatalogView,
    MyAchievementsView,
    UnreadAchievementsView,
    PublicAchievementsView,
    AchievementLeaderboardView,
)

urlpatterns = [
    path("", MyAchievementsView.as_view()),
    path("unread/", UnreadAchievementsView.as_view()),
    path("leaderboard/", AchievementLeaderboardView.as_view()),
    path("catalog/", AchievementCatalogView.as_view()),
    path("user/<str:username>/", PublicAchievementsView.as_view()),
]

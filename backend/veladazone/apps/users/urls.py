from django.urls import path
from .views import (
    DNAView,
    MeView,
    MyStatsView,
    TwitchCallbackView,
    LogoutView,
    TokenRefreshView,
    PublicProfileView,
)

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("me/stats/", MyStatsView.as_view(), name="my-stats"),
    path("me/dna/", DNAView.as_view(), name="my-dna"),
    path("twitch/callback/", TwitchCallbackView.as_view(), name="twitch-callback"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/<str:username>/", PublicProfileView.as_view(), name="public-profile"),
]

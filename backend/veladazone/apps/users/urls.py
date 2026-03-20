from django.urls import path
from .views import MeView, MyStatsView, TwitchCallbackView, LogoutView

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("me/stats/", MyStatsView.as_view(), name="my-stats"),
    path("twitch/callback/", TwitchCallbackView.as_view(), name="twitch-callback"),
    path("logout/", LogoutView.as_view(), name="logout"),
]

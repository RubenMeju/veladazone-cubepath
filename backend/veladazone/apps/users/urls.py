from django.urls import path
from .views import MeView, TwitchCallbackView, LogoutView

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("twitch/callback/", TwitchCallbackView.as_view(), name="twitch-callback"),
    path("logout/", LogoutView.as_view(), name="logout"),
]

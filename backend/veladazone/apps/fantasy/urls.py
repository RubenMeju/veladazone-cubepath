from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import FantasyLeagueViewSet, LeaguePreviewView

router = DefaultRouter()
router.register("leagues", FantasyLeagueViewSet, basename="league")

urlpatterns = router.urls + [
    path("leagues/preview/", LeaguePreviewView.as_view()),
]

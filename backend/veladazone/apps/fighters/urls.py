from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import FighterViewSet, EditionViewSet, FightViewSet, fighter_ai_analysis

router = DefaultRouter()
router.register("list", FighterViewSet, basename="fighter")
router.register("editions", EditionViewSet, basename="edition")
router.register("fights", FightViewSet, basename="fight")

urlpatterns = router.urls + [
    path("<int:fighter_id>/analysis/", fighter_ai_analysis, name="fighter-analysis"),
]

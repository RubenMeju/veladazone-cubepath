from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    FighterViewSet,
    EditionViewSet,
    FightViewSet,
    edition_ai_summary,
    fight_ai_prediction,
    fighter_ai_analysis,
)

router = DefaultRouter()
router.register("list", FighterViewSet, basename="fighter")
router.register("editions", EditionViewSet, basename="edition")
router.register("fights", FightViewSet, basename="fight")

urlpatterns = router.urls + [
    path("<int:fighter_id>/analysis/", fighter_ai_analysis, name="fighter-analysis"),
    path(
        "fights/<int:fight_id>/ai-prediction/",
        fight_ai_prediction,
        name="fight-ai-prediction",
    ),
    path(
        "editions/<int:edition_number>/summary/",
        edition_ai_summary,
        name="edition-summary",
    ),
]

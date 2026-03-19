from rest_framework.routers import DefaultRouter
from .views import FantasyLeagueViewSet

router = DefaultRouter()
router.register('leagues', FantasyLeagueViewSet, basename='league')

urlpatterns = router.urls

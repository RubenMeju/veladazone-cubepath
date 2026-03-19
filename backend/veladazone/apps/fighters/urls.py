from rest_framework.routers import DefaultRouter
from .views import FighterViewSet, EditionViewSet, FightViewSet

router = DefaultRouter()
router.register('list', FighterViewSet, basename='fighter')
router.register('editions', EditionViewSet, basename='edition')
router.register('fights', FightViewSet, basename='fight')

urlpatterns = router.urls

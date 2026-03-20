from rest_framework.routers import DefaultRouter
from .views import ArgumentViewSet, PredictionViewSet

router = DefaultRouter()
router.register("", PredictionViewSet, basename="prediction")
router.register("arguments", ArgumentViewSet, basename="argument")

urlpatterns = router.urls

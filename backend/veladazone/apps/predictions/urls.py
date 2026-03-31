from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CartelPublicoView, PredictionViewSet

router = DefaultRouter()
router.register("", PredictionViewSet, basename="prediction")

urlpatterns = router.urls
urlpatterns = [
    path("cartel/<str:username>/", CartelPublicoView.as_view(), name="cartel-publico"),
] + router.urls

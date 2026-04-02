from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartelPublicoView, PredictionViewSet

router = DefaultRouter()
router.register("", PredictionViewSet, basename="prediction")

urlpatterns = [
    path(
        "api/v1/predictions/arguments/",
        include("veladazone.apps.predictions.argument_urls"),
    ),
    path("cartel/<str:username>/", CartelPublicoView.as_view(), name="cartel-publico"),
] + router.urls

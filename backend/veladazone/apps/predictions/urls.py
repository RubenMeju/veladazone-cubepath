from rest_framework.routers import DefaultRouter
from .views import ArgumentViewSet, PredictionViewSet

prediction_router = DefaultRouter()
prediction_router.register("", PredictionViewSet, basename="prediction")

argument_router = DefaultRouter()
argument_router.register("arguments", ArgumentViewSet, basename="argument")

urlpatterns = prediction_router.urls + argument_router.urls

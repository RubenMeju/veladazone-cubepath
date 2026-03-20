from rest_framework.routers import DefaultRouter
from .views import ArgumentViewSet

router = DefaultRouter()
router.register("", ArgumentViewSet, basename="argument")

urlpatterns = router.urls

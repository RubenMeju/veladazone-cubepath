from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('social_django.urls', namespace='social')),
    path('api/v1/', include([
        path('users/', include('veladazone.apps.users.urls')),
        path('fighters/', include('veladazone.apps.fighters.urls')),
        path('predictions/', include('veladazone.apps.predictions.urls')),
        path('fantasy/', include('veladazone.apps.fantasy.urls')),
    ])),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

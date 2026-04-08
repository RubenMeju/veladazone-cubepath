from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from veladazone.apps.users.views import TokenRefreshView, TwitchCallbackView

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "auth/complete/twitch-callback/",
        TwitchCallbackView.as_view(),
        name="twitch-done",
    ),
    path("auth/", include("social_django.urls", namespace="social")),
    path(
        "api/v1/users/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"
    ),
    path(
        "api/v1/",
        include(
            [
                path("users/", include("veladazone.apps.users.urls")),
                path("fighters/", include("veladazone.apps.fighters.urls")),
                path(
                    "predictions/arguments/",
                    include("veladazone.apps.predictions.argument_urls"),
                ),
                path("predictions/", include("veladazone.apps.predictions.urls")),
                path("fantasy/", include("veladazone.apps.fantasy.urls")),
                path("blog/", include("veladazone.apps.blog.urls")),
            ]
        ),
    ),
    path("api/v1/achievements/", include("veladazone.apps.achievements.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.conf import settings
from django.contrib.auth import get_user_model


class DevAuthMiddleware:
    """
    Middleware que sobrescribe request.user en modo DEBUG
    usando 'x-dev-user' si existe.
    Debe ir **antes** de AuthenticationMiddleware.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.User = get_user_model()

    def __call__(self, request):
        if settings.DEBUG:
            dev_user = request.headers.get("x-dev-user")
            if dev_user:
                try:
                    request.user = self.User.objects.get(username=dev_user)
                except self.User.DoesNotExist:
                    request.user = None
        return self.get_response(request)

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import BaseAuthentication
from django.contrib.auth import get_user_model
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    """Read JWT from HttpOnly cookie instead of Authorization header."""

    def authenticate(self, request):
        token = request.COOKIES.get("access_token")
        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
            return self.get_user(validated_token), validated_token
        except Exception:
            return None


class DevHeaderAuthentication(BaseAuthentication):
    """
    Dev auth: detecta 'x-dev-user' en headers y lo usa como request.user.
    Solo para DEBUG=True.
    """
    def authenticate(self, request):
        from django.conf import settings
        if not settings.DEBUG:
            return None

        username = request.headers.get("x-dev-user")
        if not username:
            return None

        User = get_user_model()
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None

        # DRF espera (user, auth) tuple
        return (user, None)
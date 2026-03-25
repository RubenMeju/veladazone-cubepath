from social_django.middleware import SocialAuthExceptionMiddleware
from social_core.exceptions import AuthCanceled, AuthForbidden
from django.shortcuts import redirect
from django.conf import settings


class CustomSocialAuthExceptionMiddleware(SocialAuthExceptionMiddleware):
    def process_exception(self, request, exception):
        if isinstance(exception, (AuthCanceled, AuthForbidden)):
            # Redirige al login de nuevo en lugar de 500
            return redirect(f"{settings.FRONTEND_URL}/?error=auth_retry")
        return super().process_exception(request, exception)
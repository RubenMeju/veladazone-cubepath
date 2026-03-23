from django_ratelimit.exceptions import Ratelimited
from rest_framework.response import Response


def ratelimit_handler(request, exception):
    if isinstance(exception, Ratelimited):
        return Response(
            {"error": "Demasiadas peticiones. Espera un momento antes de continuar."},
            status=429,
        )
    raise exception

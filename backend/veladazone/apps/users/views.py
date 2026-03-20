from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.shortcuts import redirect
from django.conf import settings
from django.views import View
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class TwitchCallbackView(View):
    """After Twitch OAuth, set JWT in HttpOnly cookies and redirect to frontend."""

    def get(self, request):
        if request.user.is_authenticated:
            refresh = RefreshToken.for_user(request.user)
            frontend_url = settings.FRONTEND_URL

            response = redirect(f"{frontend_url}/auth/callback")

            # Set tokens in HttpOnly cookies
            response.set_cookie(
                "access_token",
                str(refresh.access_token),
                max_age=3600,
                httponly=True,
                secure=True,
                samesite="Lax",
            )
            response.set_cookie(
                "refresh_token",
                str(refresh),
                max_age=86400 * 7,
                httponly=True,
                secure=True,
                samesite="Lax",
            )
            return response

        return redirect(f"{settings.FRONTEND_URL}/?error=auth_failed")


class LogoutView(View):
    """Clear JWT cookies."""

    def get(self, request):
        response = redirect(settings.FRONTEND_URL)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response

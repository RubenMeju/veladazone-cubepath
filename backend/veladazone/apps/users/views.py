from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
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
    """After Twitch OAuth, generate JWT and redirect to frontend."""

    def get(self, request):
        if request.user.is_authenticated:
            refresh = RefreshToken.for_user(request.user)
            frontend_url = settings.FRONTEND_URL
            return redirect(
                f"{frontend_url}/auth/callback"
                f"?access={str(refresh.access_token)}"
                f"&refresh={str(refresh)}"
            )
        return redirect(f"{settings.FRONTEND_URL}/?error=auth_failed")

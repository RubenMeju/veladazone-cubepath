from django.conf import settings

def get_current_user(request):
    # 🟢 DEV MODE
    if settings.DEBUG:
        dev_user = request.headers.get("x-dev-user")
        if dev_user:
            return {
                "username": dev_user
            }

    # 🔵 PROD (tu lógica real con Twitch/session)
    if request.user.is_authenticated:
        return {
            "username": request.user.username
        }

    return None
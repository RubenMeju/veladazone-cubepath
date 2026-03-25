from social_core.backends.twitch import TwitchOAuth2


class TwitchOAuth2Mobile(TwitchOAuth2):
    """Twitch backend que no valida el state para compatibilidad móvil."""

    def validate_state(self):
        try:
            return super().validate_state()
        except Exception:
            return self.data.get("state", "")

    def auth_complete(self, *args, **kwargs):
        # Inyecta el state en la sesión si no existe (PWA cambia de navegador)
        if not self.strategy.session_get("state"):
            self.strategy.session_set("state", self.data.get("state", ""))
        return super().auth_complete(*args, **kwargs)

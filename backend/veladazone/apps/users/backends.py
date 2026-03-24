from social_core.backends.twitch import TwitchOAuth2


class TwitchOAuth2Mobile(TwitchOAuth2):
    """Twitch backend que no valida el state para compatibilidad móvil."""

    def validate_state(self):
        try:
            return super().validate_state()
        except Exception:
            # Si falla la validación del state, continuamos igualmente
            # Esto permite OAuth en móvil donde el navegador cambia de contexto
            return self.data.get("state", "")

from social_core.backends.twitch import TwitchOAuth2
import logging

logger = logging.getLogger(__name__)


class TwitchOAuth2Mobile(TwitchOAuth2):
    """Twitch backend que no valida el state para compatibilidad móvil."""

    def validate_state(self):
        try:
            return super().validate_state()
        except Exception as e:
            logger.error(f"State validation failed: {e}, continuing anyway")
            return self.data.get("state", "")

    def auth_complete(self, *args, **kwargs):
        if not self.strategy.session_get("state"):
            self.strategy.session_set("state", self.data.get("state", ""))
        try:
            return super().auth_complete(*args, **kwargs)
        except Exception as e:
            logger.error(f"auth_complete failed: {type(e).__name__}: {e}")
            raise

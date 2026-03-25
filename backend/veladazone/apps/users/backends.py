from social_core.backends.twitch import TwitchOAuth2
from social_core.exceptions import AuthCanceled
import logging

logger = logging.getLogger(__name__)


class TwitchOAuth2Mobile(TwitchOAuth2):
    """Twitch backend que no valida el state para compatibilidad móvil."""

    def validate_state(self):
        try:
            return super().validate_state()
        except Exception as e:
            logger.error(f"State validation failed: {e}")
            return self.data.get("state", "")

    def request_access_token(self, *args, **kwargs):
        try:
            result = super().request_access_token(*args, **kwargs)
            logger.error(f"Access token result: {result}")
            return result
        except Exception as e:
            logger.error(f"request_access_token failed: {type(e).__name__}: {e}")
            raise

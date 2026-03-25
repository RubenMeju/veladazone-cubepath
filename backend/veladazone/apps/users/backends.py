from social_core.backends.twitch import TwitchOAuth2
import logging

logger = logging.getLogger(__name__)


class TwitchOAuth2Mobile(TwitchOAuth2):
    """Twitch backend que no valida el state para compatibilidad móvil."""

    def auth_params(self, state=None):
        params = super().auth_params(state)
        request = getattr(self.strategy, "request", None)
        if request and request.GET.get("from_pwa"):
            current_state = params.get("state", "") or ""
            params["state"] = current_state + ":from_pwa"
        return params

    def validate_state(self):
        try:
            return super().validate_state()
        except Exception as e:
            logger.error(f"State validation failed: {e}")
            return self.data.get("state", "")

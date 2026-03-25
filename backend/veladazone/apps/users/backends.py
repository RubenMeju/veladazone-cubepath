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
            new_state = current_state + ":from_pwa"
            params["state"] = new_state
            self.strategy.session_set("state", new_state)
            logger.warning(f"from_pwa appended to state: {new_state}")
        return params

    def validate_state(self):
        try:
            return super().validate_state()
        except Exception as e:
            logger.error(f"State validation failed: {e}")
            # Inyecta el state en sesión y reintenta
            incoming_state = self.data.get("state", "")
            self.strategy.session_set("state", incoming_state)
            try:
                return super().validate_state()
            except Exception:
                return incoming_state

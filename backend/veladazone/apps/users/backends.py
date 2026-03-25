from social_core.backends.twitch import TwitchOAuth2
from social_core.backends.oauth import BaseOAuth2
import logging

logger = logging.getLogger(__name__)


class TwitchOAuth2Mobile(TwitchOAuth2):
    """Twitch backend sin validación de state para compatibilidad móvil."""

    def auth_params(self, state=None):
        params = super().auth_params(state)
        request = getattr(self.strategy, "request", None)
        if request and request.GET.get("from_pwa"):
            current_state = params.get("state", "") or ""
            new_state = current_state + ":from_pwa"
            params["state"] = new_state
            self.strategy.session_set("state", new_state)
        return params

    def validate_state(self):
        # Inyecta el state entrante en sesión antes de validar
        incoming_state = self.data.get("state", "")
        self.strategy.session_set("state", incoming_state)
        return incoming_state

    def auth_complete(self, *args, **kwargs):
        # Asegura que el state esté en sesión antes de completar
        incoming_state = self.data.get("state", "")
        self.strategy.session_set("state", incoming_state)
        return BaseOAuth2.auth_complete(self, *args, **kwargs)

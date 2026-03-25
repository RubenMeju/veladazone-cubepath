from social_core.backends.twitch import TwitchOAuth2
from social_core.exceptions import AuthStateMissing, AuthStateForbidden, AuthCanceled


class TwitchOAuth2Mobile(TwitchOAuth2):
    """Twitch backend que no valida el state para compatibilidad móvil."""

    def validate_state(self):
        try:
            return super().validate_state()
        except (AuthStateMissing, AuthStateForbidden, AuthCanceled):
            return self.data.get("state", "")

    def auth_complete(self, *args, **kwargs):
        try:
            return super().auth_complete(*args, **kwargs)
        except (AuthStateMissing, AuthStateForbidden, AuthCanceled):
            # Reintenta sin validación de state
            self.process_error(self.data)
            return self.do_auth(
                self.data.get("code", ""),
                *args,
                **kwargs
            )
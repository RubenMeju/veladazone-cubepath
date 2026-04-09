def save_twitch_profile(backend, user, response, *args, **kwargs):
    """Save Twitch profile data to user model after OAuth."""
    if backend.name == "twitch":
        data = response.get("data", [{}])[0] if "data" in response else response
        user.twitch_id = data.get("id", "")
        user.twitch_username = data.get("display_name", data.get("login", ""))
        user.avatar_url = data.get("profile_image_url", "")
        user.save()


def get_or_associate_user(backend, uid, user=None, social=None, *args, **kwargs):
    """
    Reemplaza social_user del pipeline por defecto.
    Si la cuenta social ya está asociada a un usuario, lo devuelve
    directamente en lugar de lanzar AuthAlreadyAssociated.
    """
    provider = backend.name
    social_obj = backend.strategy.storage.user.get_social_auth(provider, uid)

    if social_obj:
        return {
            "social": social_obj,
            "user": social_obj.user,
            "is_new": False,
        }
    return {}

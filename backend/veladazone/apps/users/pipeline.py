def save_twitch_profile(backend, user, response, *args, **kwargs):
    """Save Twitch profile data to user model after OAuth."""
    if backend.name == 'twitch':
        data = response.get('data', [{}])[0] if 'data' in response else response
        user.twitch_id = data.get('id', '')
        user.twitch_username = data.get('display_name', data.get('login', ''))
        user.avatar_url = data.get('profile_image_url', '')
        user.save()

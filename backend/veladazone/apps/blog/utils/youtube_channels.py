# Recupera los channelId de YouTube de los peleadores de La Velada del Año 6 usando la API de YouTube.

import os
from googleapiclient.discovery import build

# Asegúrate de tener YOUTUBE_API_KEY en tu .env y cargado en settings
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# Inicializa cliente YouTube
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

# Lista de peleadores de La Velada del Año 6
fighters = [
    "Edu Aguirre",
    "Gastón Edul",
    "Fabiana Sevillano",
    "La Parce",
    "Clersss",
    "Natalia MX",
    "Lit Killah",
    "Kidd Keo",
    "Alondrissa",
    "Angie Velasco",
    "Gero Arias",
    "Viruzz",
    "Samy Rivers",
    "RoRo",
    "Marta Díaz",
    "Tatiana Kaer",
    "YoSoyPlex",
    "Fernanfloo",
    "IlloJuan",
    "TheGrefg",
]


def get_channel_id(name: str) -> str | None:
    """
    Busca el canal de YouTube del peleador por su nombre y retorna channelId.
    """
    try:
        request = youtube.search().list(
            part="snippet",
            q=name,  # Query de búsqueda
            type="channel",  # Buscar solo canales
            maxResults=1,
        )
        response = request.execute()
        items = response.get("items", [])
        if items:
            return items[0]["snippet"]["channelId"]
    except Exception as e:
        print(f"Error buscando canal para {name}: {e}")
    return None


def main():
    channel_ids = {}
    for fighter in fighters:
        cid = get_channel_id(fighter)
        channel_ids[fighter] = cid
        print(f"{fighter}: {cid}")

    # (Opcional) Guarda en un JSON para uso futuro
    import json

    with open("fighter_channel_ids.json", "w", encoding="utf-8") as f:
        json.dump(channel_ids, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()

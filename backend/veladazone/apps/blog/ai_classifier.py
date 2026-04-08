# backend/apps/blog/ai_classifier.py
import json
import requests
from django.conf import settings


CLASSIFICATION_PROMPT = """
Eres el clasificador de contenido de VeladaZone. Tu única función es determinar si un video de YouTube
está DIRECTAMENTE relacionado con La Velada del Año 6 (evento de boxeo de creadores, julio 2026).

Video:
Título: {title}
Descripción (primeros 500 chars): {description}

CRITERIOS ESTRICTOS para is_velada=true:
- Menciona explícitamente "La Velada", "Velada del Año", "Velada 6" o el combate específico
- Muestra entrenamiento de boxeo del peleador para el evento
- Es una rueda de prensa, cara a cara o pesaje del evento
- El peleador habla directamente de su rival o de la pelea

is_velada=false SI:
- Es contenido de gaming, reacciones a otros eventos, vlogs sin relación
- Menciona a otro streamer pero NO en contexto de La Velada
- El título/descripción no tiene ninguna referencia al boxeo o La Velada
- Hay dudas — en caso de duda siempre is_velada=false

Responde SOLO con este JSON (sin markdown):
{{
  "is_velada": true/false,
  "relevance_score": 0.0-1.0,
  "tags": ["entrenamiento"|"rueda_de_prensa"|"trash_talk"|"reaccion"|"documental"|"weigh_in"|"cara_a_cara"],
  "summary": "Resumen épico 2-3 frases estilo narrador de boxeo. Solo si is_velada=true.",
  "quote": "Frase impactante para subtítulo. Solo si is_velada=true."
}}
"""

FALLBACK = {
    "is_velada": False,
    "relevance_score": 0.0,
    "tags": [],
    "summary": "",
    "quote": "",
}


def classify_video(title: str, description: str) -> dict:
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "user",
                        "content": CLASSIFICATION_PROMPT.format(
                            title=title, description=description[:500]
                        ),
                    }
                ],
                "max_tokens": 400,
                "temperature": 0.2,
            },
            timeout=10,
        )
        data = response.json()
        return json.loads(data["choices"][0]["message"]["content"].strip())
    except Exception:
        return FALLBACK

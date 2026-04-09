from django.db import models

from backend.veladazone.apps.blog.constants import VELADA_KEYWORDS



# backend/apps/blog/models.py
class BlogPost(models.Model):
    fighter = models.ForeignKey(
        "fighters.Fighter", on_delete=models.CASCADE, related_name="blog_posts"
    )

    # Datos de YouTube
    youtube_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=500)
    description = models.TextField()
    thumbnail_url = models.URLField()
    channel_id = models.CharField(max_length=50)
    published_at = models.DateTimeField()
    view_count = models.PositiveIntegerField(default=0)

    # Clasificación IA
    is_velada = models.BooleanField(default=False)
    relevance_score = models.FloatField(default=0.0)  # 0.0 - 1.0
    ai_summary = models.TextField(blank=True)  # Resumen épico generado
    ai_quote = models.CharField(max_length=300, blank=True)  # Frase destacada
    ai_tags = models.JSONField(default=list)  # ["entrenamiento","trash_talk",...]

    # Control
    status = models.CharField(
        choices=[
            ("pending", "Pendiente"),
            ("published", "Publicado"),
            ("rejected", "Rechazado"),
        ],
        default="pending",
        max_length=20,
    )
    processed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at"]
        indexes = [
            models.Index(fields=["fighter", "status", "-published_at"]),
            models.Index(fields=["ai_tags"]),
        ]


class ExtraChannel(models.Model):
    name = models.CharField(max_length=200)
    channel_id = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    # Keywords específicas para filtrar, separadas por comas
    # Si está vacío usa las keywords globales de VELADA_KEYWORDS
    custom_keywords = models.TextField(
        blank=True,
        help_text="Keywords separadas por comas. Si está vacío usa las globales.",
    )

    def get_keywords(self) -> list[str]:
        if self.custom_keywords.strip():
            return [kw.strip().lower() for kw in self.custom_keywords.split(",")]
        return VELADA_KEYWORDS

    def __str__(self):
        return self.name

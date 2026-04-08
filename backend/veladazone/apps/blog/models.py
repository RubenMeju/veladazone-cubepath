from django.db import models


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

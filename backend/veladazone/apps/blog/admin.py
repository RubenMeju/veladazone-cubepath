# veladazone/apps/blog/admin.py
from django.contrib import admin
from .models import BlogPost, ExtraChannel


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "fighter",
        "status",
        "is_velada",
        "relevance_score",
        "ai_tags",
        "published_at",
        "processed_at",
    ]
    list_filter = ["status", "is_velada", "fighter"]
    search_fields = ["title", "ai_summary", "fighter__name"]
    ordering = ["-published_at"]
    readonly_fields = [
        "youtube_id",
        "title",
        "description",
        "thumbnail_url",
        "channel_id",
        "published_at",
        "view_count",
        "is_velada",
        "relevance_score",
        "ai_summary",
        "ai_quote",
        "ai_tags",
        "processed_at",
    ]
    fields = [
        "status",
        "fighter",
        "title",
        "youtube_id",
        "thumbnail_url",
        "published_at",
        "is_velada",
        "relevance_score",
        "ai_summary",
        "ai_quote",
        "ai_tags",
        "description",
        "processed_at",
    ]
    list_editable = ["status"]
    list_per_page = 25

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("fighter")



@admin.register(ExtraChannel)
class ExtraChannelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "channel_id",
        "is_active",
        "has_custom_keywords",
    )

    list_filter = ("is_active",)
    search_fields = ("name", "channel_id", "custom_keywords")

    fieldsets = (
        (None, {
            "fields": ("name", "channel_id", "is_active")
        }),
        ("Filtrado", {
            "fields": ("custom_keywords",),
            "description": "Deja vacío para usar las keywords globales de VELADA."
        }),
    )

    actions = ["activate_channels", "deactivate_channels"]

    def has_custom_keywords(self, obj):
        return bool(obj.custom_keywords.strip())

    has_custom_keywords.boolean = True
    has_custom_keywords.short_description = "Custom keywords?"

    @admin.action(description="Activar canales seleccionados")
    def activate_channels(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description="Desactivar canales seleccionados")
    def deactivate_channels(self, request, queryset):
        queryset.update(is_active=False)
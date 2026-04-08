# veladazone/apps/blog/views.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import BlogPost
from .serializers import BlogPostSerializer


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(status="published").select_related("fighter")
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        qs = super().get_queryset()

        fighter_slug = self.request.query_params.get("fighter")
        if fighter_slug:
            qs = qs.filter(fighter__slug=fighter_slug)

        tag = self.request.query_params.get("tag")
        if tag:
            qs = qs.filter(ai_tags__contains=[tag])

        ordering = self.request.query_params.get("ordering", "-published_at")
        allowed_orderings = [
            "published_at",
            "-published_at",
            "relevance_score",
            "-relevance_score",
            "view_count",
            "-view_count",
        ]
        if ordering in allowed_orderings:
            qs = qs.order_by(ordering)

        return qs

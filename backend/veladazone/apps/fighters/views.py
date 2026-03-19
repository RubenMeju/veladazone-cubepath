from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Fighter, Edition, Fight
from .serializers import FighterSerializer, EditionSerializer, FightSerializer


class FighterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fighter.objects.all()
    serializer_class = FighterSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class EditionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Edition.objects.prefetch_related('fights__fighter1', 'fights__fighter2', 'fights__winner').all()
    serializer_class = EditionSerializer
    permission_classes = [AllowAny]
    lookup_field = 'number'


class FightViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fight.objects.select_related('fighter1', 'fighter2', 'winner', 'edition').all()
    serializer_class = FightSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        edition = self.request.query_params.get('edition')
        if edition:
            qs = qs.filter(edition__number=edition)
        return qs

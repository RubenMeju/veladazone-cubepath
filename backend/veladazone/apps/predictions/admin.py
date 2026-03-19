from django.contrib import admin
from .models import Prediction


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ['user', 'fight', 'predicted_winner', 'is_correct', 'created_at']
    list_filter = ['is_correct', 'fight__edition']
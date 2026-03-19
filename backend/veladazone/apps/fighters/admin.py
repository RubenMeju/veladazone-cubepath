from django.contrib import admin
from .models import Fighter, Edition, Fight


@admin.register(Fighter)
class FighterAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'country_flag']
    search_fields = ['name', 'country']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Edition)
class EditionAdmin(admin.ModelAdmin):
    list_display = ['number', 'year', 'city', 'venue']
    ordering = ['number']


@admin.register(Fight)
class FightAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'winner', 'result_method', 'is_main_event', 'is_completed']
    list_filter = ['edition', 'is_completed', 'is_main_event']
    list_editable = ['winner', 'result_method', 'is_completed']
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "veladazone.settings.dev")

app = Celery("veladazone")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

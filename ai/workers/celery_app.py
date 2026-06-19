from celery import Celery
from kombu import Queue
from ai.core.config import settings

# Initialize Celery app
celery_app = Celery(
    "buildspace_ai_workers",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Optional configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=1800, # 30 minutes max limit for heavy training/vision models
)

# Enforce explicit queue routing
celery_app.conf.task_queues = (
    Queue("default", routing_key="task.#"),
    Queue("vision", routing_key="vision.#"),
    Queue("ocr", routing_key="ocr.#"),
    Queue("speech", routing_key="speech.#"),
)

celery_app.conf.task_default_queue = "default"
celery_app.conf.task_default_exchange = "tasks"
celery_app.conf.task_default_exchange_type = "topic"
celery_app.conf.task_default_routing_key = "task.default"

# Auto-discover task modules
celery_app.autodiscover_tasks(["ai.tasks"], force=True)

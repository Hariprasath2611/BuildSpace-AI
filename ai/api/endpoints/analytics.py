from fastapi import APIRouter, Depends
from ai.core.config import settings
from ai.api.middleware.auth import get_current_user
from ai.api.middleware.rate_limit import rate_limit_dependency

router = APIRouter()

@router.get("/usage", dependencies=[Depends(rate_limit_dependency)])
async def get_usage_metrics(user: dict = Depends(get_current_user)):
    """
    Returns AI inference statistics (token usage, cost tracked, and simulated latency).
    """
    return {
        "model_usage": [
            {"model": "gpt-4-turbo", "tokens_prompt": 124500, "tokens_completion": 48300, "cost_usd": 2.21},
            {"model": "gemini-1.5-pro", "tokens_prompt": 85000, "tokens_completion": 32000, "cost_usd": 0.85},
            {"model": "yolov8n", "inferences": 2400, "latency_ms_avg": 42.5, "cost_usd": 0.0}
        ],
        "latency_metrics": {
            "avg_llm_latency_seconds": 1.45,
            "avg_vision_latency_seconds": 0.38,
            "avg_ocr_latency_seconds": 0.72
        },
        "gpu_utilization": {
            "device_name": "NVIDIA A10G",
            "memory_total_mb": 24576,
            "memory_used_mb": 4096,
            "gpu_temp_c": 54.0,
            "load_percentage": 17.5
        }
    }


@router.get("/registry", dependencies=[Depends(rate_limit_dependency)])
async def get_model_registry_details(user: dict = Depends(get_current_user)):
    """
    Lists configured AI engines and their status (Active, Fallback).
    """
    return {
        "active_llm_provider": settings.DEFAULT_LLM_PROVIDER,
        "models": [
            {"name": "gpt-4-turbo", "provider": "openai", "type": "chat", "configured": settings.OPENAI_API_KEY is not None},
            {"name": "gemini-1.5-pro", "provider": "gemini", "type": "chat", "configured": settings.GEMINI_API_KEY is not None},
            {"name": "llama3", "provider": "ollama", "type": "chat", "configured": True},
            {"name": "all-MiniLM-L6-v2", "provider": "sentence-transformers", "type": "embeddings", "configured": True},
            {"name": "yolov8n / yolov11", "provider": "ultralytics", "type": "object_detection", "configured": True}
        ]
    }

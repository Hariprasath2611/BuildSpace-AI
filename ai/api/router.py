from fastapi import APIRouter
from ai.api.endpoints.copilot import router as copilot_router
from ai.api.endpoints.vision import router as vision_router
from ai.api.endpoints.speech import router as speech_router
from ai.api.endpoints.ocr import router as ocr_router
from ai.api.endpoints.prediction import router as prediction_router
from ai.api.endpoints.analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(copilot_router, prefix="/copilot", tags=["AI Copilot & Workflow"])
api_router.include_router(vision_router, prefix="/vision", tags=["Computer Vision AI"])
api_router.include_router(speech_router, prefix="/speech", tags=["Voice AI & Meetings"])
api_router.include_router(ocr_router, prefix="/ocr", tags=["OCR AI Parsing"])
api_router.include_router(prediction_router, prefix="/predict", tags=["Forecasting AI"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["System Analytics"])

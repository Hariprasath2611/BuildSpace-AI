import os
import uuid
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from ai.services.speech_service import speech_service
from ai.api.middleware.auth import get_current_user
from ai.api.middleware.rate_limit import rate_limit_dependency
from ai.core.logging import logger

router = APIRouter()

UPLOAD_DIR = "downloads/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/transcribe", dependencies=[Depends(rate_limit_dependency)])
async def transcribe_meeting_endpoint(
    file: UploadFile = File(...),
    language: Optional[str] = Form("en"),
    user: dict = Depends(get_current_user)
):
    """
    Ingests construction meetings or voice updates and transcribes them.
    Identifies speakers, action items, and task-creation voice commands.
    """
    logger.info(f"Uploading audio file: {file.filename}")
    
    # Save audio file locally
    audio_filename = f"audio_{uuid.uuid4()}_{file.filename}"
    audio_path = os.path.join(UPLOAD_DIR, audio_filename)
    
    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Transcribe audio using Whisper Wrapper
        result = speech_service.transcribe_audio(audio_path, language=language)
        return result
    except Exception as e:
        logger.error(f"Speech transcription failed: {e}")
        raise HTTPException(status_code=500, detail="Voice transcribing error.")

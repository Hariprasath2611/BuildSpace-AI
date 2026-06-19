import os
import uuid
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from ai.schemas.vision import BlueprintEstimationResponse, ProgressCheckResponse, SafetyDetectResponse
from ai.services.vision_service import vision_service
from ai.tasks.vision_tasks import process_blueprint_task, check_site_progress_task, detect_safety_hazards_task
from ai.api.middleware.auth import get_current_user
from ai.api.middleware.rate_limit import rate_limit_dependency
from ai.core.logging import logger

router = APIRouter()

# Directory for temp uploaded files
UPLOAD_DIR = "downloads/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/blueprint/estimate", response_model=BlueprintEstimationResponse, dependencies=[Depends(rate_limit_dependency)])
async def estimate_blueprint_endpoint(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    scale: float = Form(1.0),
    sync: bool = Form(True),
    user: dict = Depends(get_current_user)
):
    """
    Analyzes CAD/PDF drawings and estimates material quantities.
    Supports synchronous running and Celery queueing.
    """
    logger.info(f"Uploading blueprint for project: {project_id}")
    
    # Save file locally
    temp_filename = f"blueprint_{uuid.uuid4()}_{file.filename}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        if sync:
            # Run synchronously
            result = vision_service.estimate_blueprint(temp_path, scale)
            return result
        else:
            # Dispatch to Celery worker (returns Task ID)
            task = process_blueprint_task.delay(temp_path, scale)
            # return with placeholder structure containing task id
            return {
                "detected_walls": 0,
                "detected_rooms": 0,
                "detected_doors": 0,
                "detected_windows": 0,
                "estimated_boq": [],
                "pdf_report_url": f"/tasks/status/{task.id}"
            }
    except Exception as e:
        logger.error(f"Blueprint estimation failed: {e}")
        raise HTTPException(status_code=500, detail="Blueprint parsing error.")


@router.post("/progress/check", response_model=ProgressCheckResponse, dependencies=[Depends(rate_limit_dependency)])
async def progress_check_endpoint(
    current_image: UploadFile = File(...),
    previous_image: Optional[UploadFile] = File(None),
    project_id: str = Form(...),
    stage_id: str = Form(...),
    user: dict = Depends(get_current_user)
):
    """
    Compares site captures to track milestones achieved.
    """
    curr_filename = f"progress_curr_{uuid.uuid4()}_{current_image.filename}"
    curr_path = os.path.join(UPLOAD_DIR, curr_filename)
    with open(curr_path, "wb") as buffer:
        shutil.copyfileobj(current_image.file, buffer)
        
    prev_path = None
    if previous_image:
        prev_filename = f"progress_prev_{uuid.uuid4()}_{previous_image.filename}"
        prev_path = os.path.join(UPLOAD_DIR, prev_filename)
        with open(prev_path, "wb") as buffer:
            shutil.copyfileobj(previous_image.file, buffer)
            
    try:
        result = vision_service.check_site_progress(curr_path, prev_path)
        return result
    except Exception as e:
        logger.error(f"Progress check failed: {e}")
        raise HTTPException(status_code=500, detail="Site comparison error.")


@router.post("/safety/detect", response_model=SafetyDetectResponse, dependencies=[Depends(rate_limit_dependency)])
async def safety_detect_endpoint(
    image: UploadFile = File(...),
    confidence_threshold: float = Form(0.45),
    user: dict = Depends(get_current_user)
):
    """
    Analyzes site photography for missing hard hats (helmets) and safety vests.
    """
    img_filename = f"safety_{uuid.uuid4()}_{image.filename}"
    img_path = os.path.join(UPLOAD_DIR, img_filename)
    with open(img_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    try:
        result = vision_service.detect_safety_hazards(img_path, confidence_threshold)
        return result
    except Exception as e:
        logger.error(f"Safety hazard detection failed: {e}")
        raise HTTPException(status_code=500, detail="Safety video analysis error.")

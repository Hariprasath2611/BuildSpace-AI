import os
import uuid
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from ai.schemas.ocr import OCRResponse
from ai.services.ocr_service import ocr_service
from ai.tasks.ocr_tasks import parse_ocr_document_task
from ai.api.middleware.auth import get_current_user
from ai.api.middleware.rate_limit import rate_limit_dependency
from ai.core.logging import logger

router = APIRouter()

UPLOAD_DIR = "downloads/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/parse", response_model=OCRResponse, dependencies=[Depends(rate_limit_dependency)])
async def parse_document_endpoint(
    file: UploadFile = File(...),
    document_type: str = Form("auto"),
    sync: bool = Form(True),
    user: dict = Depends(get_current_user)
):
    """
    Ingests invoices, contracts, POs, and extracts core items.
    """
    logger.info(f"Uploading file for OCR parsing: {file.filename}")
    
    # Save file locally
    doc_filename = f"ocr_{uuid.uuid4()}_{file.filename}"
    doc_path = os.path.join(UPLOAD_DIR, doc_filename)
    
    with open(doc_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        if sync:
            result = ocr_service.parse_document(doc_path, document_type)
            return result
        else:
            task = parse_ocr_document_task.delay(doc_path, document_type)
            return {
                "document_type": document_type,
                "extracted_text": f"Processing in background. Task ID: {task.id}",
                "parsed_fields": {"task_id": task.id},
                "confidence": 0.0
            }
    except Exception as e:
        logger.error(f"OCR parsing failed: {e}")
        raise HTTPException(status_code=500, detail="Document text extraction error.")

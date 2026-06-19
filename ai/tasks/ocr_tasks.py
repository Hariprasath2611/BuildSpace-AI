from ai.workers.celery_app import celery_app
from ai.services.ocr_service import ocr_service
from ai.core.logging import logger

@celery_app.task(bind=True, queue="ocr", name="ai.tasks.ocr.parse_document")
def parse_ocr_document_task(self, file_path: str, doc_type: str = "auto") -> dict:
    """
    Background worker task to run OCR engines (EasyOCR/Tesseract) on invoices/POs.
    """
    logger.info(f"Task {self.request.id} started: OCR parsing on {file_path}")
    self.update_state(state="PROGRESS", meta={"progress": 25, "status": "Reading file layout"})
    
    result = ocr_service.parse_document(file_path, doc_type)
    self.update_state(state="PROGRESS", meta={"progress": 90, "status": "Regex structural extraction completed"})
    
    return result

from ai.workers.celery_app import celery_app
from ai.services.vision_service import vision_service
from ai.core.logging import logger

@celery_app.task(bind=True, queue="vision", name="ai.tasks.vision.process_blueprint")
def process_blueprint_task(self, image_path: str, scale: float = 1.0) -> dict:
    """
    Background worker task to process heavy blue print drawings.
    """
    logger.info(f"Task {self.request.id} started: Processing blueprint {image_path}")
    self.update_state(state="PROGRESS", meta={"progress": 20, "status": "Reading drawing files"})
    
    # Process estimation
    result = vision_service.estimate_blueprint(image_path, scale)
    self.update_state(state="PROGRESS", meta={"progress": 80, "status": "BOQ estimates compiled"})
    
    return result

@celery_app.task(bind=True, queue="vision", name="ai.tasks.vision.check_site_progress")
def check_site_progress_task(self, current_img: str, previous_img: str) -> dict:
    """
    Background worker task to run ORB feature comparisons on high-res drone photography.
    """
    logger.info(f"Task {self.request.id} started: Comparing site progress")
    self.update_state(state="PROGRESS", meta={"progress": 30, "status": "Loading current/previous photo baselines"})
    
    result = vision_service.check_site_progress(current_img, previous_img)
    self.update_state(state="PROGRESS", meta={"progress": 90, "status": "Timeline sync generated"})
    
    return result

@celery_app.task(bind=True, queue="vision", name="ai.tasks.vision.detect_safety_hazards")
def detect_safety_hazards_task(self, image_path: str) -> dict:
    """
    Background worker task to run YOLOv8/v11 PPE detectors.
    """
    logger.info(f"Task {self.request.id} started: Scanning PPE violations")
    self.update_state(state="PROGRESS", meta={"progress": 40, "status": "Running YOLO Inference"})
    
    result = vision_service.detect_safety_hazards(image_path)
    
    return result

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x_min: float
    y_min: float
    x_max: float
    y_max: float

class DetectionResult(BaseModel):
    label: str = Field(..., description="Detected object class (e.g., helmet, vest, window)")
    confidence: float = Field(..., description="Confidence score from 0.0 to 1.0")
    bbox: BoundingBox = Field(..., description="Normalized bounding box coordinates")

class BlueprintEstimationRequest(BaseModel):
    blueprint_url: str = Field(..., description="URL or local path of blueprint (PDF/CAD/Image)")
    project_id: str = Field(..., description="Unique project ID")
    scale: Optional[float] = Field(default=1.0, description="Pixels per meter scale multiplier")

class MaterialBoqItem(BaseModel):
    material: str = Field(..., description="Name of material (Cement, Steel, Bricks, Tiles)")
    quantity: float = Field(..., description="Estimated numerical quantity")
    unit: str = Field(..., description="Unit of measurement (m3, tons, units, bags)")
    unit_price: float = Field(..., description="Unit price forecast")
    total_cost: float = Field(..., description="Total price forecast")

class BlueprintEstimationResponse(BaseModel):
    detected_walls: int
    detected_rooms: int
    detected_doors: int
    detected_windows: int
    estimated_boq: List[MaterialBoqItem]
    pdf_report_url: Optional[str] = None

class ProgressCheckRequest(BaseModel):
    current_image_url: str = Field(..., description="Drone/Site photo URL")
    previous_image_url: Optional[str] = Field(None, description="Previous baseline photo URL")
    project_id: str
    stage_id: str

class ProgressCheckResponse(BaseModel):
    progress_percentage: float = Field(..., description="Progress comparison percentage")
    milestone_detected: bool
    milestones_achieved: List[str]
    timeline_summary: str

class SafetyDetectRequest(BaseModel):
    image_url: str = Field(..., description="CCTV or site camera capture URL")
    confidence_threshold: float = Field(default=0.45, description="Min detection threshold")

class SafetyDetectResponse(BaseModel):
    worker_count: int
    detections: List[DetectionResult]
    unsafe_behaviors: List[str] = Field(default=[], description="Warnings about missing PPE, danger entry")
    risk_score: float = Field(..., description="Incident prediction probability 0.0 to 100.0")

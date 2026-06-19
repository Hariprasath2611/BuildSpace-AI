from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class DelayPredictionRequest(BaseModel):
    project_id: str
    weather_forecast: List[Dict[str, Any]] = Field(default=[], description="Expected temperature, rainfall data")
    labor_headcount: int = Field(..., description="Active labor count")
    material_delivery_delays: Dict[str, int] = Field(default={}, description="Expected supply chain delays in days")
    milestone_deadline_days: int = Field(..., description="Days remaining until scheduled milestone")

class DelayPredictionResponse(BaseModel):
    predicted_delay_days: float = Field(..., description="Predicted milestone slippage in days")
    confidence_score: float = Field(..., description="Confidence margin from 0.0 to 1.0")
    primary_risk_driver: str = Field(..., description="Primary delay driver (Weather, Labor, Materials)")

class CostPredictionRequest(BaseModel):
    project_id: str
    current_spent: float
    budget_allocated: float
    material_cost_index: float = Field(default=1.0, description="Inflated multiplier on raw materials")
    labor_rate_index: float = Field(default=1.0, description="Labor rate variance multiplier")
    historical_spent_series: List[float] = Field(default=[], description="Monthly expenditure history")

class CostPredictionResponse(BaseModel):
    projected_total_cost: float
    predicted_overrun_amount: float
    overrun_probability: float = Field(..., description="Chance of exceeding budget (0.0 - 1.0)")
    cash_flow_forecast_next_3_months: List[float]

class RiskScoreResponse(BaseModel):
    overall_score: float = Field(..., description="Overall risk rating out of 100")
    financial_risk: float
    safety_risk: float
    quality_risk: float
    schedule_risk: float
    weather_risk: float
    material_risk: float
    reasons: List[str]

class RecommendationRequest(BaseModel):
    project_id: str
    labor_shortage: int = Field(default=0, description="Count of open positions needed")
    critical_materials_needed: List[str] = Field(default=[], description="List of stockouts")
    equipment_shortage: List[str] = Field(default=[], description="List of missing gear")

class AllocationSuggestion(BaseModel):
    item: str
    score: float
    reason: str

class RecommendationResponse(BaseModel):
    supplier_recommendations: List[AllocationSuggestion]
    equipment_allocations: List[AllocationSuggestion]
    labor_allocations: List[AllocationSuggestion]
    prioritized_tasks: List[str]

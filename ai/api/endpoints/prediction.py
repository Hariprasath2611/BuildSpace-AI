from fastapi import APIRouter, Depends, HTTPException
from ai.schemas.prediction import (
    DelayPredictionRequest, DelayPredictionResponse,
    CostPredictionRequest, CostPredictionResponse,
    RiskScoreResponse, RecommendationRequest, RecommendationResponse
)
from ai.services.forecasting_service import forecasting_service
from ai.api.middleware.auth import get_current_user
from ai.api.middleware.rate_limit import rate_limit_dependency
from ai.core.logging import logger

router = APIRouter()

@router.post("/delay", response_model=DelayPredictionResponse, dependencies=[Depends(rate_limit_dependency)])
async def predict_delay_endpoint(request: DelayPredictionRequest, user: dict = Depends(get_current_user)):
    """
    Predicts milestone delays based on weather forecasts, labor headcounts, and supply logs.
    """
    try:
        result = forecasting_service.predict_delays(
            weather_forecast=request.weather_forecast,
            labor_headcount=request.labor_headcount,
            material_delays=request.material_delivery_delays,
            days_remaining=request.milestone_deadline_days
        )
        return result
    except Exception as e:
        logger.error(f"Delay forecasting failed: {e}")
        raise HTTPException(status_code=500, detail="Delay prediction engine error.")


@router.post("/cost", response_model=CostPredictionResponse, dependencies=[Depends(rate_limit_dependency)])
async def predict_cost_endpoint(request: CostPredictionRequest, user: dict = Depends(get_current_user)):
    """
    Predicts monthly cash flows, total forecasted spent, and probability of exceeding budget.
    """
    try:
        result = forecasting_service.predict_costs(
            current_spent=request.current_spent,
            budget=request.budget_allocated,
            material_index=request.material_cost_index,
            labor_index=request.labor_rate_index,
            history=request.historical_spent_series
        )
        return result
    except Exception as e:
        logger.error(f"Cost forecasting failed: {e}")
        raise HTTPException(status_code=500, detail="Cost prediction engine error.")


@router.post("/risk", response_model=RiskScoreResponse, dependencies=[Depends(rate_limit_dependency)])
async def calculate_risk_endpoint(metrics: dict, user: dict = Depends(get_current_user)):
    """
    Calculates safety, quality, schedule, weather, and financial risk percentages.
    """
    try:
        result = forecasting_service.calculate_risk_scores(metrics)
        return result
    except Exception as e:
        logger.error(f"Risk calculation failed: {e}")
        raise HTTPException(status_code=500, detail="Risk scoring engine error.")


@router.post("/recommendations", response_model=RecommendationResponse, dependencies=[Depends(rate_limit_dependency)])
async def recommendations_endpoint(request: RecommendationRequest, user: dict = Depends(get_current_user)):
    """
    Suggests matched suppliers, carpenters/labor allocations, and crane lease deals.
    """
    try:
        result = forecasting_service.generate_recommendations(
            labor_shortage=request.labor_shortage,
            critical_materials=request.critical_materials_needed,
            equipment_shortage=request.equipment_shortage
        )
        return result
    except Exception as e:
        logger.error(f"Recommendations generation failed: {e}")
        raise HTTPException(status_code=500, detail="Recommendation engine error.")

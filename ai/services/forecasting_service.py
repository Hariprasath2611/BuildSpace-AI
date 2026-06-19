import math
from typing import List, Dict, Any, Tuple
import numpy as np

try:
    from sklearn.linear_model import LinearRegression
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


class ForecastingService:
    def __init__(self):
        pass

    def predict_delays(
        self, 
        weather_forecast: List[Dict[str, Any]], 
        labor_headcount: int, 
        material_delays: Dict[str, int], 
        days_remaining: int
    ) -> Dict[str, Any]:
        """
        Calculates expected schedule slippage using weather metrics, labor rates, and supply delays.
        """
        # Feature calculations
        weather_risk_factor = 0.0
        for day in weather_forecast:
            # Heavy rain or extreme heat increases risk
            rain = day.get("rain_mm", 0.0)
            temp = day.get("temp_c", 25.0)
            if rain > 10.0:
                weather_risk_factor += 1.5
            if temp > 40.0 or temp < 5.0:
                weather_risk_factor += 1.0

        # Labor availability factor: baseline is 50 workers
        labor_shortage_ratio = max(0.0, (50 - labor_headcount) / 50.0)
        
        # Supply chain delays sum
        max_supply_delay = max(material_delays.values()) if material_delays else 0.0
        
        predicted_delay = 0.0
        confidence = 0.85

        # Fit a simple regression model to estimate delays if scikit-learn is available
        if SKLEARN_AVAILABLE:
            try:
                # Mock historical training data: [weather_risk, labor_shortage, supply_delay] -> delay_days
                X_train = np.array([
                    [0.0, 0.0, 0.0],
                    [2.0, 0.1, 2.0],
                    [5.0, 0.4, 10.0],
                    [8.0, 0.2, 5.0],
                    [1.0, 0.5, 7.0]
                ])
                y_train = np.array([0.0, 2.5, 12.0, 9.0, 8.5])
                
                model = LinearRegression()
                model.fit(X_train, y_train)
                
                X_pred = np.array([[weather_risk_factor, labor_shortage_ratio, float(max_supply_delay)]])
                predicted_delay = float(model.predict(X_pred)[0])
            except Exception:
                pass
                
        # Analytical fallback formula if ML fit fails
        if predicted_delay <= 0.0:
            predicted_delay = (weather_risk_factor * 0.8) + (labor_shortage_ratio * 14.0) + (max_supply_delay * 0.6)

        # Cap predictions
        predicted_delay = max(0.0, round(predicted_delay, 1))
        
        # Primary driver estimation
        drivers = [
            ("Weather Conditions", weather_risk_factor * 0.8),
            ("Labor Shortage", labor_shortage_ratio * 14.0),
            ("Material Supply Delay", max_supply_delay * 0.6)
        ]
        drivers.sort(key=lambda x: x[1], reverse=True)
        primary_driver = drivers[0][0] if predicted_delay > 0.0 else "None"
        
        return {
            "predicted_delay_days": predicted_delay,
            "confidence_score": confidence,
            "primary_risk_driver": primary_driver
        }

    def predict_costs(
        self, 
        current_spent: float, 
        budget: float, 
        material_index: float, 
        labor_index: float, 
        history: List[float]
    ) -> Dict[str, Any]:
        """
        Forecasts total project cost, budget overrun probability, and 3-month cash flow.
        """
        # Run linear projection based on past spent history
        months = len(history)
        if months >= 2:
            x = np.arange(months).reshape(-1, 1)
            y = np.array(history)
            
            # Compute trend
            if SKLEARN_AVAILABLE:
                model = LinearRegression()
                model.fit(x, y)
                slope = float(model.coef_[0])
            else:
                # Basic slope formula
                slope = (y[-1] - y[0]) / (months - 1)
        else:
            slope = current_spent / max(1, months)
            
        # Extrapolate next 3 months
        next_month_spent = current_spent + slope
        cash_flow = [
            round(next_month_spent * material_index, 2),
            round((next_month_spent + slope) * labor_index, 2),
            round((next_month_spent + slope * 2) * ((material_index + labor_index) / 2.0), 2)
        ]
        
        projected_total = current_spent + sum(cash_flow)
        overrun_amount = max(0.0, projected_total - budget)
        
        # Probability calculation
        overrun_prob = 0.0
        if budget > 0:
            variance = (projected_total - budget) / budget
            if variance > 0:
                overrun_prob = min(0.99, 0.5 + (variance * 2.0))
            else:
                overrun_prob = max(0.05, 0.5 + (variance * 1.5))
                
        return {
            "projected_total_cost": round(projected_total, 2),
            "predicted_overrun_amount": round(overrun_amount, 2),
            "overrun_probability": round(overrun_prob, 2),
            "cash_flow_forecast_next_3_months": cash_flow
        }

    def calculate_risk_scores(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compiles risk scores across multiple dimensions (finance, safety, material).
        """
        financial = min(100.0, max(0.0, metrics.get("cost_overrun_prob", 0.0) * 100.0))
        safety = min(100.0, max(0.0, metrics.get("safety_violations_count", 0) * 20.0))
        quality = min(100.0, max(0.0, metrics.get("defects_count", 0) * 12.0))
        schedule = min(100.0, max(0.0, metrics.get("delay_days", 0.0) * 8.0))
        weather = min(100.0, max(0.0, metrics.get("rain_days_forecast", 0) * 15.0))
        material = min(100.0, max(0.0, len(metrics.get("material_stockouts", [])) * 25.0))
        
        overall = round((financial * 0.25) + (safety * 0.2) + (quality * 0.15) + (schedule * 0.2) + (weather * 0.1) + (material * 0.1), 1)
        
        reasons = []
        if financial > 60:
            reasons.append("High probability of budget overrun due to rising material cost indices.")
        if safety > 50:
            reasons.append("Safety risk is elevated due to repeated PPE violations.")
        if material > 50:
            reasons.append("Critical material shortages detected in concrete and steel rebars.")
            
        return {
            "overall_score": overall,
            "financial_risk": round(financial, 1),
            "safety_risk": round(safety, 1),
            "quality_risk": round(quality, 1),
            "schedule_risk": round(schedule, 1),
            "weather_risk": round(weather, 1),
            "material_risk": round(material, 1),
            "reasons": reasons
        }

    def generate_recommendations(
        self, 
        labor_shortage: int, 
        critical_materials: List[str], 
        equipment_shortage: List[str]
    ) -> Dict[str, Any]:
        """
        Suggests supplier ordering, labor shifting, and equipment dispatch mappings.
        """
        # Supplier recommendation matching score
        suppliers = [
            {"item": "Apex Concrete Solutions", "score": 0.95, "reason": "Lowest lead time (2 days) and 98% quality rating."},
            {"item": "Titan Steel Industries", "score": 0.88, "reason": "Bulk discount available for steel rebars."},
            {"item": "Evergreen Wood Suppliers", "score": 0.81, "reason": "Sufficient timber stocks, shipping lead time 4 days."}
        ]
        
        equipment = []
        for eq in equipment_shortage:
            equipment.append({
                "item": f"Redeploy {eq} from Site B",
                "score": 0.90,
                "reason": f"Site B has finished foundation work. {eq} is currently idle."
            })
        if not equipment:
            equipment = [{"item": "Lease Tower Crane from Apex Equipment", "score": 0.85, "reason": "Cheapest local rental provider."}]
            
        labor = []
        if labor_shortage > 0:
            labor.append({
                "item": "Reallocate 5 carpenters from Site C to Building A",
                "score": 0.92,
                "reason": "Carpentry work is ahead of schedule at Site C."
            })
            labor.append({
                "item": "Hire 3 temporary concrete workers from Apex Agency",
                "score": 0.78,
                "reason": "Meets immediate labor headcount deficit."
            })
        else:
            labor.append({"item": "Maintain current crew distribution", "score": 0.95, "reason": "Workforce meets schedule demands."})
            
        tasks = []
        if critical_materials:
            tasks.append(f"Reschedule pouring tasks dependent on: {', '.join(critical_materials)}")
        tasks.append("Prioritize interior partitioning wall framing (Weather-independent)")
        tasks.append("Complete floor 2 safety railing inspection")
        
        return {
            "supplier_recommendations": suppliers,
            "equipment_allocations": equipment,
            "labor_allocations": labor,
            "prioritized_tasks": tasks
        }

forecasting_service = ForecastingService()

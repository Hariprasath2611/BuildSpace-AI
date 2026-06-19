import os
import json
import pytest
from fastapi.testclient import TestClient
from ai.app.main import app

client = TestClient(app)

def test_health_endpoint():
    """
    Validates global health check reports healthy state.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "BuildSpace AI Platform" in data["service"]

def test_copilot_chat():
    """
    Validates standard Copilot chat parsing and mock reasoning.
    """
    payload = {
        "message": "Verify the safety rules for scaffolding.",
        "conversation_id": "test_conv_99",
        "history": [],
        "context": {"project_name": "Test Site A"},
        "stream": False
    }
    response = client.post("/api/v1/copilot/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "conversation_id" in data
    assert len(data["citations"]) >= 0

def test_delay_prediction():
    """
    Validates linear delay forecast predictions.
    """
    payload = {
        "project_id": "proj_01",
        "weather_forecast": [{"rain_mm": 12.5, "temp_c": 24.0}],
        "labor_headcount": 42,
        "material_delivery_delays": {"cement": 3},
        "milestone_deadline_days": 15
    }
    response = client.post("/api/v1/predict/delay", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_delay_days" in data
    assert "confidence_score" in data
    assert "primary_risk_driver" in data
    assert data["predicted_delay_days"] >= 0.0

def test_cost_prediction():
    """
    Validates cost overrun regression forecasts.
    """
    payload = {
        "project_id": "proj_01",
        "current_spent": 120000.0,
        "budget_allocated": 150000.0,
        "material_cost_index": 1.15,
        "labor_rate_index": 1.05,
        "historical_spent_series": [10000.0, 30000.0, 60000.0, 90000.0]
    }
    response = client.post("/api/v1/predict/cost", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "projected_total_cost" in data
    assert "predicted_overrun_amount" in data
    assert "overrun_probability" in data
    assert len(data["cash_flow_forecast_next_3_months"]) == 3

def test_risk_scoring():
    """
    Validates project risk scoring and category breakdowns.
    """
    payload = {
        "cost_overrun_prob": 0.75,
        "safety_violations_count": 3,
        "defects_count": 2,
        "delay_days": 4.5,
        "rain_days_forecast": 4,
        "material_stockouts": ["cement"]
    }
    response = client.post("/api/v1/predict/risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert "financial_risk" in data
    assert "safety_risk" in data
    assert len(data["reasons"]) >= 0

def test_ocr_parsing():
    """
    Validates invoice OCR parsing and regex extractor.
    """
    # Create a mock invoice text file to upload
    temp_txt_path = "downloads/uploads/test_invoice.txt"
    os.makedirs("downloads/uploads", exist_ok=True)
    with open(temp_txt_path, "w") as f:
        f.write(
            "APEX CONCRETE SOLUTIONS\n"
            "INVOICE\n"
            "Invoice Number: AC-98721\n"
            "Total Amount Due: $14,250.00\n"
        )
        
    with open(temp_txt_path, "rb") as f:
        response = client.post(
            "/api/v1/ocr/parse",
            files={"file": ("test_invoice.txt", f, "text/plain")},
            data={"document_type": "invoice", "sync": True}
        )
        
    assert response.status_code == 200
    data = response.json()
    assert data["document_type"] == "invoice"
    assert data["parsed_fields"]["vendor_name"] == "Apex Concrete Solutions"
    assert data["parsed_fields"]["total_amount"] == 14250.0

def test_speech_transcribing():
    """
    Validates Whisper voice transcription emulator.
    """
    temp_audio_path = "downloads/uploads/test_meeting.wav"
    with open(temp_audio_path, "w") as f:
        f.write("mock audio binary data stream")
        
    with open(temp_audio_path, "rb") as f:
        response = client.post(
            "/api/v1/speech/transcribe",
            files={"file": ("test_meeting.wav", f, "audio/wav")},
            data={"language": "en"}
        )
        
    assert response.status_code == 200
    data = response.json()
    assert "transcript" in data
    assert len(data["action_items"]) > 0
    assert len(data["voice_commands"]) > 0

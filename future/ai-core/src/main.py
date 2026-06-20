from fastapi import FastAPI, UploadFile, File
import uvicorn
from vision.quality_inspector import QualityInspector
from vision.cctv_analyzer import CCTVAnalyzer
from agents.agent_orchestrator import AgentOrchestrator

app = FastAPI(title="BuildSpace AI Future Core", version="1.0.0")

quality_inspector = QualityInspector()
cctv_analyzer = CCTVAnalyzer()
orchestrator = AgentOrchestrator()

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-core"}

@app.post("/api/vision/inspect-quality")
async def inspect_quality(image: UploadFile = File(...)):
    # In production, save to temp or read stream
    result = await quality_inspector.analyze(image)
    return {"status": "success", "data": result}

@app.post("/api/vision/cctv-frame")
async def analyze_cctv(frame: UploadFile = File(...)):
    result = await cctv_analyzer.process_frame(frame)
    return {"status": "success", "alerts": result}

@app.post("/api/agents/prompt")
async def prompt_agent(data: dict):
    response = await orchestrator.dispatch(data.get("prompt"), data.get("agent_type"))
    return {"status": "success", "response": response}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

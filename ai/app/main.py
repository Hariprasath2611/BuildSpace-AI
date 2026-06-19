from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai.core.config import settings
from ai.core.logging import setup_logging
from ai.api.router import api_router

# Initialize Loguru configuration
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise AI Microservices Platform for BuildSpace AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configurations matching local development ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount central API routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    """
    Consolidated health check endpoint for Prometheus and Kubernetes checks.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENV,
        "api_version": "v1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    # Start ASGI dev server
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)

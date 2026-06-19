import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "BuildSpace AI Platform"
    ENV: str = "development"
    PORT: int = 8000
    
    # Redis & Queue Configurations
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Vector DB & Embeddings
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENVIRONMENT: Optional[str] = "us-east1-gcp"
    PINECONE_INDEX_NAME: str = "buildspace-ai"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # LLM Settings
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_LLM_PROVIDER: str = "mock"  # Options: mock, openai, gemini, ollama
    
    # Media Storage
    CLOUDINARY_URL: Optional[str] = None
    
    # Security
    JWT_SECRET: str = "buildspace-ai-platform-super-secret-key-1234567890"
    JWT_ALGORITHM: str = "HS256"
    API_KEY_HEADER: str = "X-API-Key"
    ADMIN_API_KEY: str = "buildspace-admin-key-2026"
    
    # Model Configurations
    YOLO_MODEL_PATH: str = "yolov8n.pt"  # Will default to ultralytics download or mock
    SAM_MODEL_PATH: str = "sam2_hiera_tiny.pt"
    WHISPER_MODEL_NAME: str = "tiny"  # tiny, base, small, medium, large
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

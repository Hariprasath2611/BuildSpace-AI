import sys
from loguru import logger
from ai.core.config import settings

def setup_logging():
    # Remove default logger
    logger.remove()
    
    # Define logging level based on environment
    log_level = "DEBUG" if settings.ENV == "development" else "INFO"
    
    # Console handler
    logger.add(
        sys.stderr,
        level=log_level,
        format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        colorize=True,
    )
    
    # File handler for logs rotation
    logger.add(
        "logs/ai_platform.log",
        rotation="10 MB",
        retention="10 days",
        level="INFO",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
        compression="zip",
    )
    
    logger.info("Logging system initialized.")

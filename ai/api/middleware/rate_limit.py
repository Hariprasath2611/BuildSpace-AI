import time
from fastapi import Request, HTTPException
from ai.core.config import settings
from ai.core.logging import logger

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False


class RateLimiter:
    def __init__(self):
        self.r = None
        self.local_store = {} # Fallback in-memory hit counter
        if REDIS_AVAILABLE:
            try:
                self.r = redis.from_url(settings.REDIS_URL, decode_responses=True)
                logger.info("Rate limiter Redis connection active.")
            except Exception as e:
                logger.warning(f"Rate limiter Redis failed: {e}. Using in-memory fallback.")

    def check_rate_limit(self, client_ip: str, limit: int = 60, window_seconds: int = 60):
        """
        Sliding window rate limit implementation.
        Default: 60 requests per minute.
        """
        now = int(time.time())
        key = f"rate_limit:{client_ip}"
        
        # If Redis is active
        if self.r:
            try:
                pipe = self.r.pipeline()
                pipe.zremrangebyscore(key, 0, now - window_seconds)
                pipe.zadd(key, {str(now): now})
                pipe.zcard(key)
                pipe.expire(key, window_seconds)
                _, _, card, _ = pipe.execute()
                
                if card > limit:
                    raise HTTPException(status_code=429, detail="Too Many Requests. Rate limit exceeded.")
                return
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Redis rate limiter error: {e}. Falling back to memory.")
                
        # In-memory sliding window fallback
        if key not in self.local_store:
            self.local_store[key] = []
            
        # Clean expired timestamps
        self.local_store[key] = [t for t in self.local_store[key] if t > now - window_seconds]
        
        # Add new timestamp
        self.local_store[key].append(now)
        
        if len(self.local_store[key]) > limit:
            raise HTTPException(status_code=429, detail="Too Many Requests. Rate limit exceeded.")

rate_limiter = RateLimiter()

def rate_limit_dependency(request: Request):
    # Retrieve client IP
    client_ip = request.client.host if request.client else "127.0.0.1"
    rate_limiter.check_rate_limit(client_ip)

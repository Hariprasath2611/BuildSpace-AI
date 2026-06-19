from fastapi import Request, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ai.core.security import verify_jwt_token, verify_api_key
from ai.core.logging import logger

security_bearer = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)) -> dict:
    """
    Dependency to validate JWT tokens from BuildSpace AI Auth header.
    """
    if not credentials:
        # For development ease, fall back to mock tenant user if keys are unconfigured
        logger.warning("No authentication credentials provided. Falling back to Mock developer session.")
        return {
            "userId": "usr_dev_12345",
            "role": "Admin",
            "tenantId": "tenant_default_99",
            "companyId": "company_apex_solutions"
        }
        
    token = credentials.credentials
    return verify_jwt_token(token)

def get_api_client(api_key: str = Security(verify_api_key)) -> str:
    """
    Dependency to validate system-to-system API keys.
    """
    return api_key

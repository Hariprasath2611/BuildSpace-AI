import json
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
from ai.schemas.copilot import ChatRequest, ChatResponse, WorkflowExecuteRequest, WorkflowExecuteResponse
from ai.services.copilot_service import copilot_service
from ai.api.middleware.auth import get_current_user
from ai.api.middleware.rate_limit import rate_limit_dependency
from ai.core.logging import logger

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, dependencies=[Depends(rate_limit_dependency)])
async def chat_endpoint(request: ChatRequest, user: dict = Depends(get_current_user)):
    """
    Executes a standard multi-turn RAG chat message against construction manuals & specs.
    """
    history_list = [{"role": msg.role, "content": msg.content} for msg in request.history]
    
    # Enrich context with authenticated user's organization metadata
    context_enriched = {
        **request.context,
        "tenant_id": user.get("tenantId"),
        "company_id": user.get("companyId")
    }
    
    try:
        response = await copilot_service.execute_chat(
            message=request.message,
            conversation_id=request.conversation_id,
            history=history_list,
            context=context_enriched
        )
        return response
    except Exception as e:
        logger.error(f"Chat endpoint execution failed: {e}")
        raise HTTPException(status_code=500, detail="Internal AI reasoning error.")


@router.websocket("/chat/ws/{conversation_id}")
async def chat_websocket_endpoint(websocket: WebSocket, conversation_id: str):
    """
    WebSocket endpoint streaming incremental response tokens.
    """
    await websocket.accept()
    logger.info(f"WebSocket connection established for session: {conversation_id}")
    
    try:
        while True:
            # Receive text data
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            message = payload.get("message", "")
            history = payload.get("history", [])
            context = payload.get("context", {})
            
            # Streaming response generator
            async for token in copilot_service.stream_chat(message, conversation_id, history, context):
                await websocket.send_json({
                    "type": "token",
                    "content": token
                })
                
            # Send completed event
            await websocket.send_json({
                "type": "completed",
                "conversation_id": conversation_id
            })
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket session {conversation_id} disconnected.")
    except Exception as e:
        logger.error(f"WebSocket communication error: {e}")
        await websocket.close(code=1011)


@router.post("/workflow/execute", response_model=WorkflowExecuteResponse, dependencies=[Depends(rate_limit_dependency)])
async def execute_workflow(request: WorkflowExecuteRequest, user: dict = Depends(get_current_user)):
    """
    Triggers an autonomous workflow execution across multiple background models.
    """
    logger.info(f"Starting agent workflow: {request.workflow_name}")
    # Simulates launching background multi-agent orchestrations.
    # In production, we'd trigger a Celery task that coordinates tools.
    # We will trigger a mock task ID for verification.
    import uuid
    dummy_task_id = str(uuid.uuid4())
    
    return {
        "task_id": dummy_task_id,
        "status": "PENDING"
    }

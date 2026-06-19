from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender: user, assistant, system")
    content: str = Field(..., description="Content of the message")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User query message")
    conversation_id: str = Field(..., description="UUID or unique string for multi-turn chats")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Prior multi-turn message history")
    context: Optional[Dict[str, Any]] = Field(default={}, description="Optional project or tenant metadata filters")
    stream: bool = Field(default=False, description="Enable response token streaming")

class CitationItem(BaseModel):
    source: str = Field(..., description="File name, drawing number, or URL citation source")
    score: float = Field(..., description="Relevance score of retrieved chunk")
    content: str = Field(..., description="Extracted text snippet snippet")

class ChatResponse(BaseModel):
    message: str = Field(..., description="Assistant reply message")
    conversation_id: str = Field(..., description="UUID for the conversation session")
    citations: List[CitationItem] = Field(default=[], description="List of source document citations")

class WorkflowExecuteRequest(BaseModel):
    workflow_name: str = Field(..., description="Name of the workflow to orchestrate")
    steps: List[str] = Field(..., description="List of steps, e.g., OCR -> Embed -> Predict")
    payload: Dict[str, Any] = Field(..., description="Initial payload variables")

class WorkflowExecuteResponse(BaseModel):
    task_id: str = Field(..., description="Celery background task ID")
    status: str = Field(..., description="Current status: PENDING, STARTED, SUCCESS")

import asyncio
from typing import AsyncGenerator, List, Dict, Any, Optional
from ai.models.registry import model_registry
from ai.core.logging import logger
from ai.core.security import check_prompt_injection

class CopilotService:
    def __init__(self):
        self.system_prompt = (
            "You are the BuildSpace AI Principal Construction Assistant, an expert in civil engineering, "
            "project scheduling, safety guidelines, and construction materials management. "
            "Use context, drawings, and tools to answer the user's queries concisely and professionally. "
            "If user requests action execution, trigger appropriate tool calls."
        )

    async def execute_chat(
        self, 
        message: str, 
        conversation_id: str, 
        history: List[Dict[str, str]] = [], 
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes a multi-turn chat request. Enriches prompt with project metadata
        and runs simulated/real function calls.
        """
        # 1. Security Check
        is_injected, warning_msg = check_prompt_injection(message)
        if is_injected:
            return {
                "message": warning_msg,
                "conversation_id": conversation_id,
                "citations": []
            }
            
        logger.info(f"Executing chat for session: {conversation_id}")
        
        # 2. Enrich with Construction Knowledge Context
        enriched_prompt = message
        citations = []
        
        if context:
            project_name = context.get("project_name", "Unknown Project")
            milestones = context.get("active_milestones", [])
            enriched_prompt = (
                f"Project Profile Context: [Name: {project_name}, Milestones: {milestones}]\n"
                f"Query: {message}"
            )
            
        # 3. Simulated Tool Calling / Function Dispatching
        tool_output = self._intercept_and_run_tools(message)
        if tool_output:
            logger.info("Tool execution intercepted.")
            enriched_prompt = f"{enriched_prompt}\nTool Execution Results:\n{tool_output}"
            citations.append({
                "source": "BuildSpace Internal Database API",
                "score": 0.99,
                "content": tool_output
            })
            
        # 4. Invoke LLM Routing
        response_text = model_registry.route_chat(
            prompt=enriched_prompt,
            system_prompt=self.system_prompt,
            provider=None, # use default configured
            history=history
        )
        
        # Add a default document citation if we have knowledge documents attached
        if "contract" in message.lower() or "drawing" in message.lower():
            citations.append({
                "source": "SpecSection_09900_Painting.pdf",
                "score": 0.85,
                "content": "All structural doors must receive 2 coats of weather-resistant primer followed by acrylic latex finish."
            })
            
        return {
            "message": response_text,
            "conversation_id": conversation_id,
            "citations": citations
        }

    async def stream_chat(
        self,
        message: str,
        conversation_id: str,
        history: List[Dict[str, str]] = [],
        context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Streams response tokens asynchronously to client.
        Useful for WebSockets and SSE (Server-Sent Events).
        """
        # Simple tokenization simulation for streaming response
        response = await self.execute_chat(message, conversation_id, history, context)
        text = response["message"]
        words = text.split(" ")
        for i, word in enumerate(words):
            yield word + " "
            await asyncio.sleep(0.04) # Simulate network streaming delay

    def _intercept_and_run_tools(self, message: str) -> Optional[str]:
        """
        Scans query for trigger phrases and executes internal utility tools (e.g. Schedule, Budget).
        """
        msg_lower = message.lower()
        if "weather" in msg_lower:
            return "Current Weather: 32°C, Humidity 65%, Wind speed 12km/h. No precipitation expected today."
        elif "material" in msg_lower or "cement" in msg_lower:
            return "Inventory Stock Levels: Cement - 450 bags remaining, Steel rebars - 12 tons remaining, Brick inventory - 8,000 count."
        elif "workers" in msg_lower or "attendance" in msg_lower:
            return "Onsite Labor: 48 workers currently clocked in. 12 Subcontractors active. General attendance is normal."
        return None

copilot_service = CopilotService()

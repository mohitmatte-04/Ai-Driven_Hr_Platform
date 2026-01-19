"""
Chat Router for Recruitment Analytics RAG Agent

FastAPI endpoints for chatting with the recruitment analytics agent.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from google.adk.runners import Runner
from recruitment_chat_agent.agent_local import recruitment_rag_agent_local as recruitment_rag_agent
import uuid

router = APIRouter()

# In-memory session storage (replace with Redis/database in production)
sessions = {}


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str = Field(..., description="User's message/query")
    session_id: Optional[str] = Field(None, description="Session ID for conversation continuity")


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    response: str = Field(..., description="Agent's response")
    session_id: str = Field(..., description="Session ID")


@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Chat with the recruitment analytics RAG agent
    
    **Request:**
    - `message`: Natural language query about jobs, candidates, or rankings
    - `session_id`: Optional session ID for conversation history
    
    **Response:**
    - `response`: Agent's answer to the query
    - `session_id`: Session ID for maintaining conversation context
    
    **Example Queries:**
    - "How many jobs are open?"
    - "Show me top 3 candidates for job JD-2025-001"
    - "Find Python developers with 5+ years experience"
    """
    try:
        from google.adk.sessions import InMemorySessionService
        
        # Create or retrieve session
        session_id = request.session_id or str(uuid.uuid4())
        
        # Initialize session service and runner
        session_service = InMemorySessionService()
        runner = Runner(session_service=session_service)
        
        # Run agent with proper parameters
        result = runner.run(
            app=recruitment_rag_agent,
            user_message=request.message,
            session_id=session_id
        )
        
        # Extract final response from events
        final_response = ""
        for event in result.events:
            if hasattr(event, 'content') and event.content and event.content.strip():
                # Get the last non-empty content from the agent
                if hasattr(event, 'author') and event.author != 'user':
                    final_response = event.content
        
        return ChatResponse(
            response=final_response or "I'm sorry, I couldn't process that query. Please try again.",
            session_id=session_id
        )
        
    except Exception as e:
        import traceback
        error_detail = f"Error processing chat request: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(
            status_code=500,
            detail=error_detail
        )


@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """
    Get conversation history for a session
    
    **Parameters:**
    - `session_id`: Session ID to retrieve
    
    **Returns:**
    - Conversation history for the session
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "history": sessions.get(session_id, [])
    }


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a conversation session
    
    **Parameters:**
    - `session_id`: Session ID to delete
    
    **Returns:**
    - Success message
    """
    if session_id in sessions:
        del sessions[session_id]
    
    return {"message": "Session deleted successfully"}


@router.get("/health")
async def health_check():
    """Health check endpoint for chat service"""
    return {
        "status": "healthy",
        "service": "recruitment_chat_agent",
        "agent": "recruitment_analytics_rag_agent"
    }

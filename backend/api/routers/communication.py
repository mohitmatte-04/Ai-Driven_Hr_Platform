"""
Communication API Router
"""

from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from typing import List

from ..models import CommunicationRequest, CommunicationResponse, CommunicationListItem
from ..utils import run_communication_agent

router = APIRouter()

# Path to data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "communications"


@router.post("/send/{ranking_id}", response_model=CommunicationResponse)
async def send_emails(ranking_id: str):
    """
    Send shortlist emails for a ranking
    
    **Input:** Ranking ID (e.g., RANK-JD-2025-002-TEST)
    
    **Output:** Email delivery status
    """
    try:
        # Run communication agent
        result = await run_communication_agent(ranking_id)
        
        # Convert result to response model
        return CommunicationResponse(
            success=True,
            communication_id=result.get("communication_id"),
            ranking_id=ranking_id,
            job_title=result.get("job_title"),
            emails_sent=result.get("total_sent", 0),
            emails_failed=result.get("total_failed", 0),
            message=f"Sent {result.get('total_sent', 0)} emails successfully"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send emails: {str(e)}"
        )


@router.get("/list", response_model=List[CommunicationListItem])
async def list_communications():
    """
    Get all communication logs
    
    **Output:** List of all email communications
    """
    try:
        communications = []
        
        if not DATA_DIR.exists():
            return []
        
        for comm_file in DATA_DIR.glob("*.json"):
            with open(comm_file, 'r', encoding='utf-8') as f:
                comm_data = json.load(f)
                communications.append(CommunicationListItem(
                    communication_id=comm_data.get("communication_id"),
                    job_id=comm_data.get("job_id"),
                    job_title=comm_data.get("job_title"),
                    emails_sent=len(comm_data.get("emails_sent", [])),
                    sent_at=comm_data.get("logged_at", "")
                ))
        
        # Sort by sent_at descending
        communications.sort(key=lambda x: x.sent_at, reverse=True)
        
        return communications
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list communications: {str(e)}"
        )


@router.get("/{communication_id}")
async def get_communication(communication_id: str):
    """
    Get specific communication log by ID
    
    **Input:** Communication ID (e.g., COMM-20260108-193000)
    
    **Output:** Full communication data with all emails
    """
    try:
        comm_file = DATA_DIR / f"{communication_id}.json"
        
        if not comm_file.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Communication log not found: {communication_id}"
            )
        
        with open(comm_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get communication: {str(e)}"
        )

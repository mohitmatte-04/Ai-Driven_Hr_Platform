"""
Ranking API Router
"""

from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from typing import List
from datetime import datetime

from ..models import RankingRequest, RankingResponse, RankingListItem
from ..utils.agent_runner import run_smart_ranking_agent  # Use smart ADK agent!

router = APIRouter()

# Path to data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "rankings"


@router.post("/rank/{jd_id}", response_model=RankingResponse)
async def rank_candidates(jd_id: str, force_rerank: bool = False):
    """
    Rank all candidates for a specific job description
    
    **Input:** JD ID (e.g., JD-2025-002), force_rerank (optional, default=False)
    
    **Output:** Ranked candidate list with scores
    
    **Note:** Returns most recent existing ranking by default. 
    Set force_rerank=True to generate a new ranking (takes 2-3 minutes).
    """
    try:
        print(f"🔍 Ranking request for JD: {jd_id}, force_rerank={force_rerank}")
        
        # Ensure DATA_DIR exists
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        
        # Find existing ranking files for this JD
        ranking_files = list(DATA_DIR.glob(f"RANK-{jd_id}-*.json"))
        
        # If we have existing rankings and not forcing re-rank, use the latest one
        if ranking_files and not force_rerank:
            # Get most recent file
            latest_file = max(ranking_files, key=lambda p: p.stat().st_mtime)
            file_age_seconds = (datetime.now().timestamp() - latest_file.stat().st_mtime)
            
            print(f"📋 Using existing ranking: {latest_file.name} (created {int(file_age_seconds)}s ago)")
            
            with open(latest_file, 'r', encoding='utf-8') as f:
                result = json.load(f)
            
            return RankingResponse(
                success=True,
                ranking_id=result.get("ranking_id", "unknown"),
                jd_id=result.get("jd_id"),
                jd_title=result.get("jd_title"),
                total_candidates=result.get("total_candidates_evaluated", 0),
                top_candidates=len(result.get("top_candidates", [])),
                acceptable=len(result.get("acceptable_candidates", [])),
                not_recommended=len(result.get("not_recommended", [])),
                message=f"Returned existing ranking (created {int(file_age_seconds)}s ago)"
            )
        
        # No existing ranking or forced re-rank - run fast ranking!
        print(f"🚀 Running fast ranking (deterministic analysis with job title filtering)...")
        
        # Use fast deterministic ranking (no LLM, instant results!)
        from api.utils.simple_ranking import fast_rank_candidates
        result = fast_rank_candidates(jd_id)
        
        print(f"✅ Fast ranking completed!")
        
        # Find the newly created ranking file
        ranking_files = list(DATA_DIR.glob(f"RANK-{jd_id}-*.json"))
        
        if not ranking_files:
            raise ValueError(f"Ranking agent completed but no ranking file found for JD: {jd_id}")
        
        # Get most recent file (the one just created)
        latest_ranking_file = max(ranking_files, key=lambda p: p.stat().st_mtime)
        
        # Read the saved ranking file
        with open(latest_ranking_file, 'r', encoding='utf-8') as f:
            result = json.load(f)
        
        # Return the result
        return RankingResponse(
            success=True,
            ranking_id=result.get("ranking_id", "unknown"),
            jd_id=result.get("jd_id"),
            jd_title=result.get("jd_title"),
            total_candidates=result.get("total_candidates_evaluated", 0),
            top_candidates=len(result.get("top_candidates", [])),
            acceptable=len(result.get("acceptable_candidates", [])),
            not_recommended=len(result.get("not_recommended", [])),
            message=f"AI-powered ranking completed. Ranking ID: {result.get('ranking_id')}"
        )
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ ERROR IN RANKING ENDPOINT:")
        print(error_trace)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to rank candidates: {str(e)}"
        )


@router.get("/list", response_model=List[RankingListItem])
async def list_rankings():
    """
    Get all candidate rankings
    
    **Output:** List of all rankings
    """
    try:
        rankings = []
        
        if not DATA_DIR.exists():
            return []
        
        for ranking_file in DATA_DIR.glob("*.json"):
            with open(ranking_file, 'r', encoding='utf-8') as f:
                ranking_data = json.load(f)
                rankings.append(RankingListItem(
                    ranking_id=ranking_data.get("ranking_id"),
                    jd_id=ranking_data.get("jd_id"),
                    jd_title=ranking_data.get("jd_title"),
                    total_candidates=ranking_data.get("total_candidates_evaluated", 0),
                    ranked_at=ranking_data.get("ranked_at", "")
                ))
        
        # Sort by ranked_at descending
        rankings.sort(key=lambda x: x.ranked_at, reverse=True)
        
        return rankings
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list rankings: {str(e)}"
        )


@router.get("/{ranking_id}")
async def get_ranking(ranking_id: str):
    """
    Get specific ranking by ID
    
    **Input:** Ranking ID (e.g., RANK-JD-2025-002-TEST)
    
    **Output:** Full ranking data with all candidates
    """
    try:
        ranking_file = DATA_DIR / f"{ranking_id}.json"
        
        if not ranking_file.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Ranking not found: {ranking_id}"
            )
        
        with open(ranking_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get ranking: {str(e)}"
        )

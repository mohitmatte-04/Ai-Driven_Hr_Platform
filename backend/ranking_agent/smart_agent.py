"""
Optimized Ranking Agent - Uses LLM Intelligence with Parsed Data

This agent:
1. Loads already-parsed JD and resume data (no re-parsing)
2. Sends all data to LLM in ONE call (fast)
3. Gets structured ranking output with AI-powered analysis
4. Provides nuanced, contextual candidate evaluation
"""

from google.adk.agents import Agent
from google.genai import types as genai_types
from pydantic import BaseModel, Field
from typing import List, Literal, Dict, Any
from pathlib import Path
import json
from datetime import datetime
from .tools import load_all_resumes, load_jd_by_id


# ============================================================================
# Pydantic Schemas for Structured Output
# ============================================================================

class SkillMatch(BaseModel):
    """Skill matching analysis"""
    mandatory_matched: List[str] = Field(description="List of mandatory skills the candidate has")
    mandatory_missing: List[str] = Field(description="List of mandatory skills the candidate is missing")
    mandatory_coverage_percent: float = Field(description="Percentage of mandatory skills matched (0-100)")
    good_to_have_matched: List[str] = Field(description="List of optional skills the candidate has")
    good_to_have_missing: List[str] = Field(description="List of optional skills the candidate is missing")
    good_to_have_coverage_percent: float = Field(description="Percentage of optional skills matched (0-100)")


class ExperienceMatch(BaseModel):
    """Experience alignment analysis"""
    candidate_years: float = Field(description="Candidate's total years of experience")
    required_min: int = Field(description="Minimum required years")
    required_max: int = Field(description="Maximum required years")
    alignment: Literal["Perfect Match", "Close Match", "Below Requirements", "Underqualified"] = Field(
        description="How well candidate's experience aligns with requirements"
    )
    alignment_notes: str = Field(description="Brief note explaining the alignment")


class MatchScore(BaseModel):
    """Detailed scoring breakdown"""
    mandatory_skills_score: float = Field(description="Score for mandatory skills (0-40 points)")
    good_to_have_skills_score: float = Field(description="Score for optional skills (0-20 points)")
    experience_score: float = Field(description="Score for experience alignment (0-25 points)")
    location_score: float = Field(description="Score for location match (0-10 points)")
    salary_score: float = Field(description="Score for salary alignment (0-5 points)")
    total_score: float = Field(description="Total match score (0-100 points)")


class RankedCandidate(BaseModel):
    """Single ranked candidate with full analysis"""
    rank: int = Field(description="Candidate's rank position (1 = best match)")
    candidate_id: str = Field(description="Unique candidate identifier")
    candidate_name: str = Field(description="Candidate's full name")
    candidate_email: str = Field(default="", description="Candidate's email address")
    resume_evaluation_score: int = Field(description="Original resume evaluation score (0-100)")
    match_score: MatchScore = Field(description="Detailed score breakdown for this JD")
    skill_match: SkillMatch = Field(description="Skill matching analysis")
    experience_match: ExperienceMatch = Field(description="Experience alignment")
    recommendation: Literal["Highly Recommended", "Recommended", "Not Recommended"] = Field(
        description="Overall hiring recommendation"
    )
    justification: str = Field(description="2-3 sentence explanation of the ranking and recommendation")
    red_flags: List[str] = Field(default_factory=list, description="List of concerns or gaps")
    green_flags: List[str] = Field(default_factory=list, description="List of strengths and positives")


class RankingOutput(BaseModel):
    """Complete ranking output"""
    ranked_candidates: List[RankedCandidate] = Field(description="All candidates ranked by match score")


# ============================================================================
# Callback to Save Rankings
# ============================================================================

def save_rankings_callback(callback_context):
    """Save ranking results to JSON file after agent completes"""
    try:
        session = callback_context.session
        ranking_output = session.state.get("ranking_output")
        jd_id = session.state.get("jd_id")
        jd_title = session.state.get("jd_title", "Unknown")
        jd_location = session.state.get("jd_location", "Unknown")
        
        if not ranking_output:
            print("⚠️  No ranking output in state")
            return
        
        # Convert Pydantic to dict
        if hasattr(ranking_output, 'model_dump'):
            ranking_data = ranking_output.model_dump()
        else:
            ranking_data = ranking_output
        
        # Create full ranking document
        ranking_id = f"RANK-{jd_id}-{int(datetime.now().timestamp())}"
        
        # Categorize candidates
        ranked_list = ranking_data.get("ranked_candidates", [])
        top_candidates = [c["candidate_id"] for c in ranked_list if c["match_score"]["total_score"] >= 70]
        acceptable = [c["candidate_id"] for c in ranked_list if 50 <= c["match_score"]["total_score"] < 70]
        not_recommended = [c["candidate_id"] for c in ranked_list if c["match_score"]["total_score"] < 50]
        
        document = {
            "ranking_id": ranking_id,
            "ranked_at": datetime.now().isoformat(),
            "jd_id": jd_id,
            "jd_title": jd_title,
            "jd_location": jd_location,
            "total_candidates_evaluated": len(ranked_list),
            "ranked_candidates": ranked_list,
            "top_candidates": top_candidates,
            "acceptable_candidates": acceptable,
            "not_recommended": not_recommended,
            "summary": f"{len(ranked_list)} candidates evaluated. {len(top_candidates)} highly recommended, {len(acceptable)} acceptable, {len(not_recommended)} not recommended."
        }
        
        # Save to file
        data_dir = Path(__file__).parent.parent / "data" / "rankings"
        data_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = data_dir / f"{ranking_id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(document, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Ranking saved: {file_path}")
        print(f"📊 Total: {len(ranked_list)}, Top: {len(top_candidates)}, Acceptable: {len(acceptable)}, Not Rec: {len(not_recommended)}")
        
    except Exception as e:
        print(f"⚠️  Error saving ranking: {e}")
        import traceback
        traceback.print_exc()


# ============================================================================
# Smart Ranking Agent
# ============================================================================

smart_ranking_agent = Agent(
    name="smart_ranking_agent",
    model="gemini-2.5-flash",
    description="Intelligent ranking agent that analyzes parsed candidate data against job requirements using AI-powered evaluation.",
    
    # No conversation history - agent operates on injected data only
    include_contents='none',
    
    # No output schema - let LLM generate free-form JSON
    # This allows tools to work and gives LLM more flexibility
    output_key="ranking_output",
    
    # Tools to load candidate data
    tools=[],
    
    # No callback - saving handled in agent_runner
    
    instruction="""
You are an expert technical recruiter ranking candidates for: {jd_title}

## Candidates (Pre-filtered by job title match):
{candidates_data}

## Job Requirements:
- Mandatory Skills: {jd_data[requirements][mandatory_skills]}
- Good-to-Have Skills: {jd_data[requirements][good_to_have_skills]}
- Experience: {jd_data[requirements][experience]}

## Your Task:
Rank ALL candidates above. For EACH candidate:

1. **candidate_id**: Use actual ID (e.g., "CAND-20260111-120843")
2. **candidate_name**: From candidate_info.name
3. **candidate_email**: From candidate_info.email  
4. **resume_evaluation_score**: From evaluation.final_score

5. **Skill Match**: Flatten all arrays in parsed_data.technical_skills and compare:
   - mandatory_matched: JD mandatory skills found in candidate
   - mandatory_missing: JD mandatory skills NOT in candidate
   - mandatory_coverage_percent: (matched/total) * 100
   - good_to_have_matched & good_to_have_missing & coverage_percent

6. **Experience Match**:
   - candidate_years: From parsed_data.total_experience_years
   - Compare to JD experience range
   - alignment: "Perfect Match", "Close Match", "Below Requirements", or "Underqualified"

7. **Scores** (0-100 total):
   - mandatory_skills_score: (coverage% / 100) * 40
   - good_to_have_skills_score: (coverage% / 100) * 20
   - experience_score: 25 if perfect, 20 if close, 10 if below, 5 if under
   - location_score: 10 (assume all match)
   - salary_score: 3 (assume unknown)
   - **total_score**: Sum all above

8. **recommendation**: "Highly Recommended" (≥70), "Recommended" (50-69), "Not Recommended" (<50)

9. **justification**: 2-3 sentences explaining the score

10. **red_flags**: List 2-4 concerns (skill gaps, experience issues)

11. **green_flags**: List 2-4 strengths

## Output Format:
Return a JSON object with this structure:
```json
{
  "ranked_candidates": [
    {
      "rank": 1,
      "candidate_id": "actual-id",
      "candidate_name": "actual-name",
      "candidate_email": "actual-email",
      "resume_evaluation_score": 85,
      "match_score": { "mandatory_skills_score": 35, "good_to_have_skills_score": 15, "experience_score": 25, "location_score": 10, "salary_score": 3, "total_score": 88 },
      "skill_match": { "mandatory_matched": [...], "mandatory_missing": [...], "mandatory_coverage_percent": 87.5, "good_to_have_matched": [...], "good_to_have_missing": [...], "good_to_have_coverage_percent": 75 },
      "experience_match": { "candidate_years": 8, "required_min": 5, "required_max": 10, "alignment": "Perfect Match", "alignment_notes": "..." },
      "recommendation": "Highly Recommended",
      "justification": "...",
      "red_flags": ["..."],
      "green_flags": ["..."]
    }
  ]
}
```

Sort by total_score (highest first). Include ALL candidates from input.
"""
)


# Make this the root agent for ADK
root_agent = smart_ranking_agent

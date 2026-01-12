"""
Candidate Ranking Agent

Matches candidates to job descriptions using multi-factor scoring.
Loads parsed JDs and resumes, calculates match scores, and generates ranked candidate lists.
"""

import json
from pathlib import Path
from datetime import datetime
from google.adk.agents import Agent
from google.genai import types as genai_types

from .schemas import RankingOutput
from .tools import (
    load_jd_by_id,
    load_all_resumes,
    calculate_skill_match,
    get_all_candidate_skills,
    calculate_experience_score,
    calculate_location_score,
    calculate_salary_score
)


# ============================================================================
# Callback for Saving Rankings
# ============================================================================

def save_rankings_to_json(callback_context):
    """
    Callback to save ranking results to local JSON file after agent completes.
    """
    try:
        # Get the ranking data from state
        ranking_data = callback_context.state.get("candidate_rankings")
        
        if not ranking_data:
            print("⚠️ No candidate_rankings in state")
            return
        
        # Convert to dict if it's a Pydantic model
        if hasattr(ranking_data, 'model_dump'):
            ranking_dict = ranking_data.model_dump()
        else:
            ranking_dict = ranking_data
        
        # Get JD ID and create a Windows-compatible ranking ID
        jd_id = ranking_dict.get("jd_id", "UNKNOWN")
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        safe_ranking_id = f"RANK-{jd_id}-{timestamp}"
        
        # Add metadata with safe ranking_id
        document = {
            "ranking_id": safe_ranking_id,
            "ranked_at": datetime.now().isoformat(),
            "session_id": callback_context.session.id,
            **ranking_dict
        }
        
        # Save to local file
        data_dir = Path(__file__).parent.parent / "data" / "rankings"
        data_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = data_dir / f"{safe_ranking_id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(document, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Ranking saved to: {file_path}")
        print(f"📊 Total Candidates: {document.get('total_candidates_evaluated', 0)}")
        print(f"🏆 Top Candidates: {len(document.get('top_candidates', []))}")
        print(f"✅ Acceptable: {len(document.get('acceptable_candidates', []))}")
        print(f"❌ Not Recommended: {len(document.get('not_recommended', []))}")
    
    except Exception as e:
        print(f"⚠️ Error saving ranking: {e}")
        import traceback
        traceback.print_exc()


# ============================================================================
# Main Agent Definition
# ============================================================================

candidate_ranking_agent = Agent(
    name="candidate_ranking_agent",
    model="gemini-2.5-flash",
    description="Ranks candidates against job requirements using multi-factor scoring. Loads JD and all candidate resumes, calculates match scores, and generates prioritized candidate list with detailed justifications.",
    
    instruction="""
# Candidate Ranking Agent

You are a technical recruiter that ranks candidates for a job description.

## Your Task

When given a JD ID (e.g., "JD-2025-001"):

1. **Load Data** (call these tools ONCE each):
   - Call `load_jd_by_id(jd_id)` to get the job description
   - Call `load_all_resumes()` to get all candidates

2. **For EACH Candidate**, calculate scores using tools:
   - Call `get_all_candidate_skills(candidate_data)` to extract their skills
   - Call `calculate_skill_match(candidate_skills, jd_mandatory_skills)` for mandatory skills
   - Call `calculate_skill_match(candidate_skills, jd_good_to_have_skills)` for optional skills
   - Call `calculate_experience_score(candidate_years, jd_min, jd_max)` for experience
   - Call `calculate_location_score(candidate_location, jd_location, relocation_willing)` for location
   - Call `calculate_salary_score(candidate_expected, jd_min, jd_max)` for salary

3. **Calculate Total Scores**:
   - Mandatory skills: `(coverage_percent / 100) * 40` points
   - Good-to-have skills: `(coverage_percent / 100) * 20` points
   - Experience: score from tool (0-25)
   - Location: score from tool (0-10)
   - Salary: score from tool (0-5)
   - **Total = sum of all 5 scores**

4. **Rank candidates** by total score (highest first)

5. **Generate output** following the RankingOutput schema

## Scoring Examples

**Candidate with 100% mandatory skills, perfect experience:**
- Mandatory: 100% coverage = 40 points
- Good-to-have: 75% coverage = 15 points
- Experience: Perfect fit = 25 points
- Location: Match = 10 points
- Salary: Within range = 5 points
- **Total: 95 points** → "Strong Hire - Top Priority"

**Candidate missing 40% mandatory skills:**
- Mandatory: 60% coverage = 24 points
- Good-to-have: 50% coverage = 10 points
- Experience: Underqualified = 15 points
- Location: No match = 0 points
- Salary: Unknown = 3 points
- **Total: 52 points** → "Not Recommended"

## Recommendations

- ≥90: "Strong Hire - Top Priority"
- 80-89: "Strong Hire"
- 70-79: "Hire - Good Fit"
- 60-69: "Acceptable - Consider"
- 50-59: "Weak Fit - Not Recommended"
- <50: "Not Recommended"

## Output Requirements

Return valid JSON matching the RankingOutput schema with:
- All candidates ranked by score
- Specific justifications (mention exact skills, years, locations)
- Categorized lists (top_candidates, acceptable_candidates, not_recommended)
- Summary and insights

**IMPORTANT**: After calling all necessary tools and calculating scores, output the JSON immediately. Do not call tools multiple times for the same candidate.
""",
    
    output_schema=RankingOutput,
    output_key="candidate_rankings",
    
    # Tools for loading data and calculating scores
    tools=[
        load_jd_by_id,
        load_all_resumes,
        calculate_skill_match,
        get_all_candidate_skills,
        calculate_experience_score,
        calculate_location_score,
        calculate_salary_score
    ],
    
    # Generation config for structured output
    generate_content_config=genai_types.GenerateContentConfig(
        temperature=0.2,  # Low temperature for consistent, objective ranking
        max_output_tokens=16384,  # Large output for many candidates
    ),
    
    # Each ranking is independent
    include_contents="none",
    
    # Disable delegation
    disallow_transfer_to_peers=True,
    disallow_transfer_to_parent=True,
    
    # Callback to save results
    after_agent_callback=save_rankings_to_json
)


# Export as root_agent for ADK discovery
root_agent = candidate_ranking_agent

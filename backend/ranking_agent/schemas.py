"""
Pydantic schemas for Candidate Ranking Agent.
Defines structured output for candidate-JD matching and ranking.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal


# ============================================================================
# Match Score Breakdown
# ============================================================================

class SkillMatchBreakdown(BaseModel):
    """Detailed breakdown of skill matching."""
    mandatory_matched: List[str] = Field(default_factory=list, description="Mandatory skills the candidate has")
    mandatory_missing: List[str] = Field(default_factory=list, description="Mandatory skills the candidate lacks")
    mandatory_coverage_percent: float = Field(description="Percentage of mandatory skills covered (0-100)")
    good_to_have_matched: List[str] = Field(default_factory=list, description="Good-to-have skills the candidate has")
    good_to_have_missing: List[str] = Field(default_factory=list, description="Good-to-have skills the candidate lacks")
    good_to_have_coverage_percent: float = Field(default=0.0, description="Percentage of good-to-have skills covered (0-100)")


class ExperienceMatch(BaseModel):
    """Experience alignment analysis."""
    candidate_years: float = Field(description="Candidate's total years of experience")
    required_min: int = Field(description="Minimum required years from JD")
    required_max: int = Field(description="Maximum required years from JD")
    alignment: Literal["Perfect Fit", "Slightly Underqualified", "Slightly Overqualified", "Underqualified", "Overqualified"] = Field(
        description="Experience alignment category"
    )
    alignment_notes: Optional[str] = Field(default=None, description="Additional notes about experience alignment")


class LocationMatch(BaseModel):
    """Location compatibility analysis."""
    candidate_location: str = Field(description="Candidate's current location")
    jd_location: str = Field(description="Job location from JD")
    is_match: bool = Field(description="Whether locations match")
    relocation_willing: bool = Field(default=False, description="Whether candidate is willing to relocate")
    compatibility: Literal["Exact Match", "Willing to Relocate", "Remote Possible", "Location Mismatch"] = Field(
        description="Location compatibility status"
    )


class SalaryMatch(BaseModel):
    """Salary expectation alignment."""
    candidate_expected: Optional[int] = Field(default=None, description="Candidate's expected salary")
    jd_min: Optional[int] = Field(default=None, description="Minimum salary from JD")
    jd_max: Optional[int] = Field(default=None, description="Maximum salary from JD")
    alignment: Literal["Within Range", "Below Range", "Slightly Above", "Significantly Above", "Unknown"] = Field(
        description="Salary alignment status"
    )
    alignment_notes: Optional[str] = Field(default=None, description="Additional salary alignment notes")


class MatchScore(BaseModel):
    """Weighted match score breakdown."""
    mandatory_skills_score: int = Field(ge=0, le=40, description="Score for mandatory skills match (max 40)")
    good_to_have_skills_score: int = Field(ge=0, le=20, description="Score for good-to-have skills (max 20)")
    experience_score: int = Field(ge=0, le=25, description="Score for experience alignment (max 25)")
    location_score: int = Field(ge=0, le=10, description="Score for location compatibility (max 10)")
    salary_score: int = Field(ge=0, le=5, description="Score for salary alignment (max 5)")
    total_score: int = Field(ge=0, le=100, description="Total weighted match score (0-100)")


# ============================================================================
# Individual Candidate Ranking
# ============================================================================

class CandidateRanking(BaseModel):
    """Individual candidate ranking with detailed match analysis."""
    rank: int = Field(ge=1, description="Candidate's rank (1 = best match)")
    candidate_id: str = Field(description="Unique candidate identifier")
    candidate_name: str = Field(description="Candidate's full name")
    candidate_email: Optional[str] = Field(default=None, description="Candidate's email")
    resume_evaluation_score: Optional[int] = Field(default=None, description="Original resume evaluation score (0-100)")
    
    # Match scores
    match_score: MatchScore = Field(description="Detailed match score breakdown")
    
    # Match details
    skill_match: SkillMatchBreakdown = Field(description="Skill matching breakdown")
    experience_match: ExperienceMatch = Field(description="Experience alignment analysis")
    location_match: LocationMatch = Field(description="Location compatibility")
    salary_match: SalaryMatch = Field(description="Salary alignment")
    
    # Analysis
    justification: str = Field(description="Detailed explanation of why this candidate matches (or doesn't)")
    recommendation: Literal[
        "Strong Hire - Top Priority",
        "Strong Hire",
        "Hire - Good Fit",
        "Acceptable - Consider",
        "Weak Fit - Not Recommended",
        "Not Recommended"
    ] = Field(description="Hiring recommendation based on match")
    
    red_flags: List[str] = Field(default_factory=list, description="Concerns or weaknesses in the match")
    green_flags: List[str] = Field(default_factory=list, description="Strengths or positive indicators")


# ============================================================================
# Main Ranking Output
# ============================================================================

class RankingOutput(BaseModel):
    """Complete ranking output for a job description."""
    
    # JD Information
    jd_id: str = Field(description="Job description identifier")
    jd_title: str = Field(description="Job title from JD")
    jd_location: str = Field(description="Job location")
    
    # Ranking Metadata
    ranking_id: str = Field(description="Unique ranking identifier (RANK-{jd_id}-{timestamp})")
    ranked_at: str = Field(description="ISO timestamp when ranking was performed")
    
    # Candidate Rankings
    total_candidates_evaluated: int = Field(ge=0, description="Total number of candidates evaluated")
    ranked_candidates: List[CandidateRanking] = Field(
        description="All candidates ranked by match score (best to worst)"
    )
    
    # Summary Lists
    top_candidates: List[str] = Field(
        default_factory=list,
        description="Candidate IDs of top 3-5 matches (score >= 80)"
    )
    acceptable_candidates: List[str] = Field(
        default_factory=list,
        description="Candidate IDs of acceptable matches (60-79 score)"
    )
    not_recommended: List[str] = Field(
        default_factory=list,
        description="Candidate IDs not recommended (score < 60)"
    )
    
    # Overall Summary
    summary: str = Field(
        description="High-level summary of the ranking results (e.g., '15 candidates: 3 strong, 8 acceptable, 4 not recommended')"
    )
    
    # Key Insights
    insights: List[str] = Field(
        default_factory=list,
        description="Key insights about the candidate pool (e.g., 'Most candidates lack Kubernetes experience')"
    )


# ============================================================================
# Simplified Ranking Output (for Production)
# ============================================================================

class CandidateRankingSimple(BaseModel):
    """Simplified candidate ranking for quick decision-making."""
    rank: int = Field(ge=1, description="Rank (1 = best match)")
    candidate_id: str = Field(description="Unique candidate identifier")
    candidate_name: str = Field(description="Candidate's full name")
    email: str = Field(description="Email address for communication")
    total_score: int = Field(ge=0, le=100, description="Total match score (0-100)")
    selected: bool = Field(description="Whether to shortlist this candidate (score >= 70)")
    rejection_reason: Optional[str] = Field(
        default=None,
        description="Brief reason if not selected (e.g., 'Missing mandatory skills: Kubernetes, Docker')"
    )


class SimplifiedRankingOutput(BaseModel):
    """Lightweight ranking output for production decision-making."""
    
    # JD Information
    job_id: str = Field(description="Job description ID")
    job_title: str = Field(description="Job title from JD")
    ranking_id: str = Field(description="Unique ranking identifier")
    ranked_at: str = Field(description="ISO timestamp when ranking was performed")
    
    # Ranked Candidates
    total_candidates: int = Field(ge=0, description="Total candidates evaluated")
    ranked_candidates: List[CandidateRankingSimple] = Field(
        description="All candidates ranked by score (highest first)"
    )
    
    # Summary Stats
    selected_count: int = Field(description="Number of candidates selected for shortlist")
    rejected_count: int = Field(description="Number of candidates rejected")
    
    # Summary
    summary: str = Field(
        description="Brief summary (e.g., '3 selected out of 10 candidates for Senior Backend Engineer role')"
    )


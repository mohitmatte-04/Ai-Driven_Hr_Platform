"""
Pydantic response models for API endpoints
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============================================================================
# JD Parsing Models
# ============================================================================

class JDParseRequest(BaseModel):
    """Request body for parsing job description"""
    jd_text: str = Field(description="Job description text to parse")


class JDParseResponse(BaseModel):
    """Response from JD parsing endpoint"""
    success: bool
    jd_id: str
    role_title: str
    experience_min: int
    experience_max: int
    location: str
    mandatory_skills: List[str]
    good_to_have_skills: List[str]
    message: str


class JDListItem(BaseModel):
    """Individual JD in list response"""
    jd_id: str
    role_title: str
    location: str
    created_at: str
    status: str


# ============================================================================
# Resume Parsing Models
# ============================================================================

class ResumeParseResponse(BaseModel):
    """Response from resume parsing endpoint"""
    success: bool
    candidate_id: str
    candidate_name: str
    candidate_email: str
    message: str


class BatchResumeParseResponse(BaseModel):
    """Response from batch resume parsing"""
    success: bool
    total_processed: int
    successful: int
    failed: int
    candidates: List[str]  # List of candidate IDs


class CandidateListItem(BaseModel):
    """Individual candidate in list response"""
    candidate_id: str
    name: str
    email: str
    experience_years: float
    location: str


# ============================================================================
# Ranking Models
# ============================================================================

class RankingRequest(BaseModel):
    """Request for ranking candidates"""
    jd_id: str = Field(description="Job description ID to rank against")


class RankingResponse(BaseModel):
    """Response from ranking endpoint"""
    success: bool
    ranking_id: str
    jd_id: str
    jd_title: str
    total_candidates: int
    top_candidates: int
    acceptable: int
    not_recommended: int
    message: str


class RankingListItem(BaseModel):
    """Individual ranking in list response"""
    ranking_id: str
    jd_id: str
    jd_title: str
    total_candidates: int
    ranked_at: str


# ============================================================================
# Communication Models
# ============================================================================

class CommunicationRequest(BaseModel):
    """Request for sending emails"""
    ranking_id: str = Field(description="Ranking ID to send emails for")


class CommunicationResponse(BaseModel):
    """Response from email sending endpoint"""
    success: bool
    communication_id: str
    ranking_id: str
    job_title: str
    emails_sent: int
    emails_failed: int
    message: str


class CommunicationListItem(BaseModel):
    """Individual communication log in list response"""
    communication_id: str
    job_id: str
    job_title: str
    emails_sent: int
    sent_at: str


# ============================================================================
# Generic Response Models
# ============================================================================

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    detail: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    timestamp: str

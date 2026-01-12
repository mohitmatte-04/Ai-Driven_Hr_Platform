"""
Shared utilities and schemas for recruitment platform
"""
from pydantic import BaseModel, Field
from typing import Literal
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv()

# ============================================================================
# PYDANTIC SCHEMAS - Shared across all agents
# ============================================================================

class JDSchema(BaseModel):
    """Structured Job Description output"""
    job_id: str = Field(description="Unique job identifier, format: JD-YYYY-NNN")
    role_title: str = Field(description="Job role/title")
    experience_min: int = Field(description="Minimum years of experience required", ge=0)
    experience_max: int = Field(description="Maximum years of experience", ge=0)
    location: str = Field(description="Job location (city)")
    relocation_allowed: bool = Field(description="Whether relocation is allowed")
    salary_min: int | None = Field(default=None, description="Minimum salary in rupees")
    salary_max: int | None = Field(default=None, description="Maximum salary in rupees")
    mandatory_skills: list[str] = Field(description="Required skills (normalized)")
    good_to_have_skills: list[str] = Field(description="Preferred skills (normalized)")
    profile_type: Literal["Technical", "Non-Technical", "Leadership"] = Field(
        description="Type of profile required"
    )


class CandidateProfile(BaseModel):
    """Structured candidate resume output"""
    candidate_id: str = Field(description="Unique candidate ID, format: CAND-YYYY-NNNNN")
    name: str = Field(description="Candidate full name")
    email: str = Field(description="Email address")
    phone: str | None = Field(default=None, description="Phone number")
    total_experience_years: float = Field(description="Total years of experience", ge=0)
    skills: list[str] = Field(description="All skills (normalized)")
    roles: list[str] = Field(description="Previous job titles/roles")
    education: str = Field(description="Highest education qualification")
    current_location: str = Field(description="Current city/location")


class RankingScore(BaseModel):
    """Candidate ranking output"""
    job_id: str
    candidate_id: str
    total_score: float = Field(ge=0, le=100, description="Overall match score (0-100)")
    skill_match_score: float = Field(ge=0, le=40)
    experience_score: float = Field(ge=0, le=25)
    role_score: float = Field(ge=0, le=15)
    location_score: float = Field(ge=0, le=10)
    quality_score: float = Field(ge=0, le=10)


# ============================================================================
# FIREBASE INITIALIZATION
# ============================================================================

def get_firestore_client():
    """Initialize and return Firestore client"""
    if not firebase_admin._apps:
        # Check if service account JSON is provided
        cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            # Use Application Default Credentials
            cred = credentials.ApplicationDefault()
        
        firebase_admin.initialize_app(cred, {
            'projectId': os.environ.get('FIREBASE_PROJECT_ID') or os.environ.get('GOOGLE_CLOUD_PROJECT')
        })
    
    return firestore.client()


# ============================================================================
# UTILITIES
# ============================================================================

def normalize_skill(skill: str) -> str:
    """Normalize skill names to standard format"""
    skill_map = {
        'py': 'Python',
        'js': 'JavaScript',
        'ts': 'TypeScript',
        'k8s': 'Kubernetes',
        'tf': 'Terraform',
        'react.js': 'React',
        'node.js': 'Node.js',
        'postgresql': 'PostgreSQL',
        'mysql': 'MySQL',
        'mongodb': 'MongoDB',
    }
    
    skill_lower = skill.lower().strip()
    return skill_map.get(skill_lower, skill.title())



def generate_job_id() -> str:
    """Generate unique job ID with timestamp"""
    from datetime import datetime
    
    year = datetime.now().year
    timestamp = int(datetime.now().timestamp())
    
    return f"JD-{year}-{timestamp % 100000:05d}"


def generate_candidate_id() -> str:
    """Generate unique candidate ID based on existing files"""
    from datetime import datetime
    from pathlib import Path
    
    year = datetime.now().year
    
    # Count existing candidate JSON files
    parsed_dir = Path(__file__).parent.parent / "data" / "parsed_candidates"
    parsed_dir.mkdir(parents=True, exist_ok=True)
    
    existing_files = list(parsed_dir.glob(f"CAND-{year}-*.json"))
    count = len(existing_files)
    
    return f"CAND-{year}-{count + 1:05d}"


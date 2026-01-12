"""
Tools for Candidate Ranking Agent.
File loading and matching calculation utilities.
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Optional


# ============================================================================
# File Loading Tools
# ============================================================================

def load_jd_by_id(jd_id: str) -> Dict[str, Any]:
    """
    Loads a parsed job description by ID.
    
    Args:
        jd_id: Job description ID (e.g., "JD-2025-001")
    
    Returns:
        Dictionary containing parsed JD data
    """
    try:
        jd_path = Path(__file__).parent.parent / "data" / "parsed_jds" / f"{jd_id}.json"
        
        if not jd_path.exists():
            return {
                "error": f"JD file not found: {jd_id}",
                "available_jds": list_available_jds()
            }
        
        with open(jd_path, "r", encoding="utf-8") as f:
            jd_data = json.load(f)
        
        print(f"✅ Loaded JD: {jd_id} - {jd_data.get('role_title', 'Unknown Role')}")
        return jd_data
    
    except Exception as e:
        return {
            "error": f"Error loading JD {jd_id}: {str(e)}",
            "available_jds": list_available_jds()
        }


def load_all_resumes() -> List[Dict[str, Any]]:
    """
    Loads all parsed candidate resumes from data/parsed_resumes/.
    
    Returns:
        List of dictionaries containing candidate data
    """
    try:
        resumes_dir = Path(__file__).parent.parent / "data" / "parsed_resumes"
        
        if not resumes_dir.exists():
            print("⚠️ No parsed_resumes directory found")
            return []
        
        resume_files = list(resumes_dir.glob("CAND-*.json"))
        
        if not resume_files:
            print("⚠️ No candidate resumes found in data/parsed_resumes/")
            return []
        
        resumes = []
        for resume_file in resume_files:
            try:
                with open(resume_file, "r", encoding="utf-8") as f:
                    resume_data = json.load(f)
                    resumes.append(resume_data)
            except Exception as e:
                print(f"⚠️ Error loading {resume_file.name}: {e}")
                continue
        
        print(f"✅ Loaded {len(resumes)} candidate resumes")
        return resumes
    
    except Exception as e:
        print(f"❌ Error loading resumes: {e}")
        return []


def list_available_jds() -> List[str]:
    """Returns list of available JD IDs."""
    try:
        jds_dir = Path(__file__).parent.parent / "data" / "parsed_jds"
        if not jds_dir.exists():
            return []
        return [f.stem for f in jds_dir.glob("JD-*.json")]
    except:
        return []


# ============================================================================
# Skill Matching Utilities
# ============================================================================

def normalize_skill(skill: str) -> str:
    """
    Normalizes skill name for comparison.
    
    Args:
        skill: Raw skill string
    
    Returns:
        Normalized skill string
    """
    # Convert to lowercase and strip whitespace
    normalized = skill.lower().strip()
    
    # Common abbreviation expansions
    skill_map = {
        "py": "python",
        "js": "javascript",
        "ts": "typescript",
        "k8s": "kubernetes",
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node",
        "nodejs": "node",
        "vue.js": "vue",
        "vuejs": "vue",
        "postgres": "postgresql",
        "mongo": "mongodb",
        "es6": "javascript",
        "ecmascript": "javascript",
    }
    
    return skill_map.get(normalized, normalized)


def calculate_skill_match(
    candidate_skills: List[str],
    required_skills: List[str]
) -> Dict[str, Any]:
    """
    Calculates skill match between candidate and requirements.
    
    Args:
        candidate_skills: List of candidate's skills
        required_skills: List of required skills from JD
    
    Returns:
        Dictionary with matched/missing skills and coverage percentage
    """
    # Normalize all skills
    normalized_candidate = set(normalize_skill(s) for s in candidate_skills)
    normalized_required = set(normalize_skill(s) for s in required_skills)
    
    # Find matches and gaps
    matched = normalized_required & normalized_candidate
    missing = normalized_required - normalized_candidate
    
    # Calculate coverage
    coverage = (len(matched) / len(normalized_required) * 100) if normalized_required else 100.0
    
    return {
        "matched": list(matched),
        "missing": list(missing),
        "coverage_percent": round(coverage, 1),
        "match_count": len(matched),
        "total_required": len(normalized_required)
    }


def get_all_candidate_skills(candidate_data: Dict[str, Any]) -> List[str]:
    """
    Extracts all skills from a candidate's parsed resume.
    
    Args:
        candidate_data: Candidate's parsed resume data
    
    Returns:
        List of all candidate skills (combined from all categories)
    """
    skills = []
    
    # Get technical skills from parsed_data
    parsed_data = candidate_data.get("parsed_data", {})
    tech_skills = parsed_data.get("technical_skills", {})
    
    # Combine all skill categories
    for category in ["programming_languages", "frameworks", "databases", 
                     "cloud_platforms", "devops_tools", "tools"]:
        skills.extend(tech_skills.get(category, []))
    
    return skills


# ============================================================================
# Experience Scoring
# ============================================================================

def calculate_experience_score(
    candidate_years: float,
    min_years: int,
    max_years: int
) -> Dict[str, Any]:
    """
    Calculates experience alignment score.
    
    Args:
        candidate_years: Candidate's total years of experience
        min_years: Minimum required years from JD
        max_years: Maximum required years from JD
    
    Returns:
        Dictionary with score (0-25) and alignment category
    """
    if min_years <= candidate_years <= max_years:
        return {
            "score": 25,
            "alignment": "Perfect Fit",
            "notes": f"{candidate_years} years matches {min_years}-{max_years} year requirement perfectly"
        }
    
    elif candidate_years < min_years:
        # Underqualified
        ratio = candidate_years / min_years
        score = int(ratio * 17.5)  # Max 70% of points (17.5 out of 25)
        
        if ratio >= 0.8:
            alignment = "Slightly Underqualified"
            notes = f"{candidate_years} years, slightly below {min_years} year minimum"
        else:
            alignment = "Underqualified"
            notes = f"{candidate_years} years, significantly below {min_years} year minimum"
        
        return {"score": score, "alignment": alignment, "notes": notes}
    
    else:
        # Overqualified
        years_over = candidate_years - max_years
        penalty = min(int(years_over * 2), 10)  # Max 10 point penalty
        score = max(25 - penalty, 15)  # Min 60% of points (15 out of 25)
        
        if years_over <= 2:
            alignment = "Slightly Overqualified"
            notes = f"{candidate_years} years, slightly above {max_years} year maximum"
        else:
            alignment = "Overqualified"
            notes = f"{candidate_years} years, significantly above {max_years} year maximum"
        
        return {"score": score, "alignment": alignment, "notes": notes}


# ============================================================================
# Location Scoring
# ============================================================================

def calculate_location_score(
    candidate_location: str,
    jd_location: str,
    relocation_willing: bool = False
) -> Dict[str, Any]:
    """
    Calculates location compatibility score.
    
    Args:
        candidate_location: Candidate's current location
        jd_location: Job location from JD
        relocation_willing: Whether candidate is willing to relocate
    
    Returns:
        Dictionary with score (0-10) and compatibility status
    """
    # Normalize locations for comparison
    cand_loc = candidate_location.lower().strip()
    job_loc = jd_location.lower().strip()
    
    # Check for exact match
    if cand_loc == job_loc or cand_loc in job_loc or job_loc in cand_loc:
        return {
            "score": 10,
            "is_match": True,
            "compatibility": "Exact Match"
        }
    
    # Check for remote / anywhere
    if "remote" in job_loc or "anywhere" in job_loc:
        return {
            "score": 10,
            "is_match": True,
            "compatibility": "Remote Possible"
        }
    
    # Check relocation willingness
    if relocation_willing:
        return {
            "score": 8,
            "is_match": False,
            "compatibility": "Willing to Relocate"
        }
    
    # No match, not willing to relocate
    return {
        "score": 0,
        "is_match": False,
        "compatibility": "Location Mismatch"
    }


# ============================================================================
# Salary Scoring
# ============================================================================

def calculate_salary_score(
    candidate_expected: Optional[int],
    jd_min: Optional[int],
    jd_max: Optional[int]
) -> Dict[str, Any]:
    """
    Calculates salary expectation alignment score.
    
    Args:
        candidate_expected: Candidate's expected salary
        jd_min: Minimum salary from JD
        jd_max: Maximum salary from JD
    
    Returns:
        Dictionary with score (0-5) and alignment status
    """
    if not candidate_expected or not jd_min or not jd_max:
        return {
            "score": 3,  # Neutral score when data unavailable
            "alignment": "Unknown",
            "notes": "Salary information not available"
        }
    
    # Within range
    if jd_min <= candidate_expected <= jd_max:
        return {
            "score": 5,
            "alignment": "Within Range",
            "notes": f"Expected ₹{candidate_expected:,} within ₹{jd_min:,}-₹{jd_max:,} range"
        }
    
    # Below range (candidate is flexible/cheaper)
    if candidate_expected < jd_min:
        return {
            "score": 5,
            "alignment": "Below Range",
            "notes": f"Expected ₹{candidate_expected:,} below budget - cost-effective hire"
        }
    
    # Above range
    overpay_percent = ((candidate_expected - jd_max) / jd_max) * 100
    
    if overpay_percent <= 10:
        return {
            "score": 4,
            "alignment": "Slightly Above",
            "notes": f"Expected ₹{candidate_expected:,} is {overpay_percent:.1f}% above max - minor overpay"
        }
    elif overpay_percent <= 20:
        return {
            "score": 2,
            "alignment": "Significantly Above",
            "notes": f"Expected ₹{candidate_expected:,} is {overpay_percent:.1f}% above max"
        }
    else:
        return {
            "score": 0,
            "alignment": "Significantly Above",
            "notes": f"Expected ₹{candidate_expected:,} is {overpay_percent:.1f}% above max - too expensive"
        }

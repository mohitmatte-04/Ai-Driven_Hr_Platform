"""
Local Testing Version of RAG Agent Tools

This version reads from local JSON files instead of GCS for testing without cloud credentials.
"""

import json
import os
from typing import List, Dict, Optional
from pathlib import Path


def load_local_json(file_path: Path) -> dict:
    """Load JSON from local file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        return {"error": f"Failed to load {file_path}: {str(e)}"}


# Tool 1: Query Jobs (Local)
def query_jobs_local(keyword: Optional[str] = None) -> dict:
    """Query job descriptions from local files"""
    jd_dir = Path("data/parsed_jds")
    
    if not jd_dir.exists():
        return {"error": "JD directory not found", "total_jobs": 0, "jobs": []}
    
    jobs = []
    for jd_file in jd_dir.glob("*.json"):
        jd_data = load_local_json(jd_file)
        
        if "error" in jd_data:
            continue
        
        # Filter by keyword if provided
        if keyword:
            keyword_lower = keyword.lower()
            searchable = f"{jd_data.get('job_title', '')} {jd_data.get('department', '')} {' '.join(jd_data.get('required_skills', []))}".lower()
            
            if keyword_lower not in searchable:
                continue
        
        jobs.append({
            "job_id": jd_data.get("job_id"),
            "title": jd_data.get("job_title"),
            "department": jd_data.get("department"),
            "location": jd_data.get("location"),
            "experience_required": jd_data.get("experience_required"),
            "required_skills": jd_data.get("required_skills", [])[:5],
            "status": jd_data.get("status", "Open")
        })
    
    return {
        "total_jobs": len(jobs),
        "jobs": jobs
    }


# Tool 2: Query Candidates (Local)
def query_candidates_local(skill: Optional[str] = None, min_experience: Optional[int] = None) -> dict:
    """Query candidates from local files"""
    resume_dir = Path("data/parsed_resumes")
    
    if not resume_dir.exists():
        return {"error": "Resume directory not found", "total_candidates": 0, "candidates": []}
    
    candidates = []
    for resume_file in resume_dir.glob("*.json"):
        resume_data = load_local_json(resume_file)
        
        if "error" in resume_data:
            continue
        
        # Filter by skill
        if skill:
            candidate_skills = [s.lower() for s in resume_data.get("skills", [])]
            if skill.lower() not in candidate_skills:
                continue
        
        # Filter by experience
        experience = resume_data.get("total_experience_years", 0)
        if min_experience and experience < min_experience:
            continue
        
        candidates.append({
            "candidate_id": resume_data.get("candidate_id"),
            "name": resume_data.get("name"),
            "email": resume_data.get("email"),
            "phone": resume_data.get("phone"),
            "experience_years": experience,
            "skills": resume_data.get("skills", [])[:10],
            "current_role": resume_data.get("current_role"),
            "target_job_title": resume_data.get("target_job_title")
        })
    
    return {
        "total_candidates": len(candidates),
        "candidates": candidates
    }


# Tool 3: Get Rankings (Local)
def get_candidate_rankings_local(job_id: str, top_n: int = 5) -> dict:
    """Get candidate rankings from local files"""
    ranking_dir = Path("data/rankings")
    
    if not ranking_dir.exists():
        return {"error": "Ranking directory not found", "job_id": job_id, "ranked_candidates": []}
    
    # Find ranking file for job_id
    ranking_file = None
    for file in ranking_dir.glob("*.json"):
        if job_id in file.name:
            ranking_file = file
            break
    
    if not ranking_file:
        return {
            "error": f"No ranking data found for job_id: {job_id}",
            "job_id": job_id,
            "ranked_candidates": []
        }
    
    ranking_data = load_local_json(ranking_file)
    
    if "error" in ranking_data:
        return ranking_data
    
    # Get top N candidates
    ranked_candidates = ranking_data.get("ranked_candidates", [])[:top_n]
    
    # Format results
    results = []
    for candidate in ranked_candidates:
        results.append({
            "rank": candidate.get("rank"),
            "candidate_id": candidate.get("candidate_id"),
            "match_score": candidate.get("match_score"),
            "selection_recommendation": candidate.get("selection_recommendation"),
            "key_strengths": candidate.get("key_strengths", []),
            "potential_concerns": candidate.get("potential_concerns", []),
            "rejection_reason": candidate.get("rejection_reason")
        })
    
    return {
        "job_id": job_id,
        "total_ranked": len(ranking_data.get("ranked_candidates", [])),
        "top_candidates": results
    }


# Tool 4: Get Stats (Local)
def get_recruitment_stats_local() -> dict:
    """Get recruitment statistics from local files"""
    jd_dir = Path("data/parsed_jds")
    resume_dir = Path("data/parsed_resumes")
    ranking_dir = Path("data/rankings")
    
    # Count files
    jd_count = len(list(jd_dir.glob("*.json"))) if jd_dir.exists() else 0
    resume_count = len(list(resume_dir.glob("*.json"))) if resume_dir.exists() else 0
    ranking_count = len(list(ranking_dir.glob("*.json"))) if ranking_dir.exists() else 0
    
    # Get job status distribution
    job_status = {}
    if jd_dir.exists():
        for jd_file in jd_dir.glob("*.json"):
            jd_data = load_local_json(jd_file)
            if "error" not in jd_data:
                status = jd_data.get("status", "Open")
                job_status[status] = job_status.get(status, 0) + 1
    
    return {
        "total_jobs": jd_count,
        "total_candidates": resume_count,
        "total_rankings": ranking_count,
        "jobs_by_status": job_status
    }

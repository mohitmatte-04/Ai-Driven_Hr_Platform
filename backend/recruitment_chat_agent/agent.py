"""
Recruitment Analytics RAG Agent

Intelligent chatbot for querying recruitment data from Google Cloud Storage
using Retrieval-Augmented Generation (RAG).
"""

from google.adk.agents import Agent
from google.cloud import storage
import json
import os
from typing import List, Dict, Optional
from pathlib import Path


# GCS Client Setup
def get_gcs_client():
    """Initialize and return GCS storage client"""
    return storage.Client()


def download_json_from_gcs(bucket_name: str, blob_path: str) -> dict:
    """
    Download and parse JSON file from GCS
    
    Args:
        bucket_name: GCS bucket name
        blob_path: Path to blob in bucket
        
    Returns:
        Parsed JSON data as dict
    """
    try:
        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_path)
        
        content = blob.download_as_string()
        return json.loads(content)
    except Exception as e:
        return {"error": f"Failed to download {blob_path}: {str(e)}"}


def list_gcs_files(bucket_name: str, prefix: str) -> List[str]:
    """
    List all files in GCS bucket with given prefix
    
    Args:
        bucket_name: GCS bucket name
        prefix: Folder prefix (e.g., 'job-descriptions/')
        
    Returns:
        List of blob names
    """
    try:
        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blobs = bucket.list_blobs(prefix=prefix)
        return [blob.name for blob in blobs]
    except Exception as e:
        return []


# Tool 1: Query Job Descriptions
def query_jobs(keyword: Optional[str] = None) -> dict:
    """
    Query job descriptions from GCS.
    
    Args:
        keyword: Optional keyword to filter jobs (searches in title, department, skills)
        
    Returns:
        Dict containing list of matching jobs with details
    """
    bucket_name = os.getenv("GCS_BUCKET_NAME", "recruitment-data")
    
    # Get all JD files
    jd_files = list_gcs_files(bucket_name, "job-descriptions/")
    
    jobs = []
    for jd_file in jd_files:
        jd_data = download_json_from_gcs(bucket_name, jd_file)
        
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
            "required_skills": jd_data.get("required_skills", [])[:5],  # Top 5 skills
            "status": jd_data.get("status", "Open")
        })
    
    return {
        "total_jobs": len(jobs),
        "jobs": jobs
    }


# Tool 2: Query Candidates/Resumes
def query_candidates(skill: Optional[str] = None, min_experience: Optional[int] = None) -> dict:
    """
    Query candidate resumes from GCS.
    
    Args:
        skill: Optional skill to filter candidates
        min_experience: Minimum years of experience
        
    Returns:
        Dict containing list of matching candidates
    """
    bucket_name = os.getenv("GCS_BUCKET_NAME", "recruitment-data")
    
    # Get all resume files
    resume_files = list_gcs_files(bucket_name, "resumes/")
    
    candidates = []
    for resume_file in resume_files:
        resume_data = download_json_from_gcs(bucket_name, resume_file)
        
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
            "skills": resume_data.get("skills", [])[:10],  # Top 10 skills
            "current_role": resume_data.get("current_role"),
            "target_job_title": resume_data.get("target_job_title")
        })
    
    return {
        "total_candidates": len(candidates),
        "candidates": candidates
    }


# Tool 3: Get Candidate Rankings
def get_candidate_rankings(job_id: str, top_n: int = 5) -> dict:
    """
    Get top N ranked candidates for a specific job.
    
    Args:
        job_id: Job ID to get rankings for
        top_n: Number of top candidates to return (default: 5)
        
    Returns:
        Dict containing ranked candidates with scores and analysis
    """
    bucket_name = os.getenv("GCS_BUCKET_NAME", "recruitment-data")
    
    # Find ranking file for job_id
    ranking_files = list_gcs_files(bucket_name, "rankings/")
    ranking_file = None
    
    for file in ranking_files:
        if job_id in file:
            ranking_file = file
            break
    
    if not ranking_file:
        return {
            "error": f"No ranking data found for job_id: {job_id}",
            "job_id": job_id,
            "ranked_candidates": []
        }
    
    ranking_data = download_json_from_gcs(bucket_name, ranking_file)
    
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


# Tool 4: Get Recruitment Statistics
def get_recruitment_stats() -> dict:
    """
    Get overall recruitment statistics.
    
    Returns:
        Dict with statistics about jobs, candidates, and rankings
    """
    bucket_name = os.getenv("GCS_BUCKET_NAME", "recruitment-data")
    
    # Count files in each category
    jd_files = list_gcs_files(bucket_name, "job-descriptions/")
    resume_files = list_gcs_files(bucket_name, "resumes/")
    ranking_files = list_gcs_files(bucket_name, "rankings/")
    
    # Get job status distribution
    job_status = {}
    for jd_file in jd_files:
        jd_data = download_json_from_gcs(bucket_name, jd_file)
        if "error" not in jd_data:
            status = jd_data.get("status", "Open")
            job_status[status] = job_status.get(status, 0) + 1
    
    return {
        "total_jobs": len(jd_files),
        "total_candidates": len(resume_files),
        "total_rankings": len(ranking_files),
        "jobs_by_status": job_status
    }


# Define the RAG Agent
recruitment_rag_agent = Agent(
    name="recruitment_analytics_rag_agent",
    model="gemini-2.5-flash",
    instruction="""
    You are an intelligent Recruitment Analytics Assistant powered by RAG (Retrieval-Augmented Generation).
    
    You help HR teams and recruiters by answering questions about:
    - Open job positions and requirements
    - Candidate profiles and resumes
    - Candidate rankings and match scores
    - Recruitment statistics and insights
    
    **Data Source:** All data is retrieved in real-time from Google Cloud Storage.
    
    **When answering questions:**
    1. Use the appropriate tools to fetch the latest data from GCS
    2. Provide accurate numbers and statistics
    3. Include relevant details (names, scores, key skills, rankings)
    4. Be conversational, helpful, and professional
    5. If data is not available, clearly state that
    6. Cite specific information from the data
    
    **Example queries you can handle:**
    - "How many jobs are currently open?"
    - "Show me the top 3 candidates for job JD-2025-001"
    - "How many Python developers do we have?"
    - "What's the status of our recruitment pipeline?"
    - "Find candidates with more than 5 years of experience in React"
    
    **Response Format:**
    - Be clear and concise
    - Use bullet points for lists
    - Include numbers and statistics when relevant
    - Highlight key insights
    """,
    tools=[
        query_jobs,
        query_candidates,
        get_candidate_rankings,
        get_recruitment_stats
    ],
    description="RAG agent for recruitment analytics queries with Google Cloud Storage data retrieval"
)


# Export the agent as root_agent for ADK
root_agent = recruitment_rag_agent

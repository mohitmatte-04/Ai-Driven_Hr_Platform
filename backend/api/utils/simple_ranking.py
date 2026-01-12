"""
Simple, fast ranking logic that doesn't require LLM calls.
Uses already-parsed resume and JD data to generate rankings.
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any


def calculate_skill_match_score(candidate_skills: List[str], required_skills: List[str]) -> Dict[str, Any]:
    """Calculate how many required skills the candidate has"""
    candidate_skills_lower = [s.lower().strip() for s in candidate_skills]
    required_skills_lower = [s.lower().strip() for s in required_skills]
    
    matched = [skill for skill in required_skills_lower if skill in candidate_skills_lower]
    missing = [skill for skill in required_skills_lower if skill not in candidate_skills_lower]
    
    coverage_percent = (len(matched) / len(required_skills_lower) * 100) if required_skills_lower else 0
    
    return {
        "matched": matched,
        "missing": missing,
        "coverage_percent": round(coverage_percent, 1)
    }


def calculate_experience_score(candidate_years: float, required_min: int, required_max: int) -> Dict[str, Any]:
    """Score candidate based on experience requirements"""
    if candidate_years >= required_min and candidate_years <= required_max:
        alignment = "Perfect Match"
        score = 25
    elif candidate_years >= required_min * 0.8:
        alignment = "Close Match"
        score = 20
    elif candidate_years >= required_min * 0.5:
        alignment = "Below Requirements"
        score = 10
    else:
        alignment = "Underqualified"
        score = 5
    
    return {
        "candidate_years": candidate_years,
        "required_min": required_min,
        "required_max": required_max,
        "alignment": alignment,
        "score": score,
        "alignment_notes": f"{candidate_years} years vs {required_min}-{required_max} required"
    }


def fast_rank_candidates(jd_id: str) -> Dict[str, Any]:
    """
    Fast ranking without LLM - uses parsed data directly
    """
    # Load JD
    jd_path = Path(__file__).parent.parent.parent / "data" / "parsed_jds" / f"{jd_id}.json"
    if not jd_path.exists():
        raise ValueError(f"JD not found: {jd_id}")
    
    with open(jd_path, 'r', encoding='utf-8') as f:
        jd_data = json.load(f)
    
    # Load all resumes
    resumes_dir = Path(__file__).parent.parent.parent / "data" / "parsed_resumes"
    candidate_files = list(resumes_dir.glob("CAND-*.json"))
    
    all_candidates = []
    for candidate_file in candidate_files:
        with open(candidate_file, 'r', encoding='utf-8') as f:
            all_candidates.append(json.load(f))
    
    # FILTER CANDIDATES BY JOB TITLE MATCH
    jd_role = jd_data.get("role_title", jd_data.get("job_title", "")).lower().strip()
    
    candidates = []
    for candidate in all_candidates:
        candidate_target = candidate.get("candidate_info", {}).get("target_job_title", "").lower().strip()
        
        # Simple matching: if JD role contains candidate target or vice versa
        if jd_role and candidate_target and (jd_role in candidate_target or candidate_target in jd_role):
            candidates.append(candidate)
            print(f"  ✓ Matched: {candidate.get('candidate_name', 'Unknown')} ({candidate_target}) for {jd_role}")
        else:
            print(f"  ✗ Skipped: {candidate.get('candidate_name', 'Unknown')} ({candidate_target}) - doesn't match {jd_role}")
    
    if not candidates:
        print(f"⚠️ No candidates matched job title: {jd_role}")
        # Return empty ranking
        ranking_id = f"RANK-{jd_id}-{int(datetime.now().timestamp())}"
        jd_location = jd_data.get("location", "Unknown")
        if isinstance(jd_location, dict):
            jd_location = jd_location.get("location_type", "Unknown")
        
        empty_result = {
            "ranking_id": ranking_id,
            "ranked_at": datetime.now().isoformat(),
            "jd_id": jd_id,
            "jd_title": jd_data.get("role_title", jd_data.get("job_title", "Unknown")),
            "jd_location": jd_location,
            "total_candidates_evaluated": 0,
            "ranked_candidates": [],
            "top_candidates": [],
            "acceptable_candidates": [],
            "not_recommended": [],
            "summary": f"No candidates matched the job title: {jd_data.get('role_title', jd_data.get('job_title', 'Unknown'))}. Available candidate titles: {', '.join([c.get('candidate_info', {}).get('target_job_title', 'N/A') for c in all_candidates])}"
        }
        
        # Save empty ranking
        rankings_dir = Path(__file__).parent.parent.parent / "data" / "rankings"
        rankings_dir.mkdir(parents=True, exist_ok=True)
        output_path = rankings_dir / f"{ranking_id}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(empty_result, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved empty ranking: {output_path}")
        return empty_result
    
    print(f"📊 Filtered to {len(candidates)} matching candidates (from {len(all_candidates)} total)")
    
    # Extract JD requirements
    jd_mandatory_skills = jd_data.get("requirements", {}).get("mandatory_skills", [])
    jd_good_to_have = jd_data.get("requirements", {}).get("good_to_have_skills", [])
    exp_range = jd_data.get("requirements", {}).get("experience", "")
    
    # Parse experience range (e.g., "5-10 years")
    try:
        exp_parts = exp_range.replace("years", "").replace("+", "").strip().split("-")
        exp_min = int(exp_parts[0].strip())
        exp_max = int(exp_parts[1].strip()) if len(exp_parts) > 1 else exp_min + 5
    except:
        exp_min, exp_max = 0, 100
    
    # Rank each candidate
    ranked_candidates = []
    
    for candidate in candidates:
        candidate_id = candidate.get("candidate_id", "")
        candidate_info = candidate.get("candidate_info", {})
        parsed_data = candidate.get("parsed_data", {})
        evaluation = candidate.get("evaluation", {})
        
        # Get candidate skills (combine all skill types)
        tech_skills = parsed_data.get("technical_skills", {})
        all_skills = []
        for skill_category in tech_skills.values():
            if isinstance(skill_category, list):
                all_skills.extend(skill_category)
        
        # Calculate skill matches
        mandatory_match = calculate_skill_match_score(all_skills, jd_mandatory_skills)
        good_to_have_match = calculate_skill_match_score(all_skills, jd_good_to_have)
        
        # Calculate experience score
        candidate_years = parsed_data.get("total_experience_years", 0)
        exp_result = calculate_experience_score(candidate_years, exp_min, exp_max)
        
        # Calculate total score
        mandatory_score = (mandatory_match["coverage_percent"] / 100) * 40
        good_to_have_score = (good_to_have_match["coverage_percent"] / 100) * 20
        experience_score = exp_result["score"]
        location_score = 10  # Assuming remote is always OK
        salary_score = 3  # Default
        
        total_score = mandatory_score + good_to_have_score + experience_score + location_score + salary_score
        
        # Determine recommendation
        if total_score >= 70:
            recommendation = "Highly Recommended"
        elif total_score >= 50:
            recommendation = "Recommended"
        else:
            recommendation = "Not Recommended"
        
        ranked_candidates.append({
            "candidate_id": candidate_id,
            "candidate_name": candidate_info.get("name", "Unknown"),
            "candidate_email": candidate_info.get("email", ""),
            "resume_evaluation_score": evaluation.get("final_score", 0),
            "match_score": {
                "mandatory_skills_score": round(mandatory_score, 1),
                "good_to_have_skills_score": round(good_to_have_score, 1),
                "experience_score": experience_score,
                "location_score": location_score,
                "salary_score": salary_score,
                "total_score": round(total_score, 1)
            },
            "skill_match": {
                "mandatory_matched": mandatory_match["matched"],
                "mandatory_missing": mandatory_match["missing"],
                "mandatory_coverage_percent": mandatory_match["coverage_percent"],
                "good_to_have_matched": good_to_have_match["matched"],
                "good_to_have_missing": good_to_have_match["missing"],
                "good_to_have_coverage_percent": good_to_have_match["coverage_percent"]
            },
            "experience_match": exp_result,
            "recommendation": recommendation,
            "justification": f"Score: {round(total_score, 1)}/100. Skills: {mandatory_match['coverage_percent']}% mandatory, {good_to_have_match['coverage_percent']}% optional. Experience: {exp_result['alignment']}."
        })
    
    # Sort by total score
    ranked_candidates.sort(key=lambda x: x["match_score"]["total_score"], reverse=True)
    
    # Add rank numbers
    for i, candidate in enumerate(ranked_candidates):
        candidate["rank"] = i + 1
    
    # Categorize candidates
    top_candidates = [c["candidate_id"] for c in ranked_candidates if c["match_score"]["total_score"] >= 70]
    acceptable_candidates = [c["candidate_id"] for c in ranked_candidates if 50 <= c["match_score"]["total_score"] < 70]
    not_recommended = [c["candidate_id"] for c in ranked_candidates if c["match_score"]["total_score"] < 50]
    
    # Create ranking output
    ranking_id = f"RANK-{jd_id}-{int(datetime.now().timestamp())}"
    
    # Handle location field (could be string or dict)
    jd_location = jd_data.get("location", "Unknown")
    if isinstance(jd_location, dict):
        jd_location = jd_location.get("location_type", "Unknown")
    
    result = {
        "ranking_id": ranking_id,
        "ranked_at": datetime.now().isoformat(),
        "jd_id": jd_id,
        "jd_title": jd_data.get("role_title", jd_data.get("job_title", "Unknown")),
        "jd_location": jd_location,
        "total_candidates_evaluated": len(ranked_candidates),
        "ranked_candidates": ranked_candidates,
        "top_candidates": top_candidates,
        "acceptable_candidates": acceptable_candidates,
        "not_recommended": not_recommended,
        "summary": f"{len(ranked_candidates)} candidates evaluated. {len(top_candidates)} highly recommended, {len(acceptable_candidates)} acceptable, {len(not_recommended)} not recommended."
    }
    
    # Save to file
    rankings_dir = Path(__file__).parent.parent.parent / "data" / "rankings"
    rankings_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = rankings_dir / f"{ranking_id}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Fast ranking saved to: {output_path}")
    print(f"📊 Total: {len(ranked_candidates)}, Top: {len(top_candidates)}, Acceptable: {len(acceptable_candidates)}, Not Recommended: {len(not_recommended)}")
    
    return result

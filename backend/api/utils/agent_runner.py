"""
Agent runner utility - updated to use smart ranking agent
"""

import sys
from pathlib import Path
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from typing import Any, Dict
from datetime import datetime
import json

# Add parent directory to Python path to import agents
parent_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(parent_dir))

# Import agents
from jd_parsing_agent import root_agent as jd_agent
from ranking_agent.smart_agent import root_agent as smart_ranking_agent
from communication_agent import root_agent as comm_agent


# ============================================================================
# JD Parsing Agent Runner
# ============================================================================

async def run_jd_parsing_agent(jd_text: str) -> Dict[str, Any]:
    """Run JD parsing agent with job description text"""
    try:
        session_service = InMemorySessionService()
        session = await session_service.create_session(user_id="api_user", app_name="jd_parsing")
        
        runner = Runner(
            agent=jd_agent,
            session_service=session_service,
            app_name="jd_parsing"
        )
        
        message = types.Content(
            role="user",
            parts=[types.Part.from_text(text=jd_text)]
        )
        
        print("🚀 Running JD parsing agent...")
        print(f"📝 JD Text Length: {len(jd_text)} characters")
        print(f"📝 JD Text Preview (first 200 chars): {jd_text[:200]}...")
        
        events = list(runner.run(
            new_message=message,
            user_id="api_user",
            session_id=session.id
        ))
        
        print(f"📊 Agent generated {len(events)} events")

        
        # The agent saves to file via callback, but state might be empty
        # Let's find the most recently created JD file
        jds_dir = Path(__file__).parent.parent.parent / "data" / "parsed_jds"
        
        if jds_dir.exists():
            jd_files = sorted(jds_dir.glob("JD-*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
            if jd_files:
                # Read the most recent file
                with open(jd_files[0], 'r', encoding='utf-8') as f:
                    parsed_jd = json.load(f)
                print(f"✅ Successfully read JD from file: {jd_files[0].name}")
                print(f"📊 JD Keys: {list(parsed_jd.keys())}")
                return parsed_jd
        
        # Fallback: try to get from session state
        parsed_jd = session.state.get("parsed_jd")
        print(f"📊 Session state keys: {list(session.state.keys())}")
        
        if not parsed_jd:
            print("⚠️ No 'parsed_jd' in session state and no files found!")
            raise ValueError("Agent failed to parse JD - no output in state or file")
        
        if hasattr(parsed_jd, 'model_dump'):
            parsed_jd = parsed_jd.model_dump()
        elif hasattr(parsed_jd, 'dict'):
            parsed_jd = parsed_jd.dict()
        
        print(f"✅ Successfully parsed JD from state. Keys: {list(parsed_jd.keys())}")
        return parsed_jd
        
    except Exception as e:
        print(f"❌ Error in run_jd_parsing_agent: {e}")
        import traceback
        traceback.print_exc()
        raise



# ============================================================================
# Smart Ranking Agent Runner (NEW!)
# ============================================================================

async def run_smart_ranking_agent(jd_id: str) -> Dict[str, Any]:
    """
    Run smart ranking agent with pre-parsed data
    
    Args:
        jd_id: Job description ID to rank candidates for
        
    Returns:
        Ranking data
    """
    try:
        # Load parsed JD
        jd_path = Path(__file__).parent.parent.parent / "data" / "parsed_jds" / f"{jd_id}.json"
        print(f"📂 Looking for JD at: {jd_path}")
        
        if not jd_path.exists():
            raise ValueError(f"Parsed JD not found: {jd_id} (expected at {jd_path})")
        
        with open(jd_path, 'r', encoding='utf-8') as f:
            jd_data = json.load(f)
        
        # Load all parsed resumes
        resumes_dir = Path(__file__).parent.parent.parent / "data" / "parsed_resumes"
        print(f"📂 Looking for resumes in: {resumes_dir}")
        
        if not resumes_dir.exists():
            raise ValueError(f"No parsed resumes directory found at: {resumes_dir}")
        
        candidate_files = list(resumes_dir.glob("CAND-*.json"))
        if not candidate_files:
            raise ValueError(f"No candidate resumes found in: {resumes_dir}")
        
        candidates_data = []
        for candidate_file in candidate_files:
            with open(candidate_file, 'r', encoding='utf-8') as f:
                candidates_data.append(json.load(f))
        
        print(f"✅ Loaded JD: {jd_id} - {jd_data.get('role_title', jd_data.get('job_title', 'Unknown'))}")
        print(f"✅ Loaded {len(candidates_data)} candidate resumes")
        
        # FILTER CANDIDATES BY JOB TITLE MATCH
        jd_role = jd_data.get("role_title", jd_data.get("job_title", "")).lower().strip()
        
        filtered_candidates = []
        for candidate in candidates_data:
            candidate_target = candidate.get("candidate_info", {}).get("target_job_title", "").lower().strip()
            
            # Simple matching: if JD role contains candidate target or vice versa
            if jd_role and candidate_target and (jd_role in candidate_target or candidate_target in jd_role):
                filtered_candidates.append(candidate)
                print(f"  ✓ Matched: {candidate.get('candidate_name', 'Unknown')} ({candidate_target}) for {jd_role}")
            else:
                print(f"  ✗ Skipped: {candidate.get('candidate_name', 'Unknown')} ({candidate_target}) - doesn't match {jd_role}")
        
        if not filtered_candidates:
            print(f"⚠️ No candidates matched job title: {jd_role}")
            print(f"Available candidates: {[c.get('candidate_info', {}).get('target_job_title', 'N/A') for c in candidates_data]}")
            
            # Save empty ranking with clear message
            ranking_id = f"RANK-{jd_id}-{int(datetime.now().timestamp())}"
            
            jd_location = jd_data.get("location", "Unknown")
            if isinstance(jd_location, dict):
                jd_location = jd_location.get("location_type", "Unknown")
            
            empty_ranking = {
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
                "summary": f"No candidates matched the job title: {jd_data.get('role_title', jd_data.get('job_title', 'Unknown'))}. Available candidate titles: {', '.join([c.get('candidate_info', {}).get('target_job_title', 'N/A') for c in candidates_data])}"
            }
            
            # Save to file
            rankings_dir = Path(__file__).parent.parent.parent / "data" / "rankings"
            rankings_dir.mkdir(parents=True, exist_ok=True)
            output_path = rankings_dir / f"{ranking_id}.json"
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(empty_ranking, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Saved empty ranking: {output_path}")
            
            return {"status": "completed", "ranking_id": ranking_id}
        
        print(f"📊 Filtered to {len(filtered_candidates)} matching candidates (from {len(candidates_data)} total)")
        
        # Create session with pre-loaded data in state
        session_service = InMemorySessionService()
        session = await session_service.create_session(user_id="api_user", app_name="ranking")
        
        # Inject parsed data into session state (as Python objects, not JSON strings)
        session.state["jd_data"] = jd_data
        session.state["candidates_data"] = filtered_candidates  # Only pass filtered candidates
        session.state["jd_id"] = jd_id
        session.state["jd_title"] = jd_data.get("role_title", jd_data.get("job_title", "Unknown"))
        
        # Handle location field safely
        jd_location = jd_data.get("location", "Unknown")
        if isinstance(jd_location, dict):
            jd_location = jd_location.get("location_type", "Unknown")
        session.state["jd_location"] = jd_location
        
        print(f"📝 Injected data into session state")
        
        # Create runner
        runner = Runner(
            agent=smart_ranking_agent,
            session_service=session_service,
            app_name="ranking"
        )
        
        # Simple message to trigger the agent
        message = types.Content(
            role="user",
            parts=[types.Part.from_text(text=f"Rank all candidates for job {jd_id}")]
        )
        
        # Run agent (single LLM call!)
        print(f"🚀 Running smart ranking agent (AI-powered analysis)...")
        events = list(runner.run(
            new_message=message,
            user_id="api_user",
            session_id=session.id
        ))
        
        print(f"✅ Agent execution completed, processed {len(events)} events")
        
        # Get ranking output from session state (agent saves with output_key)
        ranking_output = session.state.get("ranking_output")
        
        if not ranking_output:
            print(f"⚠️  No ranking output in session state!")
            print(f"📊 Session state keys: {list(session.state.keys())}")
            # Try to get from the last event
            for event in reversed(events):
                if hasattr(event, 'content') and event.content:
                    for part in event.content.parts:
                        if hasattr(part, 'text') and part.text:
                            try:
                                import json as json_lib
                                ranking_output = json_lib.loads(part.text)
                                print(f"✅ Found ranking in event text")
                                break
                            except:
                                pass
                if ranking_output:
                    break
        
        if not ranking_output:
            raise ValueError("Agent completed but produced no ranking output")
        
        # Convert Pydantic to dict if needed
        if hasattr(ranking_output, 'model_dump'):
            ranking_data = ranking_output.model_dump()
        elif hasattr(ranking_output, 'dict'):
            ranking_data = ranking_output.dict()
        else:
            ranking_data = ranking_output
        
        # Save ranking to file
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
            "jd_title": jd_data.get("job_title", "Unknown"),
            "jd_location": jd_location,
            "total_candidates_evaluated": len(ranked_list),
            "ranked_candidates": ranked_list,
            "top_candidates": top_candidates,
            "acceptable_candidates": acceptable,
            "not_recommended": not_recommended,
            "summary": f"{len(ranked_list)} candidates evaluated. {len(top_candidates)} highly recommended, {len(acceptable)} acceptable, {len(not_recommended)} not recommended."
        }
        
        # Save to file
        rankings_dir = Path(__file__).parent.parent.parent / "data" / "rankings"
        rankings_dir.mkdir(parents=True, exist_ok=True)
        
        output_path = rankings_dir / f"{ranking_id}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(document, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Ranking saved: {output_path}")
        print(f"📊 Total: {len(ranked_list)}, Top: {len(top_candidates)}, Acceptable: {len(acceptable)}, Not Rec: {len(not_recommended)}")
        
        return {"status": "completed", "ranking_id": ranking_id}
        
    except Exception as e:
        print(f"❌ Error in run_smart_ranking_agent: {e}")
        import traceback
        traceback.print_exc()
        raise


# ============================================================================
# Communication Agent Runner
# ============================================================================

async def run_communication_agent(ranking_id: str) -> Dict[str, Any]:
    """Run communication agent to send emails for a ranking"""
    session_service = InMemorySessionService()
    session = await session_service.create_session(user_id="api_user", app_name="communication")
    
    runner = Runner(
        agent=comm_agent,
        session_service=session_service,
        app_name="communication"
    )
    
    message = types.Content(
        role="user",
        parts=[types.Part.from_text(text=f"Send shortlist emails for {ranking_id}")]
    )
    
    events = list(runner.run(
        new_message=message,
        user_id="api_user",
        session_id=session.id
    ))
    
    comm_result = session.state.get("communication_result")
    
    if not comm_result:
        raise ValueError("Agent failed to send emails - no output in state")
    
    if hasattr(comm_result, 'model_dump'):
        comm_result = comm_result.model_dump()
    
    return comm_result

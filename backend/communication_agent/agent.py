"""
Communication Agent

Sends personalized shortlist emails to candidates who have been selected
from the ranking agent's output.
"""

import json
from pathlib import Path
from datetime import datetime
from google.adk.agents import Agent
from google.genai import types as genai_types

from .schemas import CommunicationOutput
from .tools import (
    load_ranking_by_id,
    load_jd_by_id,
    send_shortlist_email,
    log_communication
)


# ============================================================================
# Callback for Saving Communication Logs
# ============================================================================

def save_communication_log(callback_context):
    """
    Callback to save communication results to local JSON file after agent completes.
    """
    try:
        # Get the communication data from state
        comm_data = callback_context.state.get("communication_result")
        
        if not comm_data:
            print("⚠️ No communication_result in state")
            return
        
        # Convert to dict if it's a Pydantic model
        if hasattr(comm_data, 'model_dump'):
            comm_dict = comm_data.model_dump()
        else:
            comm_dict = comm_data
        
        # Save using the log_communication tool
        result = log_communication(comm_dict)
        
        if result.get("status") == "success":
            print(f"✅ Communication log saved: {result.get('file_path')}")
            print(f"📧 Emails Sent: {comm_dict.get('total_sent', 0)}")
            print(f" Failed: {comm_dict.get('total_failed', 0)}")
        else:
            print(f"⚠️ Error saving log: {result.get('error')}")
    
    except Exception as e:
        print(f"⚠️ Error in callback: {e}")
        import traceback
        traceback.print_exc()


# ============================================================================
# Main Agent Definition
# ============================================================================

communication_agent = Agent(
    name="communication_agent",
    model="gemini-2.5-flash",
    description="Sends personalized shortlist emails to candidates who have been selected from ranking results. Loads ranking data, fetches job details, and sends professional emails via SendGrid.",
    
    instruction="""
# Communication Agent

You are responsible for sending shortlist emails to selected candidates.

## Your Task

When given a ranking ID (e.g., "RANK-JD-2025-002-TEST"):

1. **Load Ranking Data**:
   - Call `load_ranking_by_id(ranking_id)` to get the ranking results
   - Identify shortlisted candidates from `top_candidates` and `acceptable_candidates` lists
   
2. **Load Job Details**:
   - Extract `jd_id` from the ranking data
   - Call `load_jd_by_id(jd_id)` to get job description details

3. **For EACH Shortlisted Candidate**:
   - Find their full details in the `ranked_candidates` list
   - Extract: `candidate_email`, `candidate_name`, `candidate_id`
   - Get their top matched skills from `skill_match.mandatory_matched` (first 5 skills)
   - Call `send_shortlist_email(email, name, role_title, company_name, top_skills)`
   - Record the result (sent/failed, message_id, timestamp)

4. **Generate Output**:
   - Create `CommunicationOutput` with all email records
   - Include summary statistics (total sent, failed)
   - Generate a brief summary message

## Important Notes

- Only email candidates in `top_candidates` and `acceptable_candidates`
- Do NOT email candidates in `not_recommended`
- If `send_shortlist_email` returns status="failed", record the error but continue with other candidates
- Use the exact `role_title` from the JD data
- Company name is "Onix Center of Excellence"

## Example Workflow

1. Load ranking → Get shortlisted candidate IDs
2. Load JD → Get role title
3. For each shortlisted candidate → Send email → Record result
4. Return structured JSON with all results

Your output must match the CommunicationOutput schema exactly.
""",
    
    output_schema=CommunicationOutput,
    output_key="communication_result",
    
    # Tools
    tools=[
        load_ranking_by_id,
        load_jd_by_id,
        send_shortlist_email,
        log_communication
    ],
    
    # Generation config for structured output
    generate_content_config=genai_types.GenerateContentConfig(
        temperature=0.1,  # Low temperature for consistent, deterministic output
        max_output_tokens=8192,
    ),
    
    # Each communication is independent
    include_contents="none",
    
    # Disable delegation
    disallow_transfer_to_peers=True,
    disallow_transfer_to_parent=True,
    
    # Callback to save results
    after_agent_callback=save_communication_log
)


# Export as root_agent for ADK discovery
root_agent = communication_agent

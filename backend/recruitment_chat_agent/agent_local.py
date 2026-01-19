"""
Local Testing Agent - Uses local JSON files instead of GCS
"""

from google.adk.agents import Agent
from .tools_local import (
    query_jobs_local,
    query_candidates_local, 
    get_candidate_rankings_local,
    get_recruitment_stats_local
)


# Local Testing RAG Agent  
recruitment_rag_agent_local = Agent(
    name="recruitment_analytics_local",
    model="gemini-2.5-flash",
    instruction="""
    You are an intelligent Recruitment Analytics Assistant.
    
    You help HR teams and recruiters by answering questions about:
    - Open job positions and requirements
    - Candidate profiles and resumes
    - Candidate rankings and match scores
    - Recruitment statistics and insights
    
    **Data Source:** Local JSON files in data/ folders.
    
    **When answering questions:**
    1. Use the appropriate tools to fetch data
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
        query_jobs_local,
        query_candidates_local,
        get_candidate_rankings_local,
        get_recruitment_stats_local
    ],
    description="Local testing RAG agent for recruitment analytics with local file access"
)

# Export for testing
root_agent = recruitment_rag_agent_local

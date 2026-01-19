"""
Recruitment Chat Agent

This package contains an AI agent for answering recruitment analytics queries using RAG.

Agent: recruitment_analytics_rag_agent

Description: Intelligent assistant for querying recruitment data from Google Cloud Storage.

Capabilities:
- Query job descriptions and openings
- Search candidate resumes
- Get candidate rankings for specific jobs
- Provide recruitment statistics

Data Source: Google Cloud Storage (GCS)
"""

from .agent import recruitment_rag_agent, root_agent

__all__ = ['recruitment_rag_agent', 'root_agent']


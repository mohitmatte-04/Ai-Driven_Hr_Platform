"""
Pydantic schemas for Communication Agent output
"""

from pydantic import BaseModel, Field
from typing import Optional


class EmailRecord(BaseModel):
    """Record of a single email sent to a candidate"""
    candidate_id: str = Field(description="Unique candidate identifier")
    email: str = Field(description="Candidate's email address")
    candidate_name: str = Field(description="Candidate's full name")
    type: str = Field(description="Email type: 'shortlist' or 'rejection'")
    status: str = Field(description="Delivery status: 'sent' or 'failed'")
    message_id: Optional[str] = Field(default=None, description="SendGrid message ID for tracking")
    sent_at: str = Field(description="ISO timestamp when email was sent")
    error_message: Optional[str] = Field(default=None, description="Error message if sending failed")


class CommunicationOutput(BaseModel):
    """Output schema for communication agent"""
    communication_id: str = Field(description="Unique communication batch identifier")
    job_id: str = Field(description="Job description ID")
    job_title: str = Field(description="Job role title")
    emails_sent: list[EmailRecord] = Field(description="List of all emails sent in this batch")
    total_shortlisted: int = Field(description="Total number of shortlisted candidates")
    total_sent: int = Field(description="Total emails successfully sent")
    total_failed: int = Field(description="Total emails that failed to send")
    summary: str = Field(description="Brief summary of the communication batch")

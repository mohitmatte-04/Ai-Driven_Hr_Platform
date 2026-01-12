"""
Tool functions for Communication Agent
"""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Content


# ============================================================================
# Data Loading Tools
# ============================================================================

def load_ranking_by_id(ranking_id: str) -> dict:
    """
    Load ranking data from data/rankings/{ranking_id}.json
    
    Args:
        ranking_id: The ranking ID (e.g., "RANK-JD-2025-002-TEST")
    
    Returns:
        Dictionary containing ranking data with shortlisted candidates
    """
    try:
        ranking_path = Path(__file__).parent.parent / "data" / "rankings" / f"{ranking_id}.json"
        
        if not ranking_path.exists():
            return {
                "error": f"Ranking file not found: {ranking_id}",
                "available_rankings": [
                    f.stem for f in (Path(__file__).parent.parent / "data" / "rankings").glob("*.json")
                ]
            }
        
        with open(ranking_path, 'r', encoding='utf-8') as f:
            ranking_data = json.load(f)
        
        return ranking_data
    
    except Exception as e:
        return {"error": f"Failed to load ranking: {str(e)}"}


def load_jd_by_id(jd_id: str) -> dict:
    """
    Load job description from data/parsed_jds/{jd_id}.json
    
    Args:
        jd_id: The job description ID (e.g., "JD-2025-002")
    
    Returns:
        Dictionary containing job details
    """
    try:
        jd_path = Path(__file__).parent.parent / "data" / "parsed_jds" / f"{jd_id}.json"
        
        if not jd_path.exists():
            return {"error": f"Job description not found: {jd_id}"}
        
        with open(jd_path, 'r', encoding='utf-8') as f:
            jd_data = json.load(f)
        
        return jd_data
    
    except Exception as e:
        return {"error": f"Failed to load JD: {str(e)}"}


# ============================================================================
# Email Sending Tool
# ============================================================================

def send_shortlist_email(
    candidate_email: str,
    candidate_name: str,
    role_title: str,
    company_name: str = "Onix Center of Excellence",
    top_skills: list[str] = None
) -> dict:
    """
    Send personalized shortlist email to a candidate using SMTP or SendGrid
    
    Supports two methods:
    1. SMTP (default) - Uses standard email servers (Gmail, Outlook, etc.)
    2. SendGrid - Uses SendGrid API if SENDGRID_API_KEY is provided
    
    Args:
        candidate_email: Candidate's email address
        candidate_name: Candidate's full name
        role_title: Job title/role
        company_name: Company name (default: "Onix Center of Excellence")
        top_skills: List of top matched skills to highlight
    
    Returns:
        Dictionary with status, message_id, and timestamp
    """
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    try:
        # Get email configuration from environment
        from_email = os.getenv("FROM_EMAIL", "recruitment@onix-coe.com")
        from_name = os.getenv("FROM_NAME", "Onix Recruitment Team")
        
        # Format matched skills
        skills_text = ", ".join(top_skills[:5]) if top_skills else "your background"
        
        # Create email content
        subject = f"Exciting Opportunity at {company_name} - {role_title}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">Congratulations, {candidate_name}!</h2>
                
                <p>We are pleased to inform you that your profile has been <strong>shortlisted</strong> for the <strong>{role_title}</strong> position at {company_name}.</p>
                
                <p>We were particularly impressed by your experience in <strong>{skills_text}</strong> and believe you would be a great addition to our team.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                    <h3 style="color: #007bff; margin-top: 0;">Next Steps</h3>
                    <ul>
                        <li>Our recruitment team will contact you within 2-3 business days</li>
                        <li>We will schedule a technical interview at a mutually convenient time</li>
                        <li>Please keep an eye on your inbox for further communication</li>
                    </ul>
                </div>
                
                <p>If you have any questions in the meantime, please feel free to reach out to us.</p>
                
                <p>We look forward to speaking with you!</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>{from_name}</strong><br>
                    {company_name}
                </p>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 30px;">
                <p style="font-size: 12px; color: #888;">
                    This is an automated message from our recruitment system. 
                    Please do not reply directly to this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        # Check which email service to use
        sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        smtp_host = os.getenv("SMTP_HOST")
        
        if sendgrid_api_key:
            # Use SendGrid
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail
            
            message = Mail(
                from_email=(from_email, from_name),
                to_emails=candidate_email,
                subject=subject,
                html_content=html_content
            )
            
            sg = SendGridAPIClient(sendgrid_api_key)
            response = sg.send(message)
            
            return {
                "status": "sent",
                "method": "sendgrid",
                "message_id": response.headers.get("X-Message-Id", "unknown"),
                "sent_at": datetime.now().isoformat(),
                "recipient": candidate_email
            }
        
        elif smtp_host:
            # Use SMTP
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_user = os.getenv("SMTP_USER", from_email)
            smtp_password = os.getenv("SMTP_PASSWORD")
            smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
            
            if not smtp_password:
                return {
                    "status": "failed",
                    "error": "SMTP_PASSWORD not configured in environment",
                    "sent_at": datetime.now().isoformat()
                }
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{from_name} <{from_email}>"
            msg['To'] = candidate_email
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send via SMTP
            if smtp_use_tls:
                server = smtplib.SMTP(smtp_host, smtp_port)
                server.starttls()
            else:
                server = smtplib.SMTP_SSL(smtp_host, smtp_port)
            
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
            server.quit()
            
            return {
                "status": "sent",
                "method": "smtp",
                "message_id": f"smtp-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "sent_at": datetime.now().isoformat(),
                "recipient": candidate_email
            }
        
        else:
            return {
                "status": "failed",
                "error": "No email service configured. Please set either SENDGRID_API_KEY or SMTP_HOST in environment",
                "sent_at": datetime.now().isoformat()
            }
    
    except Exception as e:
        return {
            "status": "failed",
            "error": str(e),
            "sent_at": datetime.now().isoformat(),
            "recipient": candidate_email
        }


# ============================================================================
# Communication Logging Tool
# ============================================================================

def log_communication(communication_data: dict) -> dict:
    """
    Save communication log to data/communications/{comm_id}.json
    
    Args:
        communication_data: Dictionary containing communication details
    
    Returns:
        Dictionary with save status and file path
    """
    try:
        # Create communications directory if  it doesn't exist
        comm_dir = Path(__file__).parent.parent / "data" / "communications"
        comm_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate communication ID if not provided
        if "communication_id" not in communication_data:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            communication_data["communication_id"] = f"COMM-{timestamp}"
        
        # Add logging metadata
        communication_data["logged_at"] = datetime.now().isoformat()
        
        # Save to file
        comm_id = communication_data["communication_id"]
        file_path = comm_dir / f"{comm_id}.json"
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(communication_data, f, indent=2, ensure_ascii=False)
        
        return {
            "status": "success",
            "message": f"Communication log saved to {file_path}",
            "file_path": str(file_path),
            "communication_id": comm_id
        }
    
    except Exception as e:
        return {
            "status": "failed",
            "error": f"Failed to log communication: {str(e)}"
        }

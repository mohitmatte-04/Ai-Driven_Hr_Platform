"""
Resume API Router
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pathlib import Path
import json
import subprocess
from typing import List
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import sys
import PyPDF2

from ..models import ResumeParseResponse, BatchResumeParseResponse, CandidateListItem

router = APIRouter()

# Path to data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "parsed_resumes"
RESUME_DIR = Path(__file__).parent.parent.parent / "data" / "resumes"

# Add parent directory to import agents
parent_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(parent_dir))

from resume_parsing_agent import root_agent as resume_agent


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extract text content from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")


@router.post("/upload", response_model=List[ResumeParseResponse])
async def upload_resumes(
    files: List[UploadFile] = File(..., description="Upload up to 5 PDF resumes")
):
    """
    Upload and parse up to 5 resume PDFs
    
    **Input:** List of PDF files (maximum 5 files)
    
    **Output:** Parsed candidate data for each resume
    
    **Note:** In Swagger UI, click "Add string item" multiple times to upload multiple files.
    Alternatively, use the "Try it out" feature and manually add multiple file inputs.
    """
    # Validate file count
    if len(files) > 5:
        raise HTTPException(
            status_code=400,
            detail="Maximum 5 resumes allowed per upload"
        )
    
    # Validate file types
    for file in files:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail=f"Only PDF files are allowed. Invalid file: {file.filename}"
            )
    
    # Create resumes directory if it doesn't exist
    RESUME_DIR.mkdir(parents=True, exist_ok=True)
    
    results = []
    
    for file in files:
        try:
            # Save uploaded file
            file_path = RESUME_DIR / file.filename
            with open(file_path, 'wb') as f:
                content = await file.read()
                f.write(content)
            
            # Extract text from PDF - THIS IS THE FIX!
            resume_text = extract_text_from_pdf(file_path)
            
            if not resume_text or len(resume_text) < 50:
                raise ValueError(f"PDF appears to be empty or unreadable: {file.filename}")
            
            # Parse resume using agent with ACTUAL TEXT CONTENT
            session_service = InMemorySessionService()
            session = await session_service.create_session(
                user_id="api_user",
                app_name="resume_parsing"
            )
            
            runner = Runner(
                agent=resume_agent,
                session_service=session_service,
                app_name="resume_parsing"
            )
            
            # Send the ACTUAL RESUME TEXT to the agent, not just the filename!
            message = types.Content(
                role="user",
                parts=[types.Part.from_text(
                    text=f"Parse this resume and extract all information accurately:\n\n{resume_text}"
                )]
            )
            
            # Run agent
            events = list(runner.run(
                new_message=message,
                user_id="api_user",
                session_id=session.id
            ))
            
            
            # Get parsed data from session state - correct key is "parsed_resume_evaluation"
            parsed_resume = session.state.get("parsed_resume_evaluation")
            
            if not parsed_resume:
                raise ValueError(f"Failed to parse resume: {file.filename}")
            
            # Convert Pydantic model to dict if needed
            if hasattr(parsed_resume, 'model_dump'):
                parsed_resume = parsed_resume.model_dump()
            
            # Extract candidate info from the nested structure
            candidate_info = parsed_resume.get("candidate_info", {})
            evaluation = parsed_resume.get("evaluation", {})
            
            results.append(ResumeParseResponse(
                success=True,
                candidate_id=parsed_resume.get("candidate_id", ""),
                candidate_name=candidate_info.get("name", "Unknown"),
                candidate_email=candidate_info.get("email", ""),
                message=f"Resume parsed successfully: {file.filename} (Score: {evaluation.get('final_score', 0)}/100)"
            ))
            
        except Exception as e:
            results.append(ResumeParseResponse(
                success=False,
                candidate_id="",
                candidate_name="",
                candidate_email="",
                message=f"Failed to parse {file.filename}: {str(e)}"
            ))
    
    return results


@router.post("/batch", response_model=BatchResumeParseResponse)
async def batch_parse_resumes():
    """
    Parse all resumes in data/resumes/ folder
    
    **Output:** Summary of batch processing
    """
    try:
        # Run batch processor
        batch_script = Path(__file__).parent.parent.parent / "resume_parsing_agent" / "batch_processor.py"
        
        result = subprocess.run(
            ["python", str(batch_script)],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            raise Exception(f"Batch processing failed: {result.stderr}")
        
        # Count processed candidates
        candidate_ids = []
        if DATA_DIR.exists():
            candidate_ids = [f.stem for f in DATA_DIR.glob("*.json")]
        
        return BatchResumeParseResponse(
            success=True,
            total_processed=len(candidate_ids),
            successful=len(candidate_ids),
            failed=0,
            candidates=candidate_ids
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to batch parse resumes: {str(e)}"
        )


@router.get("/list")
async def list_candidates():
    """
    Get all parsed candidates with full details
    
    **Output:** List of all candidates with complete parsed data
    """
    try:
        candidates = []
        
        if not DATA_DIR.exists():
            return []
        
        for candidate_file in DATA_DIR.glob("*.json"):
            with open(candidate_file, 'r', encoding='utf-8') as f:
                candidate_data = json.load(f)
                candidates.append(candidate_data)
        
        return candidates
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list candidates: {str(e)}"
        )


@router.get("/{candidate_id}")
async def get_candidate(candidate_id: str):
    """
    Get specific candidate by ID
    
    **Input:** Candidate ID (e.g., CAND-001)
    
    **Output:** Full candidate data
    """
    try:
        candidate_file = DATA_DIR / f"{candidate_id}.json"
        
        if not candidate_file.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Candidate not found: {candidate_id}"
            )
        
        with open(candidate_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get candidate: {str(e)}"
        )

"""
JD (Job Description) API Router with PDF support
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pathlib import Path
import json
from typing import List
from PyPDF2 import PdfReader
import io

from ..models import JDParseRequest, JDParseResponse, JDListItem, ErrorResponse
from ..utils import run_jd_parsing_agent

router = APIRouter()

# Path to data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "parsed_jds"


def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")


@router.put("/{jd_id}")
async def update_jd(jd_id: str, updates: dict):
    """
    Update JD details (status, etc.)
    
    **Input:** JD ID and fields to update
    
    **Output:** Updated JD data
    """
    try:
        jd_file = DATA_DIR / f"{jd_id}.json"
        
        if not jd_file.exists():
            raise HTTPException(status_code=404, detail=f"JD not found: {jd_id}")
        
        # Read existing data
        with open(jd_file, 'r', encoding='utf-8') as f:
            jd_data = json.load(f)
        
        # Update fields
        for key, value in updates.items():
            if key in jd_data:
                jd_data[key] = value
        
        # Save updated data
        with open(jd_file, 'w', encoding='utf-8') as f:
            json.dump(jd_data, f, indent=2, ensure_ascii=False)
        
        return {"success": True, "message": "JD updated successfully", "data": jd_data}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update JD: {str(e)}"
        )



@router.post("/parse", response_model=JDParseResponse)
async def parse_jd(request: JDParseRequest):
    """
    Parse job description from text
    
    **Input:** Job description text
    
    **Output:** Structured JD data with skills, experience, location
    """
    try:
        # Run JD parsing agent
        result = await run_jd_parsing_agent(request.jd_text)
        
        # Convert result to response model
        return JDParseResponse(
            success=True,
            jd_id=result.get("job_id"),
            role_title=result.get("role_title"),
            experience_min=result.get("experience_min", 0),
            experience_max=result.get("experience_max", 0),
            location=result.get("location", "Unspecified"),
            mandatory_skills=result.get("mandatory_skills", []),
            good_to_have_skills=result.get("good_to_have_skills", []),
            message="Job description parsed successfully"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse JD: {str(e)}"
        )


@router.post("/parse-file", response_model=JDParseResponse)
async def parse_jd_file(file: UploadFile = File(...)):
    """
    Parse job description from uploaded file (PDF, TXT, DOCX)
    
    **Input:** Uploaded file
    
    **Output:** Structured JD data
    """
    try:
        # Read file content
        file_content = await file.read()
        
        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            jd_text = extract_text_from_pdf(file_content)
        elif file.filename.endswith('.txt'):
            jd_text = file_content.decode('utf-8')
        elif file.filename.endswith(('.docx', '.doc')):
            # For DOCX support, we'd need python-docx library
            raise HTTPException(status_code=400, detail="DOCX files not supported yet. Please use PDF or TXT.")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF or TXT file.")
        
        if not jd_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")
        
        # Run JD parsing agent
        result = await run_jd_parsing_agent(jd_text)
        
        # Convert result to response model
        return JDParseResponse(
            success=True,
            jd_id=result.get("job_id"),
            role_title=result.get("role_title"),
            experience_min=result.get("experience_min", 0),
            experience_max=result.get("experience_max", 0),
            location=result.get("location", "Unspecified"),
            mandatory_skills=result.get("mandatory_skills", []),
            good_to_have_skills=result.get("good_to_have_skills", []),
            message=f"Job description parsed successfully from {file.filename}"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse JD file: {str(e)}"
        )


@router.get("/list", response_model=List[JDListItem])
async def list_jds():
    """
    Get all parsed job descriptions
    
    **Output:** List of all JDs with basic info
    """
    try:
        jds = []
        
        if not DATA_DIR.exists():
            return []
        
        for jd_file in DATA_DIR.glob("*.json"):
            with open(jd_file, 'r', encoding='utf-8') as f:
                jd_data = json.load(f)
                jds.append(JDListItem(
                    jd_id=jd_data.get("job_id"),
                    role_title=jd_data.get("role_title"),
                    location=jd_data.get("location", "Unspecified"),
                    created_at=jd_data.get("created_at", ""),
                    status=jd_data.get("status", "active")
                ))
        
        return jds
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list JDs: {str(e)}"
        )


@router.get("/{jd_id}")
async def get_jd(jd_id: str):
    """
    Get specific JD by ID
    
    **Input:** JD ID (e.g., JD-2025-002)
    
    **Output:** Full JD data
    """
    try:
        jd_file = DATA_DIR / f"{jd_id}.json"
        
        if not jd_file.exists():
            raise HTTPException(status_code=404, detail=f"JD not found: {jd_id}")
        
        with open(jd_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get JD: {str(e)}"
        )

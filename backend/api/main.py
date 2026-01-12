"""
Recruitment Automation REST API

FastAPI backend for AI-powered recruitment workflow automation
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .routers import jd_router, resume_router, ranking_router, communication_router
from .models import HealthResponse

# Create FastAPI app
app = FastAPI(
    title="Recruitment Automation API",
    description="REST API for AI-powered recruitment workflow with job description parsing, resume processing, candidate ranking, and automated communication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js default
        "http://localhost:3001",  # Alternative port
        "http://localhost:8000",  # ADK web ui
        "*"  # Allow all for development (restrict in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(
    jd_router,
    prefix="/api/jd",
    tags=["Job Descriptions"]
)

app.include_router(
    resume_router,
    prefix="/api/resume",
    tags=["Resumes"]
)

app.include_router(
    ranking_router,
    prefix="/api/ranking",
    tags=["Rankings"]
)

app.include_router(
    communication_router,
    prefix="/api/communication",
    tags=["Communications"]
)


# Root endpoint
@app.get("/", response_model=dict)
async def root():
    """
    API root endpoint
    
    **Returns:** Welcome message and links to documentation
    """
    return {
        "message": "Recruitment Automation API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "jd": "/api/jd",
            "resume": "/api/resume",
            "ranking": "/api/ranking",
            "communication": "/api/communication"
        }
    }


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    **Returns:** API health status
    """
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.now().isoformat()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )

# Multi-Agent AI Recruitment Platform

Production-ready recruitment automation using Google ADK and Firebase.

## Project Structure

```
recruitment_platform/
├── jd_parsing_agent/          # Job description parsing agent
├── resume_parsing_agent/      # Resume extraction agent
├── ranking_agent/             # Candidate ranking & matching
├── communication_agent/       # Shortlisting & email notifications
├── shared/                    # Shared utilities and schemas
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variable template
└── README.md                 # This file
```

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Firebase

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your credentials
```

### 3. Run Agents

```bash
# Test JD parsing agent
cd jd_parsing_agent
adk web

# Access at http://localhost:8000
```

## Tech Stack

- **Agent Framework**: Google ADK
- **LLM**: Gemini 2.5 Flash/Pro  
- **Database**: Firebase Firestore
- **Backend**: FastAPI
- **Email**: SendGrid
- **Deployment**: Cloud Run

## Development Phases

- **Phase 1**: JD & Resume Parsing (Current)
- **Phase 2**: Ranking Engine
- **Phase 3**: Communication & Automation
- **Phase 4**: Advanced Features

## Documentation

See `/docs` for detailed agent specifications and API documentation.

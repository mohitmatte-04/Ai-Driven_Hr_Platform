# Recruitment Automation API

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start API Server

```bash
# Option 1: Using uvicorn directly
uvicorn api.main:app --reload --port 8001

# Option 2: Using Python
python -m api.main
```

The API will start at: **http://localhost:8001**

### 3. Access Documentation

- **Interactive Docs:** http://localhost:8001/docs (Swagger UI)
- **Alternative Docs:** http://localhost:8001/redoc (ReDoc)

## API Endpoints

### Job Descriptions

- `POST /api/jd/parse` - Parse job description from text
- `GET /api/jd/list` - Get all parsed JDs
- `GET /api/jd/{jd_id}` - Get specific JD

### Resumes

- `POST /api/resume/batch` - Batch parse all resumes in data/resumes/
- `GET /api/resume/list` - Get all parsed candidates
- `GET /api/resume/{candidate_id}` - Get specific candidate

### Rankings

- `POST /api/ranking/rank/{jd_id}` - Rank candidates for a JD
- `GET /api/ranking/list` - Get all rankings
- `GET /api/ranking/{ranking_id}` - Get specific ranking

### Communications

- `POST /api/communication/send/{ranking_id}` - Send shortlist emails
- `GET /api/communication/list` - Get communication history
- `GET /api/communication/{communication_id}` - Get specific communication

## Testing

### Test with curl

```bash
# 1. Parse JD
curl -X POST "http://localhost:8001/api/jd/parse" \
  -H "Content-Type: application/json" \
  -d '{"jd_text": "Senior Backend Engineer with 5+ years Python..."}'

# 2. Batch parse resumes
curl -X POST "http://localhost:8001/api/resume/batch"

# 3. Rank candidates
curl -X POST "http://localhost:8001/api/ranking/rank/JD-2025-002"

# 4. Send emails
curl -X POST "http://localhost:8001/api/communication/send/RANK-JD-2025-002-TEST"
```

### Test with Swagger UI

1. Open http://localhost:8001/docs
2. Click "Try it out" on any endpoint
3. Fill in parameters
4. Click "Execute"

## Environment Variables

Ensure your `.env` file has:

```bash
# Google Gemini API
GOOGLE_API_KEY=your-api-key

# Email (SMTP or SendGrid)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Your Company Recruitment
```

## CORS Configuration

The API allows requests from:
- http://localhost:3000 (Next.js default)
- http://localhost:3001
- http://localhost:8000 (ADK web UI)

To add more origins, edit `api/main.py` → `allow_origins`

## Project Structure

```
api/
├── __init__.py
├── main.py              # FastAPI app
├── models/
│   ├── __init__.py
│   └── responses.py    # Pydantic models
├── routers/
│   ├── __init__.py
│   ├── jd.py
│   ├── resume.py
│   ├── ranking.py
│   └── communication.py
└── utils/
    ├── __init__.py
    └── agent_runner.py # ADK agent execution
```

## Next Steps

1. Start the API server
2. Test endpoints with Swagger UI
3. Build frontend dashboard
4. Deploy to production

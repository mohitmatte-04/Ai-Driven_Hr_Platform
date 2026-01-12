# JD Parsing Agent

Extracts structured data from unstructured job descriptions using Gemini 2.5 Flash.

## Features

- ✅ Structured JSON output with Pydantic validation
- ✅ Skill normalization (Py → Python, k8s → Kubernetes)
- ✅ Automatic skill classification (mandatory vs. good-to-have)
- ✅ Profile type detection (Technical/Non-Technical/Leadership)
- ✅ Firebase Firestore integration
- ✅ Automatic job ID generation

## Usage

### Test Locally with ADK Web UI

```bash
cd jd_parsing_agent
adk web
```

Access at: http://localhost:8000

### Test Programmatically

```python
from jd_parsing_agent import root_agent
from google.adk.runners import Runner

runner = Runner(agent=root_agent)
result = await runner.run_async(user_content="<your JD text here>")
```

## Environment Setup

Make sure `.env` file exists in project root with:

```bash
GOOGLE_API_KEY=your-gemini-api-key
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

## Output Schema

```json
{
  "job_id": "JD-2025-001",
  "role_title": "Senior Backend Engineer",
  "experience_min": 5,
  "experience_max": 8,
  "location": "Bangalore",
  "relocation_allowed": true,
  "salary_min": 2000000,
  "salary_max": 3500000,
  "mandatory_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes"],
  "good_to_have_skills": ["React", "AWS", "Terraform"],
  "profile_type": "Technical"
}
```

## Testing

Test with the provided `sample_jd.md`:

```bash
python agent.py
```

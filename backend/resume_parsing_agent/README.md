# Resume Parsing Agent

Extracts and structures candidate information from resumes (PDF, DOCX, TXT) using Gemini 2.5 Flash for intelligent parsing and normalization.

## Use Case

This agent processes candidate resumes to extract structured data including personal information, education, work experience, skills, certifications, and projects. It intelligently normalizes skill names, categorizes experience, and creates a standardized candidate profile for downstream matching and ranking.

## Features

- 📄 Multi-format support (PDF, DOCX, TXT)
- 🧠 Intelligent skill extraction and normalization
- 📊 Experience timeline construction
- 🎓 Education and certification parsing
- ✅ Pydantic validation for data consistency
- 🔄 Automatic candidate ID generation
- 💾 Firebase Firestore integration

## What This Agent Does

1. **Document Processing**: Accepts resume uploads in various formats
2. **Text Extraction**: Extracts raw text from documents
3. **Structured Parsing**: Uses Gemini to identify and structure:
   - Personal details (name, email, phone, location)
   - Work experience (company, duration, role, responsibilities)
   - Technical and soft skills
   - Educational qualifications
   - Certifications and achievements
   - Projects and portfolio links
4. **Skill Normalization**: Standardizes skill names (e.g., "Node.js" → "Node.js", "react" → "React")
5. **Experience Calculation**: Computes total years of experience
6. **Data Storage**: Saves parsed data to Firestore with unique candidate ID

## Output Schema

```json
{
  "candidate_id": "CAND-2025-001",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+91-9876543210",
  "location": "Bangalore",
  "total_experience_years": 5.5,
  "current_company": "Tech Corp",
  "current_role": "Senior Software Engineer",
  "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "React"],
  "education": [
    {
      "degree": "B.Tech",
      "field": "Computer Science",
      "institution": "IIT Delhi",
      "year": 2018
    }
  ],
  "work_experience": [
    {
      "company": "Tech Corp",
      "role": "Senior Software Engineer",
      "duration": "Jan 2021 - Present",
      "responsibilities": ["Led backend team", "Designed microservices architecture"]
    }
  ],
  "certifications": ["AWS Solutions Architect", "Kubernetes Administrator"],
  "notice_period_days": 30,
  "expected_salary": 3000000
}
```

## Usage

### Local Development

```bash
cd resume_parsing_agent
adk web
```

Access the agent at: http://localhost:8000

### Programmatic Usage

```python
from resume_parsing_agent import root_agent
from google.adk.runners import Runner

runner = Runner(agent=root_agent)
result = await runner.run_async(user_content="<resume text or upload path>")
```

## Environment Variables

Required in `.env` file (project root):

```bash
GOOGLE_API_KEY=your-gemini-api-key
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

## Integration Points

- **Input**: Raw resume files or text from file upload system
- **Output**: Structured candidate profiles stored in Firestore
- **Downstream**: Feeds data to `ranking_agent` for job matching

## Future Enhancements

- [ ] Multi-language resume support
- [ ] Advanced skill taxonomy mapping
- [ ] Experience relevance scoring
- [ ] Duplicate candidate detection
- [ ] Resume quality assessment

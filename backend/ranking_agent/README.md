# Ranking Agent

AI-powered candidate ranking and job matching system that intelligently scores and prioritizes candidates based on job requirements using advanced semantic matching.

## Use Case

This agent analyzes parsed job descriptions and candidate profiles to generate data-driven rankings. It performs multi-dimensional scoring considering skills match, experience alignment, location preferences, salary expectations, and cultural fit indicators to identify the best candidates for each position.

## Features

- 🎯 Multi-factor ranking algorithm
- 🧮 Weighted scoring system
- 🔍 Semantic skill matching (beyond keyword matching)
- 📈 Experience relevance scoring
- 🌍 Location and relocation compatibility
- 💰 Salary expectation alignment
- 🏆 Top-N candidate shortlisting
- 📊 Detailed match breakdown and justification

## What This Agent Does

1. **Data Retrieval**: Fetches job requirements and candidate pool from Firestore
2. **Skill Matching**: 
   - Calculates mandatory skills coverage
   - Scores good-to-have skills
   - Uses semantic similarity for skill variations
3. **Experience Scoring**:
   - Matches experience range requirements
   - Evaluates role progression and relevance
4. **Location Fit**: Considers candidate location vs. job location and relocation willingness
5. **Salary Alignment**: Matches expected vs. offered compensation
6. **Aggregate Scoring**: Computes weighted final score
7. **Ranking Generation**: Sorts candidates by match score
8. **Shortlist Creation**: Identifies top candidates with justifications
9. **Result Storage**: Saves ranked list to Firestore

## Scoring Breakdown

The ranking algorithm uses the following weighted factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Mandatory Skills | 40% | Percentage of required skills possessed |
| Good-to-Have Skills | 15% | Bonus points for additional skills |
| Experience Match | 25% | Alignment with required experience range |
| Location Compatibility | 10% | Location match or relocation willingness |
| Salary Alignment | 10% | Expected vs. offered salary fit |

**Total Score**: 0-100 scale

## Output Schema

```json
{
  "job_id": "JD-2025-001",
  "ranking_id": "RANK-2025-001",
  "timestamp": "2025-01-05T13:00:00Z",
  "total_candidates_evaluated": 150,
  "ranked_candidates": [
    {
      "rank": 1,
      "candidate_id": "CAND-2025-042",
      "candidate_name": "Jane Smith",
      "overall_score": 92.5,
      "score_breakdown": {
        "mandatory_skills_score": 100,
        "good_to_have_skills_score": 85,
        "experience_score": 95,
        "location_score": 100,
        "salary_score": 80
      },
      "mandatory_skills_matched": ["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes"],
      "mandatory_skills_missing": [],
      "good_to_have_skills_matched": ["AWS", "Terraform"],
      "match_justification": "Perfect match for mandatory skills with 5.5 years of relevant backend experience. Strong cloud infrastructure background.",
      "recommendation": "Strong Hire"
    }
  ],
  "shortlist": ["CAND-2025-042", "CAND-2025-018", "CAND-2025-091"],
  "processing_time_seconds": 2.3
}
```

## Usage

### Local Development

```bash
cd ranking_agent
adk web
```

### Programmatic Usage

```python
from ranking_agent import root_agent
from google.adk.runners import Runner

runner = Runner(agent=root_agent)
result = await runner.run_async(user_content="Rank candidates for JD-2025-001")
```

## Environment Variables

Required in `.env` file:

```bash
GOOGLE_API_KEY=your-gemini-api-key
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

## Integration Points

- **Input**: 
  - Job requirements from `jd_parsing_agent`
  - Candidate profiles from `resume_parsing_agent`
- **Output**: Ranked candidate list for `communication_agent`
- **Database**: Reads from and writes to Firestore collections

## Algorithm Details

### Semantic Skill Matching

Uses embeddings and similarity scoring to match:
- Synonyms (e.g., "Node.js" ≈ "Node" ≈ "NodeJS")
- Related technologies (e.g., "PostgreSQL" ~ "MySQL")
- Skill hierarchies (e.g., "AWS Lambda" includes "Serverless")

### Experience Scoring

```python
if candidate_exp in [min_exp, max_exp]:
    score = 100
elif candidate_exp < min_exp:
    score = (candidate_exp / min_exp) * 70  # Penalty for underqualified
else:
    score = 100 - min((candidate_exp - max_exp) * 5, 30)  # Small penalty for overqualified
```

## Future Enhancements

- [ ] Machine learning model for dynamic weight optimization
- [ ] Diversity and inclusion scoring
- [ ] Cultural fit assessment via NLP on resumes
- [ ] Interview performance prediction
- [ ] Automated candidate clustering

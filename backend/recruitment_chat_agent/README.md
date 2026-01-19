# Recruitment Analytics RAG Agent - Setup Guide

## Overview
This guide explains how to set up and use the Recruitment Analytics RAG Agent that queries job descriptions, resumes, and rankings from Google Cloud Storage.

## Prerequisites

1. **Google Cloud Platform Account**
2. **GCS Bucket** for storing recruitment data
3. **Service Account** with Storage permissions
4. **Python environment** with required packages

## Setup Steps

### 1. GCP Configuration

#### Create GCS Bucket
```bash
gsutil mb gs://recruitment-data
```

#### Create Service Account
```bash
gcloud iam service-accounts create recruitment-agent \
    --display-name="Recruitment RAG Agent"

# Grant Storage permissions
gs util iam ch serviceAccount:recruitment-agent@PROJECT_ID.iam.gserviceaccount.com:objectViewer \
    gs://recruitment-data
```

#### Download Service Account Key
```bash
gcloud iam service-accounts keys create ~/recruitment-sa-key.json \
    --iam-account=recruitment-agent@PROJECT_ID.iam.gserviceaccount.com
```

### 2. Environment Configuration

Copy `.env.recruitment_chat` and update values:

```bash
# In backend directory
cp .env.recruitment_chat .env

# Edit .env file:
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/recruitment-sa-key.json
GCS_BUCKET_NAME=recruitment-data
GOOGLE_GENAI_USE_VERTEXAI=1
VERTEX_AI_LOCATION=us-central1
```

### 3. Install Dependencies

```bash
pip install google-cloud-storage google-adk
```

### 4. Upload Data to GCS

```bash
# Run the upload pipeline
python gcp_upload_pipeline.py
```

This uploads all data from:
- `data/parsed_jds/*.json` → `gs://recruitment-data/job-descriptions/`
- `data/parsed_resumes/*.json` → `gs://recruitment-data/resumes/`
- `data/rankings/*.json` → `gs://recruitment-data/rankings/`

### 5. Test the Agent

```bash
# Start backend server
uvicorn api.main:app --reload --port 8001

# Test chat endpoint
curl -X POST http://localhost:8001/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How many jobs are open?"}'
```

## API Endpoints

### Chat Endpoint
**POST** `/api/chat/chat`

**Request:**
```json
{
  "message": "How many Python developers do we have?",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "We have 8 candidates with Python skills...",
  "session_id": "abc-123-def"
}
```

### Example Queries

- "How many jobs are currently open?"
- "Show me the top 3 candidates for job JD-2025-001"
- "Find candidates with React and 5+ years experience"
- "What's our recruitment pipeline status?"
- "How many Data Scientists have we interviewed?"

## Agent Tools

The agent has access to 4 retrieval tools:

1. **query_jobs(keyword)** - Search job descriptions
2. **query_candidates(skill, min_experience)** - Search candidates
3. **get_candidate_rankings(job_id, top_n)** - Get top candidates for a job
4. **get_recruitment_stats()** - Get overall statistics

## Troubleshooting

### Authentication Errors
- Verify `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Check service account has Storage Object Viewer permissions

### No Data Returned
- Verify data was uploaded to GCS: `gsutil ls gs://recruitment-data/`
- Check bucket name in `.env` matches actual bucket

### Agent Not Responding
- Check Vertex AI is enabled in your GCP project
- Verify API key/credentials are valid

## Next Steps

- **Frontend**: Create chat UI component
- **Production**: Use Redis for session storage
- **Scaling**: Enable Vertex AI Search for better semantic search
- **Monitoring**: Add logging and analytics

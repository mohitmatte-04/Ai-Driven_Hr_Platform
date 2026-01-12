# Using Vertex AI with gcloud Authentication

You're using the **production-recommended approach** ✅

## Setup Steps

### 1. Authenticate with gcloud

```powershell
# Login to your GCP account
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

This will:
- Open browser for authentication
- Store credentials locally
- Allow ADK to use Gemini via Vertex AI

### 2. Enable Required APIs

```powershell
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Enable Firestore (optional for now)
gcloud services enable firestore.googleapis.com
```

### 3. Update .env File

Edit `.env` and set your **actual GCP project ID**:

```bash
GOOGLE_CLOUD_PROJECT=your-actual-project-id
GOOGLE_GENAI_USE_VERTEXAI=1
```

**Example:**
```bash
GOOGLE_CLOUD_PROJECT=my-company-platform-dev
GOOGLE_GENAI_USE_VERTEXAI=1
```

### 4. Verify Setup

Check authentication:
```powershell
gcloud auth application-default print-access-token
```

If you see a token (long string), you're authenticated! ✅

### 5. Test the Agent

```powershell
cd jd_parsing_agent
adk web
```

Open http://localhost:8000 and test!

## Advantages of Vertex AI

- ✅ **No API key management** - uses gcloud credentials
- ✅ **Production-ready** - same setup for dev and prod
- ✅ **Better security** - automatic credential rotation
- ✅ **Billing integration** - part of your GCP project
- ✅ **Higher quotas** - better for production workloads

## Location Options

Common locations:
- `us-central1` (Iowa, USA)
- `us-east4` (Virginia, USA)
- `europe-west4` (Netherlands)
- `asia-southeast1` (Singapore)

Update `GOOGLE_CLOUD_LOCATION` in `.env` based on your preference.

## Troubleshooting

### "Application Default Credentials not found"

**Fix:**
```powershell
gcloud auth application-default login
```

### "Permission denied" or "403 Forbidden"

**Fix:** Enable Vertex AI API
```powershell
gcloud services enable aiplatform.googleapis.com
```

### "Project not found"

**Fix:** Verify project ID
```powershell
gcloud projects list
```

Then update `.env` with correct project ID.

## Pricing

Gemini 2.5 Flash via Vertex AI:
- **Input**: ~$0.075 per 1M characters
- **Output**: ~$0.30 per 1M characters

Very affordable for recruitment use case! 💰

## What's Next?

Once authenticated:
1. ✅ Set project ID in `.env`
2. 🚀 Test JD parsing agent
3. 📊 Check usage in Cloud Console → Vertex AI

# 📁 Folder-Based JD Processing

You can now drop JD files into a folder and they'll be automatically parsed!

## Folder Structure

```
Ai-Recruitment-Platform/
└── data/
    ├── jds/
    │   ├── pending/       ← Drop JD files here
    │   └── processed/     ← Parsed files moved here automatically
    └── resumes/
        ├── pending/       ← Drop resume files here (Phase 2)
        └── processed/
```

## Two Ways to Process JDs

### Option 1: Real-Time Monitoring (Recommended for Production)

Continuously watches the folder and processes files as they arrive:

```bash
cd jd_parsing_agent
python batch_processor.py
```

**What happens:**
1. Script monitors `data/jds/pending/` folder
2. When you drop a JD file → instantly detected
3. Text extracted → sent to Gemini → parsed
4. Saved to Firestore
5. File moved to `data/jds/processed/` with timestamp

**Supported formats:** `.txt`, `.md`, `.pdf`, `.doc`, `.docx`

### Option 2: One-Time Batch Processing

Process all existing files once and exit:

```bash
cd jd_parsing_agent
python simple_batch.py
```

Good for: Processing a batch of JDs collected offline.

## Quick Test

1. **Copy the sample JD:**
   ```bash
   copy jd_parsing_agent\sample_jd.md data\jds\pending\test_jd.md
   ```

2. **Start the watcher:**
   ```bash
   cd jd_parsing_agent
   python batch_processor.py
   ```

3. **Watch the magic:**
   ```
   📄 New JD detected: test_jd.md
   📖 Extracted 892 characters
   🤖 Parsing with Gemini...
   ✅ JD Parsed Successfully!
   Job ID: JD-2025-001
   📁 Moved to: 20251231_095654_test_jd_processed.md
   ```

## Production Use Case

**Scenario:** Recruiters upload JDs to a shared Google Drive folder

**Setup:**
1. Sync Google Drive folder to `data/jds/pending/`
2. Run `batch_processor.py` as a service
3. All new JDs auto-parsed and saved to Firestore
4. Processed files archived with timestamps

## File Naming After Processing

Original: `backend_engineer.pdf`
Processed: `20251231_120530_backend_engineer_processed.pdf`

Format: `YYYYMMDD_HHMMSS_originalname_processed.ext`

## Error Handling

If a file fails to parse:
- Moved to `data/jds/processed/errors/`
- Error logged to console
- Other files continue processing

## Next Steps

Same system will be used for:
- ✅ Resume batch processing (Phase 2)
- ✅ Automatic ranking when new candidates added
- ✅ Auto-shortlisting and email triggers

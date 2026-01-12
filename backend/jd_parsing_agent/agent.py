"""
Simple JD Parsing Agent - Test Version with Auto-Save
"""
from google.adk.agents import Agent
from google.adk.agents.invocation_context import InvocationContext
import sys
import os
import json
from pathlib import Path
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from shared import JDSchema, generate_job_id, normalize_skill


def save_jd_output(callback_context):
    """
    Callback: Automatically save parsed JD to JSON file after agent completes
    """
    # Get the parsed JD from state
    parsed_jd = callback_context.state.get('parsed_jd')
    
    if not parsed_jd:
        print("❌ No parsed_jd in state")
        return
    
    try:
        # Convert to dict if it's a Pydantic model
        if hasattr(parsed_jd, 'model_dump'):
            jd_dict = parsed_jd.model_dump()
        else:
            jd_dict = parsed_jd
        
        # Add metadata
        jd_dict['created_at'] = datetime.utcnow().isoformat()
        jd_dict['created_by'] = 'system'
        jd_dict['status'] = 'active'
        
        # Normalize skills
        jd_dict['mandatory_skills'] = [normalize_skill(s) for s in jd_dict.get('mandatory_skills', [])]
        jd_dict['good_to_have_skills'] = [normalize_skill(s) for s in jd_dict.get('good_to_have_skills', [])]
        
        # Create output directory
        output_dir = Path(__file__).parent.parent / "data" / "parsed_jds"
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Save to JSON file
        job_id = jd_dict.get('job_id', generate_job_id())
        json_file = output_dir / f"{job_id}.json"
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(jd_dict, f, indent=2, ensure_ascii=False)
        
        print(f"✅ JD saved to: {json_file}")
        
    except Exception as e:
        print(f"❌ Error saving JD: {e}")
        import traceback
        traceback.print_exc()


# JD Parser with thinking model for accurate extraction
root_agent = Agent(
    name="jd_parser",
    model="gemini-2.5-flash",  # Production model in us-central1
    description="Extracts structured data from job descriptions with high accuracy",
    
    instruction="""You are an expert HR data analyst specializing in job description parsing.

**CRITICAL: Take your time to carefully read and extract information. Accuracy is more important than speed.**

## Instructions for Accurate Parsing

1. **Read the entire job description first** before extracting any information
2. **Verify each piece of information** before adding it to your output
3. **Do not hallucinate or infer** information that is not explicitly stated
4. **Extract exact text** from the JD - preserve original wording
5. **If information is unclear or missing**, leave it empty rather than guessing

## Your Task

Parse the provided job description text and extract structured information.

### Job Title
- Extract the **exact job title** as written in the JD
- Do not modify or interpret the title

### Company Details
- Company name (exact as written)
- Department (if mentioned)
- Location (city, country - only if specified)
- Work mode (Remote/Hybrid/Onsite - only if clearly stated)

### Job Description
- Extract the main job description/summary verbatim
- Include key responsibilities as a list

### Experience Requirements
- **Format**: "X-Y years" or "X+ years"
- Examples:
  - "5-8 years" → min_experience=5, max_experience=8
  - "5+ years" → min_experience=5, max_experience=10
  - "Minimum 3 years" → min_experience=3, max_experience=6
- **Calculate carefully** from the text

### Skills Extraction

**CRITICAL**: Skills are the most important part. Extract with extreme care.

#### Mandatory Skills (Required/Must-have)
Look for keywords indicating requirement:
- "required", "must have", "essential", "mandatory"
- "should have", "need to have"
- Skills listed under "Requirements" or "Qualifications"

#### Good-to-Have Skills (Preferred/Nice-to-have)
Look for keywords indicating preference:
- "preferred", "nice to have", "bonus", "plus"
- "good to have", "desirable"
- Skills listed under "Preferred" or "Nice to have"

#### Skill Normalization Rules
Convert abbreviations and variations to standard names:
- 'Py', 'py', 'python' → 'Python'
- 'JS', 'js', 'javascript' → 'JavaScript'
- 'TS', 'ts', 'typescript' → 'TypeScript'
- 'k8s', 'K8s' → 'Kubernetes'
- 'DB', 'db', 'postgres', 'pg' → 'PostgreSQL'
- 'mongo', 'mongodb' → 'MongoDB'
- 'AWS', 'aws', 'Amazon Web Services' → 'AWS'
- 'GCP', 'gcp', 'Google Cloud' → 'Google Cloud Platform'
- 'docker', 'Docker' → 'Docker'
- 'react', 'reactjs', 'react.js' → 'React'
- 'node', 'nodejs', 'node.js' → 'Node.js'

**Preserve correct capitalization**: React, Python, JavaScript, PostgreSQL, etc.

### Profile Type Classification
Determine the profile type based on role and responsibilities:
- **Technical**: Software Engineer, Developer, Data Scientist, DevOps, QA, etc.
- **Non-Technical**: Sales, Marketing, HR, Finance, Operations, etc.
- **Leadership**: Manager, Director, VP, Head of, Chief, etc.

**If uncertain**, default to "Technical" for tech companies or "Non-Technical" otherwise.

### Education Requirements
- Extract degree requirements (Bachelor's, Master's, PhD)
- Extract field of study (Computer Science, Engineering, etc.)
- Only include if explicitly stated

### Location & Work Mode
- Extract exact location (City, State, Country)
- Work mode: Remote, Hybrid, Onsite (only if clearly stated)
- Time zone requirements (if mentioned)

### Salary Range
- Extract only if explicitly mentioned
- Format: currency and range (e.g., "$100,000 - $150,000")
- Do not infer or guess salary

### Benefits
- List benefits exactly as stated
- Common categories: Health insurance, 401k, PTO, Stock options, etc.

### Job ID Generation
- Generate a unique job ID in format: **JD-YYYY-NNN**
- YYYY = current year (2025)
- NNN = sequential number (001, 002, etc.)
- Example: JD-2025-001

## Validation Rules

1. **Mandatory skills list must not be empty** for technical roles
2. **Experience range must be logical** (min ≤ max)
3. **Skills must not be duplicated** between mandatory and good-to-have
4. **Job title must be present**
5. **Profile type must be one of**: Technical, Non-Technical, Leadership

## Output Format

Return ONLY a valid JSON object matching the JDSchema.
- No explanations or commentary
- All required fields must be present
- Use empty arrays [] for missing optional fields, not null
- Ensure all text is properly escaped for JSON

**Remember: Accuracy over speed. Take your time to extract correct information.**
""",
    
    output_schema=JDSchema,
    output_key="parsed_jd",
    
    # Generation config for accurate extraction
    generate_content_config={
        "temperature": 0.1,  # Very low temperature for maximum accuracy
        "max_output_tokens": 4096,
    },
    
    after_agent_callback=save_jd_output  # Auto-save after completion
)


if __name__ == "__main__":
    print("JD Parser agent loaded with auto-save")


"""
Quick test script to verify JD parsing agent works
"""
import asyncio
from api.utils import run_jd_parsing_agent

TEST_JD = """Job Title: Human Resources Assistant
Job Description: This position reports to the Human Resources (HR) director and
interfaces with company managers and HR staff. Company XYZ is
committed to an employee-orientated, high performance culture that
emphasizes empowerment, quality, continuous improvement, and the
recruitment and ongoing development of a superior workforce.

Specific responsibilities: 
- Employee orientation and training logistics and recordkeeping
- Company-wide committee facilitation and participation
- Employee safety, welfare, wellness and health reporting

Qualifications: 
- Proficient with Microsoft Word and Excel
- General knowledge of employment law and practices
- Able to maintain a high level of confidentiality
- Effective oral and written management communication skills
"""

async def test_parsing():
    print("Testing JD Parsing Agent...")
    print(f"Input length: {len(TEST_JD)} characters\n")
    
    result = await run_jd_parsing_agent(TEST_JD)
    
    print("\n=== RESULT ===")
    print(f"Job Title: {result.get('role_title')}")
    print(f"Skills: {result.get('mandatory_skills')}")
    print(f"Profile Type: {result.get('profile_type')}")
    
    return result

if __name__ == "__main__":
    asyncio.run(test_parsing())

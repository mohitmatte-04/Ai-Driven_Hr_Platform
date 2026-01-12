"""
Simple one-time batch processor - processes all JD files in pending folder
"""
import asyncio
from pathlib import Path
import sys
import os

# Add parent to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from agent import root_agent
import PyPDF2
from docx import Document as DocxDocument
import shutil
from datetime import datetime


def extract_text(file_path: Path) -> str:
    """Extract text from file"""
    try:
        if file_path.suffix.lower() in ['.txt', '.md']:
            return file_path.read_text(encoding='utf-8')
        
        elif file_path.suffix.lower() == '.pdf':
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                return '\n'.join([page.extract_text() for page in reader.pages])
        
        elif file_path.suffix.lower() in ['.doc', '.docx']:
            doc = DocxDocument(file_path)
            return '\n'.join([para.text for para in doc.paragraphs])
        
        return None
    except Exception as e:
        print(f"Error extracting text from {file_path.name}: {e}")
        return None


async def process_file(file_path: Path, runner: Runner, processed_dir: Path):
    """Process a single JD file"""
    try:
        print(f"\n📄 Processing: {file_path.name}")
        
        # Extract text
        jd_text = extract_text(file_path)
        if not jd_text:
            print(f"❌ Could not extract text")
            return
        
        print(f"📖 Extracted {len(jd_text)} characters")
        print(f"🤖 Parsing with Gemini...")
        
        # Run agent (Runner expects 'content' not 'text')
        async for event in runner.run_async(content=jd_text):
            if event.content:
                print(f"✅ Parsed successfully!")
        
        # Move to processed
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        new_name = f"{timestamp}_{file_path.stem}_processed{file_path.suffix}"
        destination = processed_dir / new_name
        
        shutil.move(str(file_path), str(destination))
        print(f"📁 Moved to: {destination.name}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()


async def main():
    """Main processing function"""
    # Setup paths
    project_root = Path(__file__).parent.parent
    pending_dir = project_root / "data" / "jds" / "pending"
    processed_dir = project_root / "data" / "jds" / "processed"
    
    pending_dir.mkdir(parents=True, exist_ok=True)
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    # Find files
    files = list(pending_dir.glob('*'))
    jd_files = [f for f in files if f.is_file() and f.suffix.lower() in ['.txt', '.md', '.pdf', '.doc', '.docx']]
    
    if not jd_files:
        print("No JD files found in pending folder")
        return
    
    print(f"\n✅ Found {len(jd_files)} file(s) to process\n")
    
    # Initialize runner
    session_service = InMemorySessionService()
    runner = Runner(
        app_name="jd_parsing_agent",
        agent=root_agent,
        session_service=session_service
    )
    
    # Process each file
    for file_path in jd_files:
        await process_file(file_path, runner, processed_dir)
    
    print(f"\n✅ Batch processing complete!")
    print(f"📊 Processed: {len(jd_files)} file(s)")
    print(f"📁 Check: data/parsed_jds/ for JSON outputs")


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Simple Batch Processor")
    print("=" * 60)
    
    asyncio.run(main())

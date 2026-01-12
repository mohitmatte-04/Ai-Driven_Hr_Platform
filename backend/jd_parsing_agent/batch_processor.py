"""
Batch processor for JD files - monitors folder and auto-parses
"""
import os
import sys
import asyncio
import shutil
from pathlib import Path
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import PyPDF2
from docx import Document as DocxDocument

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from agent import root_agent
from shared import generate_job_id


class JDFileHandler(FileSystemEventHandler):
    """Monitors folder for new JD files and processes them"""
    
    def __init__(self, pending_dir: str, processed_dir: str):
        self.pending_dir = Path(pending_dir)
        self.processed_dir = Path(processed_dir)
        # Create session service for Runner
        session_service = InMemorySessionService()
        self.runner = Runner(
            app_name="jd_parsing_agent",
            agent=root_agent,
            session_service=session_service
        )
        self.processing_lock = asyncio.Lock()
    
    def on_created(self, event):
        """Called when a new file is created in the watched folder"""
        if event.is_directory:
            return
        
        file_path = Path(event.src_path)
        
        # Only process supported file types
        if file_path.suffix.lower() in ['.txt', '.pdf', '.doc', '.docx', '.md']:
            print(f"\n📄 New JD detected: {file_path.name}")
            asyncio.run(self.process_jd_file(file_path))
    
    async def process_jd_file(self, file_path: Path):
        """Extract text and send to JD parsing agent"""
        async with self.processing_lock:
            try:
                # Extract text based on file type
                jd_text = self.extract_text(file_path)
                
                if not jd_text:
                    print(f"❌ Could not extract text from {file_path.name}")
                    return
                
                print(f"📖 Extracted {len(jd_text)} characters")
                print(f"🤖 Parsing with Gemini...")
                
                # Generate job ID
                job_id = generate_job_id()
                
                # Run the agent
                final_content = None
                async for event in self.runner.run_async(text=jd_text):
                    if event.content:
                        final_content = event.content
                        print(f"✅ Event: {event.author}")
                
                print(f"\n✅ JD Parsed Successfully!")
                print(f"Job ID: {job_id}")
                
                # Move to processed folder with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                new_name = f"{timestamp}_{file_path.stem}_processed{file_path.suffix}"
                destination = self.processed_dir / new_name
                
                shutil.move(str(file_path), str(destination))
                print(f"📁 Moved to: {destination.name}\n")
                
            except Exception as e:
                print(f"❌ Error processing {file_path.name}: {str(e)}")
                # Move to error folder (optional)
                error_dir = self.processed_dir / "errors"
                error_dir.mkdir(exist_ok=True)
                shutil.move(str(file_path), str(error_dir / file_path.name))
    
    def extract_text(self, file_path: Path) -> str:
        """Extract text from various file formats"""
        try:
            if file_path.suffix.lower() == '.txt' or file_path.suffix.lower() == '.md':
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            
            elif file_path.suffix.lower() == '.pdf':
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text() + "\n"
                    return text
            
            elif file_path.suffix.lower() in ['.doc', '.docx']:
                doc = DocxDocument(file_path)
                return "\n".join([para.text for para in doc.paragraphs])
            
            else:
                return None
                
        except Exception as e:
            print(f"Error extracting text: {e}")
            return None


def process_existing_files(pending_dir: Path, handler: JDFileHandler):
    """Process any files that were already in the pending folder"""
    print("🔍 Checking for existing JD files...")
    
    for file_path in pending_dir.glob('*'):
        if file_path.is_file() and file_path.suffix.lower() in ['.txt', '.pdf', '.doc', '.docx', '.md']:
            print(f"📄 Found existing file: {file_path.name}")
            asyncio.run(handler.process_jd_file(file_path))


def start_file_watcher(watch_dir: str = None, processed_dir: str = None):
    """Start watching the JD folder for new files"""
    
    # Default paths
    if watch_dir is None:
        project_root = Path(__file__).parent.parent
        watch_dir = project_root / "data" / "jds" / "pending"
    
    if processed_dir is None:
        project_root = Path(__file__).parent.parent
        processed_dir = project_root / "data" / "jds" / "processed"
    
    watch_dir = Path(watch_dir)
    processed_dir = Path(processed_dir)
    
    # Create directories if they don't exist
    watch_dir.mkdir(parents=True, exist_ok=True)
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("🚀 JD Batch Processor Started")
    print("=" * 60)
    print(f"📂 Watching: {watch_dir}")
    print(f"📁 Processed files go to: {processed_dir}")
    print("\n💡 Drop JD files (.txt, .pdf, .docx, .md) into the pending folder")
    print("   They will be automatically parsed and moved to processed/")
    print("\nPress Ctrl+C to stop\n")
    
    # Set up file watcher
    event_handler = JDFileHandler(watch_dir, processed_dir)
    observer = Observer()
    observer.schedule(event_handler, str(watch_dir), recursive=False)
    
    # Process existing files first
    process_existing_files(watch_dir, event_handler)
    
    # Start watching for new files
    observer.start()
    
    try:
        while True:
            asyncio.run(asyncio.sleep(1))
    except KeyboardInterrupt:
        print("\n\n⏸️  Stopping file watcher...")
        observer.stop()
    
    observer.join()
    print("✅ File watcher stopped")


if __name__ == "__main__":
    start_file_watcher()

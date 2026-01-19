"""
GCP Data Upload Pipeline for Recruitment Data

Uploads parsed JDs, resumes, and rankings to Google Cloud Storage
for RAG agent retrieval.
"""

from google.cloud import storage
import json
import os
from pathlib import Path
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RecruitmentDataUploader:
    """Upload recruitment data to GCP Cloud Storage"""
    
    def __init__(self, bucket_name: str = None):
        """
        Initialize uploader with GCS bucket
        
        Args:
            bucket_name: Name of GCS bucket (reads from env if not provided)
        """
        self.bucket_name = bucket_name or os.getenv("GCS_BUCKET_NAME", "recruitment-data")
        
        try:
            self.storage_client = storage.Client()
            self.bucket = self.storage_client.bucket(self.bucket_name)
            logger.info(f"Connected to GCS bucket: {self.bucket_name}")
        except Exception as e:
            logger.error(f"Failed to connect to GCS: {e}")
            raise
    
    def upload_file(self, local_path: Path, gcs_path: str) -> bool:
        """
        Upload a single file to GCS
        
        Args:
            local_path: Path to local file
            gcs_path: Destination path in GCS bucket
            
        Returns:
            True if successful, False otherwise
        """
        try:
            blob = self.bucket.blob(gcs_path)
            blob.upload_from_filename(str(local_path))
            logger.info(f"Uploaded: {local_path.name} -> gs://{self.bucket_name}/{gcs_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to upload {local_path}: {e}")
            return False
    
    def upload_jd_data(self, jd_dir: str = "data/parsed_jds") -> Dict[str, int]:
        """
        Upload all parsed job descriptions
        
        Args:
            jd_dir: Directory containing parsed JD JSON files
            
        Returns:
            Dict with success/failure counts
        """
        jd_path = Path(jd_dir)
        if not jd_path.exists():
            logger.error(f"JD directory not found: {jd_dir}")
            return {"success": 0, "failed": 0}
        
        results = {"success": 0, "failed": 0}
        
        for jd_file in jd_path.glob("*.json"):
            gcs_path = f"job-descriptions/{jd_file.name}"
            if self.upload_file(jd_file, gcs_path):
                results["success"] += 1
            else:
                results["failed"] += 1
        
        logger.info(f"JD Upload: {results['success']} succeeded, {results['failed']} failed")
        return results
    
    def upload_resume_data(self, resume_dir: str = "data/parsed_resumes") -> Dict[str, int]:
        """
        Upload all parsed resumes
        
        Args:
            resume_dir: Directory containing parsed resume JSON files
            
        Returns:
            Dict with success/failure counts
        """
        resume_path = Path(resume_dir)
        if not resume_path.exists():
            logger.warning(f"Resume directory not found: {resume_dir}")
            return {"success": 0, "failed": 0}
        
        results = {"success": 0, "failed": 0}
        
        for resume_file in resume_path.glob("*.json"):
            gcs_path = f"resumes/{resume_file.name}"
            if self.upload_file(resume_file, gcs_path):
                results["success"] += 1
            else:
                results["failed"] += 1
        
        logger.info(f"Resume Upload: {results['success']} succeeded, {results['failed']} failed")
        return results
    
    def upload_ranking_data(self, ranking_dir: str = "data/rankings") -> Dict[str, int]:
        """
        Upload all candidate rankings
        
        Args:
            ranking_dir: Directory containing ranking JSON files
            
        Returns:
            Dict with success/failure counts
        """
        ranking_path = Path(ranking_dir)
        if not ranking_path.exists():
            logger.warning(f"Ranking directory not found: {ranking_dir}")
            return {"success": 0, "failed": 0}
        
        results = {"success": 0, "failed": 0}
        
        for ranking_file in ranking_path.glob("*.json"):
            gcs_path = f"rankings/{ranking_file.name}"
            if self.upload_file(ranking_file, gcs_path):
                results["success"] += 1
            else:
                results["failed"] += 1
        
        logger.info(f"Ranking Upload: {results['success']} succeeded, {results['failed']} failed")
        return results
    
    def upload_all(self) -> Dict[str, Dict[str, int]]:
        """
        Upload all recruitment data (JDs, resumes, rankings)
        
        Returns:
            Dict with results for each data type
        """
        logger.info("Starting full data upload to GCS...")
        
        results = {
            "job_descriptions": self.upload_jd_data(),
            "resumes": self.upload_resume_data(),
            "rankings": self.upload_ranking_data()
        }
        
        total_success = sum(r["success"] for r in results.values())
        total_failed = sum(r["failed"] for r in results.values())
        
        logger.info(f"Upload Complete: {total_success} files uploaded, {total_failed} failed")
        return results


def main():
    """Run the upload pipeline"""
    try:
        uploader = RecruitmentDataUploader()
        results = uploader.upload_all()
        
        print("\n" + "="*50)
        print("GCP Upload Pipeline Results")
        print("="*50)
        for data_type, counts in results.items():
            print(f"{data_type}: {counts['success']} uploaded, {counts['failed']} failed")
        print("="*50 + "\n")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise


if __name__ == "__main__":
    main()

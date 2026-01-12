"""
Pydantic schemas for Resume Parsing and Evaluation Agent.
Defines the complete structured output format for the agent.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal


# ============================================================================
# Personal Information & Links
# ============================================================================

class CandidateLinks(BaseModel):
    """URLs to candidate's online profiles."""
    linkedin: Optional[str] = Field(default=None, description="LinkedIn profile URL")
    github: Optional[str] = Field(default=None, description="GitHub profile URL")
    portfolio: Optional[str] = Field(default=None, description="Personal website or portfolio URL")
    leetcode: Optional[str] = Field(default=None, description="LeetCode profile URL")
    hackerrank: Optional[str] = Field(default=None, description="HackerRank profile URL")
    codeforces: Optional[str] = Field(default=None, description="CodeForces profile URL")
    stackoverflow: Optional[str] = Field(default=None, description="Stack Overflow profile URL")
    other: Optional[List[str]] = Field(default=None, description="Other relevant platform links")


class CandidateInfo(BaseModel):
    """Basic candidate identification information."""
    name: str = Field(description="Full name of the candidate")
    email: str = Field(description="Email address")
    phone: Optional[str] = Field(default=None, description="Phone number")
    location: Optional[str] = Field(default=None, description="Current location (city, state, country)")
    target_job_title: str = Field(
        description="Primary job title/role the candidate is qualified for (e.g., 'DevOps Engineer', 'Backend Developer', 'Data Scientist', 'Full Stack Developer'). Infer from most recent role, primary skills, and experience level."
    )
    links: CandidateLinks = Field(default_factory=CandidateLinks, description="Online profile links")


# ============================================================================
# Technical Skills
# ============================================================================

class TechnicalSkills(BaseModel):
    """Categorized technical skills extracted from resume."""
    programming_languages: List[str] = Field(default_factory=list, description="Programming languages with proficiency")
    frameworks: List[str] = Field(default_factory=list, description="Frameworks and libraries")
    databases: List[str] = Field(default_factory=list, description="Database technologies")
    cloud_platforms: List[str] = Field(default_factory=list, description="Cloud platforms (AWS, Azure, GCP, etc.)")
    devops_tools: List[str] = Field(default_factory=list, description="DevOps and CI/CD tools")
    tools: List[str] = Field(default_factory=list, description="Development tools, IDEs, and other software")
    methodologies: List[str] = Field(default_factory=list, description="Methodologies and practices (Agile, Scrum, etc.)")
    soft_skills: List[str] = Field(default_factory=list, description="Soft skills and interpersonal abilities")


# ============================================================================
# Education
# ============================================================================

class Education(BaseModel):
    """Educational qualification details."""
    degree: str = Field(description="Degree or certification name")
    field: Optional[str] = Field(default=None, description="Field of study or major")
    institution: str = Field(description="Institution or university name")
    year: Optional[int] = Field(default=None, description="Graduation year or expected year")
    gpa: Optional[str] = Field(default=None, description="GPA or percentage if mentioned")
    honors: Optional[str] = Field(default=None, description="Academic honors or distinctions")
    relevant_coursework: Optional[List[str]] = Field(default=None, description="Relevant courses taken")


# ============================================================================
# Work Experience
# ============================================================================

class WorkExperience(BaseModel):
    """Professional work experience details."""
    company: str = Field(description="Company or organization name")
    title: str = Field(description="Job title or position")
    location: Optional[str] = Field(default=None, description="Job location")
    start_date: Optional[str] = Field(default=None, description="Start date (format: YYYY-MM or MMM YYYY)")
    end_date: Optional[str] = Field(default=None, description="End date or 'Present'")
    duration: Optional[str] = Field(default=None, description="Duration of employment")
    responsibilities: List[str] = Field(default_factory=list, description="Key responsibilities and duties")
    achievements: List[str] = Field(default_factory=list, description="Quantifiable achievements and accomplishments")
    technologies: List[str] = Field(default_factory=list, description="Technologies and tools used in this role")
    projects: Optional[List[str]] = Field(default=None, description="Projects worked on during this employment")


# ============================================================================
# Projects
# ============================================================================

class Project(BaseModel):
    """Project details including personal, academic, or professional projects."""
    name: str = Field(description="Project name or title")
    description: str = Field(description="Brief description of the project")
    technologies: List[str] = Field(default_factory=list, description="Technologies and tools used")
    role: Optional[str] = Field(default=None, description="Your role and contributions")
    github_link: Optional[str] = Field(default=None, description="GitHub repository link")
    live_demo: Optional[str] = Field(default=None, description="Live demo or deployment link")
    impact: Optional[str] = Field(default=None, description="Impact, results, or outcomes")


# ============================================================================
# Certifications & Achievements
# ============================================================================

class Certification(BaseModel):
    """Professional certification details."""
    name: str = Field(description="Certification name")
    issuer: str = Field(description="Issuing organization")
    date: Optional[str] = Field(default=None, description="Date obtained")
    expiry: Optional[str] = Field(default=None, description="Expiry date if applicable")
    credential_id: Optional[str] = Field(default=None, description="Credential ID or verification link")


class Achievement(BaseModel):
    """Awards and achievements."""
    title: str = Field(description="Award or achievement title")
    organization: Optional[str] = Field(default=None, description="Issuing organization")
    date: Optional[str] = Field(default=None, description="Date received")
    description: Optional[str] = Field(default=None, description="Brief description")


# ============================================================================
# Parsed Resume Data
# ============================================================================

class ParsedResumeData(BaseModel):
    """Complete structured data extracted from the resume."""
    summary: Optional[str] = Field(default=None, description="Professional summary or objective statement")
    total_experience_years: float = Field(default=0.0, description="Total years of professional experience")
    education: List[Education] = Field(default_factory=list, description="Educational qualifications")
    work_experience: List[WorkExperience] = Field(default_factory=list, description="Professional work history")
    technical_skills: TechnicalSkills = Field(default_factory=TechnicalSkills, description="Technical skills categorized")
    projects: List[Project] = Field(default_factory=list, description="Projects portfolio")
    certifications: List[Certification] = Field(default_factory=list, description="Professional certifications")
    achievements: List[Achievement] = Field(default_factory=list, description="Awards and achievements")
    publications: Optional[List[str]] = Field(default=None, description="Publications or patents")
    languages: Optional[List[str]] = Field(default=None, description="Languages spoken")
    volunteer_work: Optional[List[str]] = Field(default=None, description="Volunteer activities")


# ============================================================================
# External Profiles
# ============================================================================

class GitHubProfile(BaseModel):
    """GitHub profile analysis data."""
    username: Optional[str] = Field(default=None, description="GitHub username")
    repositories: int = Field(default=0, description="Number of public repositories")
    stars: int = Field(default=0, description="Total stars received across all repos")
    commits_last_year: int = Field(default=0, description="Commits in the last 12 months")
    top_languages: List[str] = Field(default_factory=list, description="Most used programming languages")
    notable_projects: List[str] = Field(default_factory=list, description="Notable repositories with high stars/quality")
    contribution_streak: Optional[int] = Field(default=None, description="Current contribution streak in days")
    profile_accessible: bool = Field(default=True, description="Whether the profile was accessible")
    error_message: Optional[str] = Field(default=None, description="Error message if profile not accessible")


class CodingPlatformProfile(BaseModel):
    """Coding platform (LeetCode, HackerRank, CodeForces) profile analysis."""
    platform: str = Field(description="Platform name (LeetCode, HackerRank, CodeForces, etc.)")
    username: Optional[str] = Field(default=None, description="Username on the platform")
    rank: Optional[str] = Field(default=None, description="Current rank or percentile")
    problems_solved: int = Field(default=0, description="Total problems solved")
    easy_solved: int = Field(default=0, description="Easy problems solved")
    medium_solved: int = Field(default=0, description="Medium problems solved")
    hard_solved: int = Field(default=0, description="Hard problems solved")
    contest_rating: Optional[int] = Field(default=None, description="Contest rating if applicable")
    badges: List[str] = Field(default_factory=list, description="Badges or achievements earned")
    profile_accessible: bool = Field(default=True, description="Whether the profile was accessible")
    error_message: Optional[str] = Field(default=None, description="Error message if profile not accessible")


class StackOverflowProfile(BaseModel):
    """Stack Overflow profile analysis data."""
    user_id: Optional[str] = Field(default=None, description="Stack Overflow user ID")
    reputation: int = Field(default=0, description="Reputation score")
    answers: int = Field(default=0, description="Number of answers posted")
    questions: int = Field(default=0, description="Number of questions posted")
    accept_rate: Optional[float] = Field(default=None, description="Answer acceptance rate")
    top_tags: List[str] = Field(default_factory=list, description="Top expertise tags")
    gold_badges: int = Field(default=0, description="Number of gold badges")
    silver_badges: int = Field(default=0, description="Number of silver badges")
    bronze_badges: int = Field(default=0, description="Number of bronze badges")
    profile_accessible: bool = Field(default=True, description="Whether the profile was accessible")
    error_message: Optional[str] = Field(default=None, description="Error message if profile not accessible")


class ExternalProfiles(BaseModel):
    """Aggregated external profile data from various platforms."""
    github: Optional[GitHubProfile] = Field(default=None, description="GitHub profile analysis")
    coding_platforms: List[CodingPlatformProfile] = Field(default_factory=list, description="Coding platform profiles")
    stackoverflow: Optional[StackOverflowProfile] = Field(default=None, description="Stack Overflow profile analysis")


# ============================================================================
# Evaluation Scores
# ============================================================================

class TechnicalSkillsScore(BaseModel):
    """Technical skills evaluation breakdown."""
    breadth: int = Field(ge=0, le=8, description="Variety of technologies (0-8 points)")
    depth: int = Field(ge=0, le=8, description="Expertise in core technologies (0-8 points)")
    relevance: int = Field(ge=0, le=9, description="Relevance to modern tech stack (0-9 points)")
    total: int = Field(ge=0, le=25, description="Total technical skills score")
    max: int = Field(default=25, description="Maximum possible score")


class ATSScore(BaseModel):
    """ATS (Applicant Tracking System) compatibility score."""
    keywords: int = Field(ge=0, le=7, description="Industry keyword optimization (0-7 points)")
    formatting: int = Field(ge=0, le=5, description="Clean, parseable formatting (0-5 points)")
    consistency: int = Field(ge=0, le=4, description="Consistent formatting and terminology (0-4 points)")
    completeness: int = Field(ge=0, le=4, description="All essential sections present (0-4 points)")
    total: int = Field(ge=0, le=20, description="Total ATS score")
    max: int = Field(default=20, description="Maximum possible score")


class ExperienceQualityScore(BaseModel):
    """Work experience quality evaluation."""
    relevance: int = Field(ge=0, le=8, description="Relevance to technical roles (0-8 points)")
    impact: int = Field(ge=0, le=7, description="Quantifiable achievements (0-7 points)")
    progression: int = Field(ge=0, le=5, description="Career growth trajectory (0-5 points)")
    total: int = Field(ge=0, le=20, description="Total experience quality score")
    max: int = Field(default=20, description="Maximum possible score")


class EducationCertificationsScore(BaseModel):
    """Education and certifications evaluation."""
    education: int = Field(ge=0, le=5, description="Educational background (0-5 points)")
    certifications: int = Field(ge=0, le=3, description="Industry certifications (0-3 points)")
    continuous_learning: int = Field(ge=0, le=2, description="Evidence of ongoing learning (0-2 points)")
    total: int = Field(ge=0, le=10, description="Total education & certifications score")
    max: int = Field(default=10, description="Maximum possible score")


class ProjectsScore(BaseModel):
    """Projects portfolio evaluation."""
    complexity: int = Field(ge=0, le=6, description="Sophistication of projects (0-6 points)")
    real_world_application: int = Field(ge=0, le=5, description="Practical value (0-5 points)")
    documentation: int = Field(ge=0, le=4, description="Documentation quality (0-4 points)")
    total: int = Field(ge=0, le=15, description="Total projects score")
    max: int = Field(default=15, description="Maximum possible score")


class ExternalProfilesScore(BaseModel):
    """External online profiles evaluation."""
    github: int = Field(ge=0, le=4, description="GitHub activity and quality (0-4 points)")
    coding_platforms: int = Field(ge=0, le=3, description="Coding challenge performance (0-3 points)")
    community: int = Field(ge=0, le=3, description="Community contributions (0-3 points)")
    total: int = Field(ge=0, le=10, description="Total external profiles score")
    max: int = Field(default=10, description="Maximum possible score")


class ScoreBreakdown(BaseModel):
    """Complete evaluation score breakdown across all categories."""
    technical_skills: TechnicalSkillsScore
    ats_score: ATSScore
    experience_quality: ExperienceQualityScore
    education_certifications: EducationCertificationsScore
    projects: ProjectsScore
    external_profiles: ExternalProfilesScore


# ============================================================================
# Final Evaluation
# ============================================================================

class Evaluation(BaseModel):
    """Complete candidate evaluation with scores and feedback."""
    scores: ScoreBreakdown = Field(description="Detailed score breakdown by category")
    final_score: int = Field(ge=0, le=100, description="Total score out of 100")
    grade: Literal["A+", "A", "B", "C", "D", "F"] = Field(description="Letter grade based on score")
    red_flags: List[str] = Field(default_factory=list, description="Warning signs or concerns")
    green_flags: List[str] = Field(default_factory=list, description="Positive indicators")
    strengths: List[str] = Field(default_factory=list, description="Key strengths of the candidate")
    weaknesses: List[str] = Field(default_factory=list, description="Areas for improvement")
    recommendations: List[str] = Field(default_factory=list, description="Actionable recommendations")
    detailed_feedback: str = Field(description="Comprehensive narrative evaluation")


# ============================================================================
# Main Output Schema
# ============================================================================

class ResumeEvaluationOutput(BaseModel):
    """Complete resume parsing and evaluation output."""
    candidate_info: CandidateInfo = Field(description="Candidate identification information")
    parsed_data: ParsedResumeData = Field(description="Structured resume data")
    external_profiles: ExternalProfiles = Field(default_factory=ExternalProfiles, description="External profile analysis")
    evaluation: Evaluation = Field(description="Complete evaluation with scores and feedback")

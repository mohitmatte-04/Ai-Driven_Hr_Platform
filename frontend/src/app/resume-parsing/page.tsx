'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/app/homepage/components/Footer';
import BackButton from '@/app/components/BackButton';
import Icon from '@/components/ui/AppIcon';

// TypeScript Interfaces
interface CandidateLinks {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    leetcode?: string;
    hackerrank?: string;
    codeforces?: string;
    stackoverflow?: string;
    other?: string[];
}

interface CandidateInfo {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    target_job_title: string;
    links: CandidateLinks;
}

interface TechnicalSkills {
    programming_languages: string[];
    frameworks: string[];
    databases: string[];
    cloud_platforms: string[];
    devops_tools: string[];
    tools: string[];
    methodologies: string[];
    soft_skills: string[];
}

interface WorkExperience {
    company: string;
    title: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    duration?: string;
    responsibilities: string[];
    achievements: string[];
    technologies: string[];
}

interface Education {
    degree: string;
    field?: string;
    institution: string;
    year?: number;
    gpa?: string;
    honors?: string;
}

interface Project {
    name: string;
    description: string;
    technologies: string[];
    role?: string;
    github_link?: string;
    live_demo?: string;
    impact?: string;
}

interface Certification {
    name: string;
    issuer: string;
    date?: string;
    expiry?: string;
    credential_id?: string;
}

interface Evaluation {
    final_score: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    strengths: string[];
    weaknesses: string[];
    red_flags: string[];
    green_flags: string[];
}

interface ParsedCandidate {
    candidate_id: string;
    candidate_info: CandidateInfo;
    parsed_data: {
        summary?: string;
        total_experience_years: number;
        education: Education[];
        work_experience: WorkExperience[];
        technical_skills: TechnicalSkills;
        projects: Project[];
        certifications: Certification[];
    };
    evaluation: Evaluation;
    external_profiles?: any;
    created_at: string;
}

export default function ResumeParsingPage() {
    const [candidates, setCandidates] = useState<ParsedCandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [fetchingCandidates, setFetchingCandidates] = useState(false);
    const [error, setError] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState<ParsedCandidate | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

    // Fetch existing parsed candidates on component mount
    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        setFetchingCandidates(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/resume/list`);
            if (response.ok) {
                const data = await response.json();
                setCandidates(data);
            }
        } catch (err) {
            console.error('Failed to fetch candidates:', err);
        } finally {
            setFetchingCandidates(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(Array.from(e.target.files));
        }
    };

    const handleFileSelection = (files: File[]) => {
        // Validate file count (max 5)
        if (files.length > 5) {
            setUploadError('Maximum 5 files allowed per upload');
            return;
        }

        // Validate file types (only PDF)
        const invalidFiles = files.filter(file => !file.name.toLowerCase().endsWith('.pdf'));
        if (invalidFiles.length > 0) {
            setUploadError('Only PDF files are allowed');
            return;
        }

        setSelectedFiles(files);
        setUploadError('');
        setUploadSuccess('');
    };

    const handleUploadResumes = async () => {
        if (selectedFiles.length === 0) {
            setUploadError('Please select at least one PDF file to upload');
            return;
        }

        setUploadLoading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch(`${BACKEND_URL}/api/resume/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload and parse resumes');
            }

            const data = await response.json();

            // Count successful parses
            const successCount = data.filter((r: any) => r.success).length;
            const failCount = data.filter((r: any) => !r.success).length;

            setUploadSuccess(`Successfully parsed ${successCount} resume(s)${failCount > 0 ? `, ${failCount} failed` : ''}`);

            // Refresh candidate list
            await fetchCandidates();

            // Clear selected files
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (err) {
            console.error('Error uploading resumes:', err);
            setUploadError('Failed to upload resumes. Please ensure the backend is running.');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleBatchParse = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BACKEND_URL}/api/resume/batch`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to parse resumes');
            }

            const data = await response.json();

            // Success! Refresh the candidate list
            await fetchCandidates();

        } catch (err) {
            console.error('Error parsing resumes:', err);
            setError('Failed to parse resumes. Please ensure the backend is running and resumes are in the data/resumes folder.');
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A+':
            case 'A':
                return 'bg-green-50 text-green-600 border-green-200';
            case 'B':
                return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'C':
                return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'D':
                return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'F':
                return 'bg-red-50 text-red-600 border-red-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getAllSkills = (skills: TechnicalSkills): string[] => {
        return [
            ...skills.programming_languages,
            ...skills.frameworks,
            ...skills.databases,
            ...skills.cloud_platforms,
            ...skills.devops_tools,
        ].slice(0, 6); // Show top 6 skills
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 px-4 pb-20 max-w-7xl mx-auto">
                <div className="mb-8">
                    <BackButton />
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
                        <Icon name="DocumentMagnifyingGlassIcon" size={36} className="text-primary" variant="solid" />
                        Resume Parsing
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Batch parse resumes and view comprehensive candidate evaluations powered by AI.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Icon name="UserIcon" size={24} className="text-purple-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">{candidates.length}</p>
                                <p className="text-sm text-muted-foreground">Candidates Parsed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Icon name="CheckBadgeIcon" size={24} className="text-green-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">98%</p>
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Icon name="DocumentTextIcon" size={24} className="text-blue-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">All</p>
                                <p className="text-sm text-muted-foreground">Formats Supported</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Upload & Batch Actions Section */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Upload Resumes */}
                        <div className="bg-white rounded-xl shadow-card border border-border p-6">
                            <h2 className="text-xl font-heading font-bold text-foreground mb-4">Upload Resumes</h2>

                            <div className="space-y-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />

                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragActive
                                            ? 'border-primary bg-primary/5'
                                            : 'border-input hover:border-primary hover:bg-muted'
                                        }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {selectedFiles.length > 0 ? (
                                        <div className="space-y-3">
                                            <Icon name="DocumentCheckIcon" size={40} className="mx-auto text-green-600" variant="solid" />
                                            <div>
                                                <p className="text-sm font-semibold text-foreground mb-2">{selectedFiles.length} file(s) selected</p>
                                                <div className="text-xs text-muted-foreground space-y-1">
                                                    {selectedFiles.map((file, i) => (
                                                        <p key={i} className="truncate">{file.name}</p>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFiles([]);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="text-xs text-red-600 hover:underline"
                                            >
                                                Clear selection
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Icon name="CloudArrowUpIcon" size={48} className="mx-auto text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-semibold text-foreground mb-1">
                                                    Drop PDF files here or click to browse
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Maximum 5 files per upload
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {uploadError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{uploadError}</p>
                                    </div>
                                )}

                                {uploadSuccess && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-600">{uploadSuccess}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleUploadResumes}
                                    disabled={uploadLoading || selectedFiles.length === 0}
                                    className="w-full px-6 py-3 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploadLoading ? (
                                        <>
                                            <Icon name="ArrowPathIcon" size={20} className="inline mr-2 animate-spin" />
                                            Uploading & Parsing...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="CloudArrowUpIcon" size={20} className="inline mr-2" />
                                            Upload & Parse Resumes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* OR Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-background text-muted-foreground font-semibold">OR</span>
                            </div>
                        </div>

                        {/* Batch Processing */}
                        <div className="bg-white rounded-xl shadow-card border border-border p-6">
                            <h2 className="text-xl font-heading font-bold text-foreground mb-4">Batch Processing</h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                    <p className="text-sm font-semibold text-foreground mb-2">Instructions:</p>
                                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                                        <li>Place resume files in <code className="bg-white px-1 py-0.5 rounded">backend/data/resumes/</code></li>
                                        <li>Click "Parse All Resumes" below</li>
                                        <li>Wait for processing to complete</li>
                                        <li>View parsed candidates on the right</li>
                                    </ol>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleBatchParse}
                                    disabled={loading}
                                    className="w-full px-6 py-3 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Icon name="ArrowPathIcon" size={20} className="inline mr-2 animate-spin" />
                                            Parsing Resumes...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="SparklesIcon" size={20} className="inline mr-2" />
                                            Parse All Resumes
                                        </>
                                    )}
                                </button>

                                {/* Backend Status */}
                                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-foreground">Backend Status</p>
                                        <div className={`w-2 h-2 rounded-full ${candidates.length > 0 || fetchingCandidates ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Endpoint: <code className="bg-white px-1 py-0.5 rounded">/api/resume/batch</code>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        URL: <code className="bg-white px-1 py-0.5 rounded">{BACKEND_URL}</code>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Candidates List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-card border border-border p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-heading font-bold text-foreground">Parsed Candidates ({candidates.length})</h2>
                                <button
                                    onClick={fetchCandidates}
                                    disabled={fetchingCandidates}
                                    className="text-sm text-primary hover:underline font-semibold flex items-center gap-1"
                                >
                                    <Icon name="ArrowPathIcon" size={16} className={fetchingCandidates ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                            </div>

                            {fetchingCandidates && candidates.length === 0 ? (
                                <div className="text-center py-12">
                                    <Icon name="ArrowPathIcon" size={48} className="mx-auto text-primary mb-4 animate-spin" />
                                    <p className="text-muted-foreground">Loading candidates...</p>
                                </div>
                            ) : candidates.length === 0 ? (
                                <div className="text-center py-12">
                                    <Icon name="UserIcon" size={48} className="mx-auto text-muted-foreground mb-4" variant="outline" />
                                    <p className="text-muted-foreground mb-2">No candidates parsed yet</p>
                                    <p className="text-sm text-muted-foreground">Place resume files in the data/resumes folder and click "Parse All Resumes"!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {candidates.map((candidate, index) => (
                                        <div
                                            key={candidate.candidate_id || index}
                                            className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <h3 className="font-heading font-bold text-primary text-xl">{candidate.candidate_info.name}</h3>
                                                        <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getGradeColor(candidate.evaluation.grade)}`}>
                                                            Grade: {candidate.evaluation.grade}
                                                        </span>
                                                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm font-semibold rounded-full">
                                                            Score: {candidate.evaluation.final_score}/100
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <Icon name="EnvelopeIcon" size={16} />
                                                            <span className="font-medium">{candidate.candidate_info.email}</span>
                                                        </span>
                                                        {candidate.candidate_info.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <Icon name="PhoneIcon" size={16} />
                                                                <span className="font-medium">{candidate.candidate_info.phone}</span>
                                                            </span>
                                                        )}
                                                        {candidate.candidate_info.location && (
                                                            <span className="flex items-center gap-1">
                                                                <Icon name="MapPinIcon" size={16} />
                                                                <span className="font-medium">{candidate.candidate_info.location}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-foreground mb-3">
                                                        <span className="font-semibold text-primary">{candidate.candidate_info.target_job_title}</span>
                                                        <span>•</span>
                                                        <span>{candidate.parsed_data.total_experience_years} years experience</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Top Skills */}
                                            {getAllSkills(candidate.parsed_data.technical_skills).length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-semibold text-foreground mb-2">Top Skills:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {getAllSkills(candidate.parsed_data.technical_skills).map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Expandable Details */}
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <button
                                                    onClick={() => setSelectedCandidate(selectedCandidate?.candidate_id === candidate.candidate_id ? null : candidate)}
                                                    className="w-full flex items-center justify-between text-sm font-semibold text-primary hover:underline mb-2"
                                                >
                                                    <span>{selectedCandidate?.candidate_id === candidate.candidate_id ? 'Hide' : 'View'} Full Profile</span>
                                                    <Icon name={selectedCandidate?.candidate_id === candidate.candidate_id ? "ChevronUpIcon" : "ChevronDownIcon"} size={20} />
                                                </button>

                                                <p className="text-xs text-muted-foreground">Parsed: {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'Recently'}</p>

                                                {/* Expandable content - Will be shown when selectedCandidate matches */}
                                                {selectedCandidate?.candidate_id === candidate.candidate_id && (
                                                    <div className="mt-4 space-y-6 bg-muted/30 p-6 rounded-lg border border-border">
                                                        {/* Summary */}
                                                        {candidate.parsed_data.summary && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground mb-2">Professional Summary</h4>
                                                                <p className="text-sm text-muted-foreground">{candidate.parsed_data.summary}</p>
                                                            </div>
                                                        )}

                                                        {/* Profile Links */}
                                                        {(candidate.candidate_info.links.linkedin || candidate.candidate_info.links.github || candidate.candidate_info.links.portfolio) && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground mb-2">Profile Links</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {candidate.candidate_info.links.linkedin && (
                                                                        <a href={candidate.candidate_info.links.linkedin} target="_blank" rel="noopener noreferrer"
                                                                            className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
                                                                            LinkedIn
                                                                        </a>
                                                                    )}
                                                                    {candidate.candidate_info.links.github && (
                                                                        <a href={candidate.candidate_info.links.github} target="_blank" rel="noopener noreferrer"
                                                                            className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900">
                                                                            GitHub
                                                                        </a>
                                                                    )}
                                                                    {candidate.candidate_info.links.portfolio && (
                                                                        <a href={candidate.candidate_info.links.portfolio} target="_blank" rel="noopener noreferrer"
                                                                            className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700">
                                                                            Portfolio
                                                                        </a>
                                                                    )}
                                                                    {candidate.candidate_info.links.leetcode && (
                                                                        <a href={candidate.candidate_info.links.leetcode} target="_blank" rel="noopener noreferrer"
                                                                            className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600">
                                                                            LeetCode
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Technical Skills - Categorized */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-foreground mb-3">Technical Skills</h4>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                {candidate.parsed_data.technical_skills.programming_languages.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Programming Languages</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {candidate.parsed_data.technical_skills.programming_languages.map((skill, i) => (
                                                                                <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {candidate.parsed_data.technical_skills.frameworks.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Frameworks</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {candidate.parsed_data.technical_skills.frameworks.map((skill, i) => (
                                                                                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {candidate.parsed_data.technical_skills.databases.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Databases</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {candidate.parsed_data.technical_skills.databases.map((skill, i) => (
                                                                                <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {candidate.parsed_data.technical_skills.cloud_platforms.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Cloud Platforms</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {candidate.parsed_data.technical_skills.cloud_platforms.map((skill, i) => (
                                                                                <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {candidate.parsed_data.technical_skills.devops_tools.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">DevOps Tools</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {candidate.parsed_data.technical_skills.devops_tools.map((skill, i) => (
                                                                                <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {candidate.parsed_data.technical_skills.tools.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Tools</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {candidate.parsed_data.technical_skills.tools.map((skill, i) => (
                                                                                <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Work Experience */}
                                                        {candidate.parsed_data.work_experience.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground mb-3">Work Experience</h4>
                                                                <div className="space-y-4">
                                                                    {candidate.parsed_data.work_experience.map((exp, i) => (
                                                                        <div key={i} className="pb-4 border-b border-border last:border-0">
                                                                            <div className="flex items-start justify-between mb-2">
                                                                                <div>
                                                                                    <p className="font-semibold text-foreground">{exp.title}</p>
                                                                                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <p className="text-xs text-muted-foreground">{exp.start_date} - {exp.end_date}</p>
                                                                                    {exp.duration && <p className="text-xs text-muted-foreground">{exp.duration}</p>}
                                                                                </div>
                                                                            </div>
                                                                            {exp.achievements.length > 0 && (
                                                                                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                                                                                    {exp.achievements.slice(0, 3).map((achievement, j) => (
                                                                                        <li key={j}>{achievement}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Education */}
                                                        {candidate.parsed_data.education.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground mb-3">Education</h4>
                                                                <div className="space-y-3">
                                                                    {candidate.parsed_data.education.map((edu, i) => (
                                                                        <div key={i}>
                                                                            <p className="font-semibold text-foreground">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                                                                            <p className="text-sm text-muted-foreground">{edu.institution} {edu.year && `• ${edu.year}`}</p>
                                                                            {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Projects */}
                                                        {candidate.parsed_data.projects.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground mb-3">Projects</h4>
                                                                <div className="space-y-3">
                                                                    {candidate.parsed_data.projects.map((project, i) => (
                                                                        <div key={i} className="pb-3 border-b border-border last:border-0">
                                                                            <div className="flex items-start justify-between mb-1">
                                                                                <p className="font-semibold text-foreground">{project.name}</p>
                                                                                <div className="flex gap-2">
                                                                                    {project.github_link && (
                                                                                        <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                                                                                            className="text-xs text-blue-600 hover:underline">GitHub</a>
                                                                                    )}
                                                                                    {project.live_demo && (
                                                                                        <a href={project.live_demo} target="_blank" rel="noopener noreferrer"
                                                                                            className="text-xs text-blue-600 hover:underline">Demo</a>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {project.technologies.map((tech, j) => (
                                                                                    <span key={j} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded">{tech}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Certifications */}
                                                        {candidate.parsed_data.certifications.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground mb-3">Certifications</h4>
                                                                <div className="space-y-2">
                                                                    {candidate.parsed_data.certifications.map((cert, i) => (
                                                                        <div key={i}>
                                                                            <p className="font-semibold text-foreground text-sm">{cert.name}</p>
                                                                            <p className="text-xs text-muted-foreground">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Evaluation Summary */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-foreground mb-3">AI Evaluation</h4>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                {candidate.evaluation.strengths.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-green-600 mb-2">✓ Strengths</p>
                                                                        <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                                                                            {candidate.evaluation.strengths.map((strength, i) => (
                                                                                <li key={i}>{strength}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {candidate.evaluation.weaknesses.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-orange-600 mb-2">⚠ Areas for Improvement</p>
                                                                        <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                                                                            {candidate.evaluation.weaknesses.map((weakness, i) => (
                                                                                <li key={i}>{weakness}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

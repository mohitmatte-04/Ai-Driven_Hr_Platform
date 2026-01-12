'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/app/homepage/components/Footer';
import BackButton from '@/app/components/BackButton';
import Icon from '@/components/ui/AppIcon';

interface ParsedJob {
    jd_id: string;
    job_id: string;
    role_title: string;
    experience_min: number;
    experience_max: number;
    location: string;
    relocation_allowed?: boolean;
    salary_min?: number;
    salary_max?: number;
    mandatory_skills: string[];
    good_to_have_skills: string[];
    profile_type: string;
    created_at: string;
    created_by?: string;
    status: string;
}

export default function JDParsingPage() {
    const [jobDescription, setJobDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [parsedJobs, setParsedJobs] = useState<ParsedJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchingJobs, setFetchingJobs] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedJob, setSelectedJob] = useState<ParsedJob | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedJob, setEditedJob] = useState<ParsedJob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

    // Fetch existing parsed JDs on component mount
    useEffect(() => {
        fetchParsedJobs();
    }, []);

    const fetchParsedJobs = async () => {
        setFetchingJobs(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/jd/list`);
            if (response.ok) {
                const data = await response.json();
                setParsedJobs(data);
            }
        } catch (err) {
            console.error('Failed to fetch JDs:', err);
        } finally {
            setFetchingJobs(false);
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (file: File) => {
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a PDF, DOCX, or TXT file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setError('');
    };

    const handleParseJD = async () => {
        // Validate input
        if (!jobDescription.trim() && !selectedFile) {
            setError('Please enter job description text or upload a file');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;

            if (selectedFile) {
                // File upload mode - use FormData to send to /parse-file endpoint
                const formData = new FormData();
                formData.append('file', selectedFile);

                response = await fetch(`${BACKEND_URL}/api/jd/parse-file`, {
                    method: 'POST',
                    body: formData,
                });
            } else {
                // Text mode - use JSON to send to /parse endpoint
                response = await fetch(`${BACKEND_URL}/api/jd/parse`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jd_text: jobDescription
                    }),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to parse job description');
            }

            const data = await response.json();

            // Success! Refresh the job list
            await fetchParsedJobs();

            // Reset form
            setJobDescription('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (err) {
            console.error('Error parsing JD:', err);
            setError('Failed to parse job description. Please ensure the backend is running on port 8001.');
        } finally {
            setLoading(false);
        }
    };


    const handleStatusChange = async (jobId: string, newStatus: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/jd/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update local state
                setParsedJobs(parsedJobs.map(job =>
                    job.jd_id === jobId ? { ...job, status: newStatus } : job
                ));

                // Update selected job if it's currently displayed
                if (selectedJob?.jd_id === jobId) {
                    setSelectedJob({ ...selectedJob, status: newStatus });
                }
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            setError('Failed to update job status');
        }
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
                        <Icon name="DocumentTextIcon" size={36} className="text-primary" variant="solid" />
                        JD Parsing
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Upload job descriptions and let our AI automatically extract and organize job details for easy management.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Icon name="DocumentTextIcon" size={24} className="text-blue-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">{parsedJobs.length}</p>
                                <p className="text-sm text-muted-foreground">Jobs Parsed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Icon name="CheckBadgeIcon" size={24} className="text-green-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">99%</p>
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Icon name="BoltIcon" size={24} className="text-purple-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">10x</p>
                                <p className="text-sm text-muted-foreground">Faster Processing</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-card border border-border p-6 sticky top-32">
                            <h2 className="text-xl font-heading font-bold text-foreground mb-6">Parse Job Description</h2>

                            <div className="space-y-6">
                                {/* Text Input Section */}
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Paste Job Description
                                    </label>
                                    <textarea
                                        placeholder="Paste the full job description here..."
                                        rows={8}
                                        value={jobDescription}
                                        onChange={(e) => {
                                            setJobDescription(e.target.value);
                                            setError('');
                                        }}
                                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
                                    />
                                </div>

                                {/* OR Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-muted-foreground">OR</span>
                                    </div>
                                </div>

                                {/* File Upload Section */}
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Upload File (PDF, DOCX, TXT)
                                    </label>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.docx,.doc,.txt"
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
                                        {selectedFile ? (
                                            <div className="space-y-2">
                                                <Icon name="DocumentCheckIcon" size={40} className="mx-auto text-green-600" variant="solid" />
                                                <p className="text-sm font-semibold text-foreground">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFile(null);
                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                    }}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Remove file
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Icon name="CloudArrowUpIcon" size={48} className="mx-auto text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground mb-1">
                                                        Drop your file here or click to browse
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PDF, DOCX, or TXT (max 10MB)
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleParseJD}
                                    disabled={loading}
                                    className="w-full px-6 py-3 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Icon name="ArrowPathIcon" size={20} className="inline mr-2 animate-spin" />
                                            Parsing...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="SparklesIcon" size={20} className="inline mr-2" />
                                            Parse with AI
                                        </>
                                    )}
                                </button>

                                {/* Backend Status */}
                                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-foreground">Backend Status</p>
                                        <div className={`w-2 h-2 rounded-full ${parsedJobs.length > 0 || fetchingJobs ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Endpoint: <code className="bg-white px-1 py-0.5 rounded">/api/jd/parse</code>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        URL: <code className="bg-white px-1 py-0.5 rounded">{BACKEND_URL}</code>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parsed Jobs List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-card border border-border p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-heading font-bold text-foreground">Parsed Jobs ({parsedJobs.length})</h2>
                                <button
                                    onClick={fetchParsedJobs}
                                    disabled={fetchingJobs}
                                    className="text-sm text-primary hover:underline font-semibold flex items-center gap-1"
                                >
                                    <Icon name="ArrowPathIcon" size={16} className={fetchingJobs ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                            </div>

                            {fetchingJobs && parsedJobs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Icon name="ArrowPathIcon" size={48} className="mx-auto text-primary mb-4 animate-spin" />
                                    <p className="text-muted-foreground">Loading parsed jobs...</p>
                                </div>
                            ) : parsedJobs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Icon name="DocumentTextIcon" size={48} className="mx-auto text-muted-foreground mb-4" variant="outline" />
                                    <p className="text-muted-foreground mb-2">No jobs parsed yet</p>
                                    <p className="text-sm text-muted-foreground">Paste a job description or upload a file to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {parsedJobs.map((job, index) => (
                                        <div
                                            key={job.jd_id || index}
                                            className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <h3 className="font-heading font-bold text-primary text-xl">{job.role_title}</h3>
                                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                                                            {job.status || 'Active'}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.profile_type?.toLowerCase().includes('technical')
                                                                ? 'bg-purple-50 text-purple-600 border border-purple-200'
                                                                : 'bg-orange-50 text-orange-600 border border-orange-200'
                                                            }`}>
                                                            {job.profile_type || 'General'}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.relocation_allowed
                                                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                            : 'bg-gray-50 text-gray-600 border border-gray-200'
                                                            }`}>
                                                            {job.relocation_allowed ? '✓ Relocation' : '✗ No Relocation'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Icon name="MapPinIcon" size={16} />
                                                            <span className="font-medium">{job.location || 'Location not specified'}</span>
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Icon name="BriefcaseIcon" size={16} />
                                                            <span className="font-medium">
                                                                {job.experience_min === 0 && job.experience_max === 0
                                                                    ? 'Experience not specified'
                                                                    : `${job.experience_min}-${job.experience_max} years`}
                                                            </span>
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ID: {job.jd_id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mandatory Skills */}
                                            {job.mandatory_skills && job.mandatory_skills.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-semibold text-foreground mb-2">Mandatory Skills:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.mandatory_skills.map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Good to Have Skills */}
                                            {job.good_to_have_skills && job.good_to_have_skills.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-semibold text-foreground mb-2">Good to Have Skills:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.good_to_have_skills.map((skill, i) => (
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
                                                    onClick={() => setSelectedJob(selectedJob?.jd_id === job.jd_id ? null : job)}
                                                    className="w-full flex items-center justify-between text-sm font-semibold text-primary hover:underline mb-2"
                                                >
                                                    <span>{selectedJob?.jd_id === job.jd_id ? 'Hide' : 'View'} Full Details</span>
                                                    <Icon name={selectedJob?.jd_id === job.jd_id ? "ChevronUpIcon" : "ChevronDownIcon"} size={20} />
                                                </button>

                                                {/* Show parsed date */}
                                                <p className="text-xs text-muted-foreground">Parsed: {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}</p>

                                                {/* Expandable content */}
                                                {selectedJob?.jd_id === job.jd_id && (
                                                    <div className="mt-4 space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
                                                        {/* Details Grid */}
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-xs font-semibold text-muted-foreground mb-1">Profile Type</p>
                                                                <p className="text-sm text-foreground">{job.profile_type}</p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs font-semibold text-muted-foreground mb-1">Relocation Allowed</p>
                                                                <p className="text-sm text-foreground">{job.relocation_allowed ? 'Yes' : 'No'}</p>
                                                            </div>

                                                            {(job.salary_min || job.salary_max) && (
                                                                <div>
                                                                    <p className="text-xs font-semibold text-muted-foreground mb-1">Salary Range</p>
                                                                    <p className="text-sm text-foreground">
                                                                        {job.salary_min ? `₹${job.salary_min.toLocaleString()}` : 'N/A'} - {job.salary_max ? `₹${job.salary_max.toLocaleString()}` : 'N/A'}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="text-xs font-semibold text-muted-foreground mb-1">Created By</p>
                                                                <p className="text-sm text-foreground">{job.created_by || 'System'}</p>
                                                            </div>
                                                        </div>

                                                        {/* Status Selector */}
                                                        <div className="pt-4 border-t border-border">
                                                            <label className="block text-xs font-semibold text-muted-foreground mb-2">Update Status</label>
                                                            <select
                                                                value={job.status}
                                                                onChange={(e) => handleStatusChange(job.jd_id, e.target.value)}
                                                                className="px-3 py-2 border border-input rounded-lg text-sm w-full md:w-48 bg-white"
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="closed">Closed</option>
                                                                <option value="draft">Draft</option>
                                                                <option value="on-hold">On Hold</option>
                                                            </select>
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

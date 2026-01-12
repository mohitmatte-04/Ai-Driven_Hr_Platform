'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/app/homepage/components/Footer';
import BackButton from '@/app/components/BackButton';
import Icon from '@/components/ui/AppIcon';

// TypeScript Interfaces
interface Job {
    jd_id: string;
    job_id: string;
    role_title: string;
    experience_min: number;
    experience_max: number;
    location: string;
}

interface MatchScore {
    mandatory_skills_score: number;
    good_to_have_skills_score: number;
    experience_score: number;
    location_score: number;
    salary_score: number;
    total_score: number;
}

interface SkillMatch {
    mandatory_matched: string[];
    mandatory_missing: string[];
    mandatory_coverage_percent: number;
    good_to_have_matched: string[];
    good_to_have_missing: string[];
    good_to_have_coverage_percent: number;
}

interface ExperienceMatch {
    candidate_years: number;
    required_min: number;
    required_max: number;
    alignment: string;
    alignment_notes: string;
}

interface RankedCandidate {
    rank: number;
    candidate_id: string;
    candidate_name: string;
    candidate_email: string;
    resume_evaluation_score: number;
    match_score: MatchScore;
    skill_match: SkillMatch;
    experience_match: ExperienceMatch;
    recommendation: "Highly Recommended" | "Recommended" | "Not Recommended";
    justification: string;
    red_flags: string[];
    green_flags: string[];
}

interface RankingData {
    ranking_id: string;
    ranked_at: string;
    jd_id: string;
    jd_title: string;
    total_candidates_evaluated: number;
    ranked_candidates: RankedCandidate[];
    top_candidates: string[];
    acceptable_candidates: string[];
    not_recommended: string[];
    summary: string;
}

type CategoryFilter = 'all' | 'top' | 'acceptable' | 'not_recommended';

export default function SmartRankingPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJdId, setSelectedJdId] = useState('');
    const [rankingData, setRankingData] = useState<RankingData | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingJobs, setFetchingJobs] = useState(false);
    const [error, setError] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(new Set());

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

    // Fetch available JDs on mount
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setFetchingJobs(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/jd/list`);
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
        } finally {
            setFetchingJobs(false);
        }
    };

    const handleRankCandidates = async (forceRerank: boolean = false) => {
        if (!selectedJdId) {
            setError('Please select a job position first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/ranking/rank/${selectedJdId}${forceRerank ? '?force_rerank=true' : ''}`,
                { method: 'POST' }
            );

            if (!response.ok) {
                throw new Error('Failed to rank candidates');
            }

            const result = await response.json();

            // Fetch full ranking details
            const rankingResponse = await fetch(`${BACKEND_URL}/api/ranking/${result.ranking_id}`);

            if (!rankingResponse.ok) {
                throw new Error('Failed to fetch ranking details');
            }

            const rankingData = await rankingResponse.json();
            setRankingData(rankingData);
            setCategoryFilter('all');
        } catch (err) {
            console.error('Error ranking candidates:', err);
            setError('Failed to rank candidates. Please ensure the backend is running and candidates are parsed.');
        } finally {
            setLoading(false);
        }
    };

    const toggleCandidateExpanded = (candidateId: string) => {
        const newExpanded = new Set(expandedCandidates);
        if (newExpanded.has(candidateId)) {
            newExpanded.delete(candidateId);
        } else {
            newExpanded.add(candidateId);
        }
        setExpandedCandidates(newExpanded);
    };

    const getFilteredCandidates = (): RankedCandidate[] => {
        if (!rankingData) return [];

        switch (categoryFilter) {
            case 'top':
                return rankingData.ranked_candidates.filter(c =>
                    rankingData.top_candidates.includes(c.candidate_id)
                );
            case 'acceptable':
                return rankingData.ranked_candidates.filter(c =>
                    rankingData.acceptable_candidates.includes(c.candidate_id)
                );
            case 'not_recommended':
                return rankingData.ranked_candidates.filter(c =>
                    rankingData.not_recommended.includes(c.candidate_id)
                );
            default:
                return rankingData.ranked_candidates;
        }
    };

    const getCategoryColor = (recommendation: string) => {
        if (recommendation === "Highly Recommended") return "border-green-500";
        if (recommendation === "Recommended") return "border-yellow-500";
        return "border-red-500";
    };

    const getRecommendationBadge = (recommendation: string) => {
        if (recommendation === "Highly Recommended") {
            return "bg-green-50 text-green-600 border-green-200";
        }
        if (recommendation === "Recommended") {
            return "bg-yellow-50 text-yellow-600 border-yellow-200";
        }
        return "bg-red-50 text-red-600 border-red-200";
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
                        <Icon name="ChartBarIcon" size={36} className="text-primary" variant="solid" />
                        Smart Ranking
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        AI-powered candidate ranking based on job requirements. See the best matches at the top instantly.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Icon name="CheckBadgeIcon" size={24} className="text-green-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">
                                    {rankingData ? rankingData.total_candidates_evaluated : '-'}
                                </p>
                                <p className="text-sm text-muted-foreground">Candidates Evaluated</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Icon name="BoltIcon" size={24} className="text-blue-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">
                                    {rankingData ? rankingData.top_candidates.length : '-'}
                                </p>
                                <p className="text-sm text-muted-foreground">Top Candidates</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Icon name="SparklesIcon" size={24} className="text-purple-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">AI-Powered</p>
                                <p className="text-sm text-muted-foreground">Matching</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Selection */}
                <div className="bg-white rounded-xl shadow-card border border-border p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Select Job Position
                            </label>
                            {fetchingJobs ? (
                                <div className="w-full px-4 py-2 border border-input rounded-lg text-muted-foreground">
                                    Loading jobs...
                                </div>
                            ) : (
                                <select
                                    value={selectedJdId}
                                    onChange={(e) => setSelectedJdId(e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Choose a job...</option>
                                    {jobs.map((job) => (
                                        <option key={job.jd_id} value={job.jd_id}>
                                            {job.job_id} - {job.role_title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRankCandidates(false)}
                                disabled={loading || !selectedJdId}
                                className="px-6 py-3 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {loading ? (
                                    <>
                                        <Icon name="ArrowPathIcon" size={20} className="inline mr-2 animate-spin" />
                                        Ranking...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="MagnifyingGlassIcon" size={20} className="inline mr-2" />
                                        Rank Candidates
                                    </>
                                )}
                            </button>
                            {rankingData && (
                                <button
                                    onClick={() => handleRankCandidates(true)}
                                    disabled={loading}
                                    className="px-4 py-3 text-base font-semibold text-foreground bg-white hover:bg-muted border-2 border-border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    <Icon name="ArrowPathIcon" size={20} className="inline mr-2" />
                                    Re-Rank
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                {/* Rankings Section */}
                <div className="bg-white rounded-xl shadow-card border border-border p-6">
                    {rankingData ? (
                        <>
                            {rankingData.total_candidates_evaluated === 0 ? (
                                /* No Matching Candidates */
                                <div className="text-center py-12">
                                    <Icon name="UserGroupIcon" size={48} className="mx-auto text-yellow-500 mb-4" variant="outline" />
                                    <h3 className="text-lg font-bold text-foreground mb-2">No Matching Candidates</h3>
                                    <p className="text-muted-foreground mb-4">{rankingData.summary}</p>
                                    <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-left">
                                        <p className="font-semibold text-yellow-800 mb-2">💡 Suggestion:</p>
                                        <p className="text-yellow-700">
                                            Upload resumes for candidates whose job title matches <strong>"{rankingData.jd_title}"</strong> to see rankings.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Has Candidates - Show Rankings */
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold text-foreground">
                                                Ranked Candidates ({rankingData.total_candidates_evaluated} evaluated)
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">{rankingData.summary}</p>
                                        </div>
                                    </div>

                                    {/* Category Tabs */}
                                    <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
                                        <button
                                            onClick={() => setCategoryFilter('all')}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${categoryFilter === 'all'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                        >
                                            All ({rankingData.ranked_candidates.length})
                                        </button>
                                        <button
                                            onClick={() => setCategoryFilter('top')}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${categoryFilter === 'top'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                        >
                                            Top ({rankingData.top_candidates.length})
                                        </button>
                                        <button
                                            onClick={() => setCategoryFilter('acceptable')}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${categoryFilter === 'acceptable'
                                                ? 'bg-yellow-600 text-white'
                                                : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                                }`}
                                        >
                                            Acceptable ({rankingData.acceptable_candidates.length})
                                        </button>
                                        <button
                                            onClick={() => setCategoryFilter('not_recommended')}
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${categoryFilter === 'not_recommended'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            Not Recommended ({rankingData.not_recommended.length})
                                        </button>
                                    </div>

                                    {/* Candidate Cards */}
                                    <div className="space-y-4">
                                        {getFilteredCandidates().length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground">No candidates in this category</p>
                                            </div>
                                        ) : (
                                            getFilteredCandidates().map((candidate) => (
                                                <div
                                                    key={candidate.candidate_id}
                                                    className={`border-l-4 ${getCategoryColor(candidate.recommendation)} rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                                                >
                                                    <div className="p-6">
                                                        <div className="flex items-start justify-between gap-4 mb-4">
                                                            <div className="flex items-start gap-4 flex-1">
                                                                <div className="text-3xl font-bold text-primary w-12 text-center flex-shrink-0">
                                                                    #{candidate.rank}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                        <h3 className="font-heading font-bold text-primary text-lg">
                                                                            {candidate.candidate_name}
                                                                        </h3>
                                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRecommendationBadge(candidate.recommendation)}`}>
                                                                            {candidate.recommendation}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground mb-3">{candidate.candidate_email}</p>

                                                                    {/* Match Score */}
                                                                    <div className="mb-4">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-sm font-semibold text-foreground">Match Score</span>
                                                                            <span className="text-lg font-bold text-primary">
                                                                                {Math.round(candidate.match_score.total_score)}%
                                                                            </span>
                                                                        </div>
                                                                        <div className="w-full bg-muted rounded-full h-3">
                                                                            <div
                                                                                className="bg-primary h-3 rounded-full transition-all"
                                                                                style={{ width: `${candidate.match_score.total_score}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Resume Score & Experience */}
                                                                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                                                                        <div>
                                                                            <span className="text-muted-foreground">Resume Score: </span>
                                                                            <span className="font-semibold text-foreground">{candidate.resume_evaluation_score}/100</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-muted-foreground">Experience: </span>
                                                                            <span className="font-semibold text-foreground">
                                                                                {candidate.experience_match.candidate_years} years
                                                                            </span>
                                                                            <span className={`ml-2 px-2 py-0.5 text-xs rounded ${candidate.experience_match.alignment === "Perfect Match"
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-yellow-100 text-yellow-700"
                                                                                }`}>
                                                                                {candidate.experience_match.alignment}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Skills Coverage */}
                                                                    <div className="space-y-3 mb-4">
                                                                        <div>
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <span className="text-xs font-semibold text-foreground">Mandatory Skills</span>
                                                                                <span className="text-xs font-bold text-foreground">
                                                                                    {Math.round(candidate.skill_match.mandatory_coverage_percent)}%
                                                                                    ({candidate.skill_match.mandatory_matched.length}/{candidate.skill_match.mandatory_matched.length + candidate.skill_match.mandatory_missing.length})
                                                                                </span>
                                                                            </div>
                                                                            <div className="w-full bg-muted rounded-full h-2">
                                                                                <div
                                                                                    className={`h-2 rounded-full ${candidate.skill_match.mandatory_coverage_percent >= 80
                                                                                        ? 'bg-green-500'
                                                                                        : candidate.skill_match.mandatory_coverage_percent >= 50
                                                                                            ? 'bg-yellow-500'
                                                                                            : 'bg-red-500'
                                                                                        }`}
                                                                                    style={{ width: `${candidate.skill_match.mandatory_coverage_percent}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <span className="text-xs font-semibold text-foreground">Good-to-Have Skills</span>
                                                                                <span className="text-xs font-bold text-foreground">
                                                                                    {Math.round(candidate.skill_match.good_to_have_coverage_percent)}%
                                                                                    ({candidate.skill_match.good_to_have_matched.length}/{candidate.skill_match.good_to_have_matched.length + candidate.skill_match.good_to_have_missing.length})
                                                                                </span>
                                                                            </div>
                                                                            <div className="w-full bg-muted rounded-full h-2">
                                                                                <div
                                                                                    className="bg-blue-500 h-2 rounded-full"
                                                                                    style={{ width: `${candidate.skill_match.good_to_have_coverage_percent}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Matched Skills */}
                                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                                        {candidate.skill_match.mandatory_matched.slice(0, 6).map((skill, i) => (
                                                                            <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                                                                ✓ {skill}
                                                                            </span>
                                                                        ))}
                                                                        {candidate.skill_match.mandatory_matched.length > 6 && (
                                                                            <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full">
                                                                                +{candidate.skill_match.mandatory_matched.length - 6} more
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Missing Mandatory Skills */}
                                                                    {candidate.skill_match.mandatory_missing.length > 0 && (
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {candidate.skill_match.mandatory_missing.slice(0, 4).map((skill, i) => (
                                                                                <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                                                                    ✗ {skill}
                                                                                </span>
                                                                            ))}
                                                                            {candidate.skill_match.mandatory_missing.length > 4 && (
                                                                                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full">
                                                                                    +{candidate.skill_match.mandatory_missing.length - 4} more missing
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Expandable Details */}
                                                        <div className="border-t border-border pt-4">
                                                            <button
                                                                onClick={() => toggleCandidateExpanded(candidate.candidate_id)}
                                                                className="w-full flex items-center justify-between text-sm font-semibold text-primary hover:underline"
                                                            >
                                                                <span>{expandedCandidates.has(candidate.candidate_id) ? 'Hide' : 'View'} Detailed Analysis</span>
                                                                <Icon
                                                                    name={expandedCandidates.has(candidate.candidate_id) ? "ChevronUpIcon" : "ChevronDownIcon"}
                                                                    size={20}
                                                                />
                                                            </button>

                                                            {expandedCandidates.has(candidate.candidate_id) && (
                                                                <div className="mt-4 space-y-4 bg-muted/30 p-4 rounded-lg">
                                                                    {/* Justification */}
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-foreground mb-2">AI Justification</h4>
                                                                        <p className="text-sm text-muted-foreground">{candidate.justification}</p>
                                                                    </div>

                                                                    {/* Green Flags */}
                                                                    {candidate.green_flags.length > 0 && (
                                                                        <div>
                                                                            <h4 className="text-sm font-bold text-green-600 mb-2">✓ Strengths</h4>
                                                                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                                                                {candidate.green_flags.map((flag, i) => (
                                                                                    <li key={i}>{flag}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* Red Flags */}
                                                                    {candidate.red_flags.length > 0 && (
                                                                        <div>
                                                                            <h4 className="text-sm font-bold text-red-600 mb-2">⚠ Concerns</h4>
                                                                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                                                                {candidate.red_flags.map((flag, i) => (
                                                                                    <li key={i}>{flag}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* Score Breakdown */}
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-foreground mb-2">Score Breakdown</h4>
                                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-muted-foreground">Mandatory Skills:</span>
                                                                                <span className="font-semibold">{Math.round(candidate.match_score.mandatory_skills_score)}/40</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-muted-foreground">Good-to-Have:</span>
                                                                                <span className="font-semibold">{Math.round(candidate.match_score.good_to_have_skills_score)}/20</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-muted-foreground">Experience:</span>
                                                                                <span className="font-semibold">{Math.round(candidate.match_score.experience_score)}/25</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-muted-foreground">Location:</span>
                                                                                <span className="font-semibold">{Math.round(candidate.match_score.location_score)}/10</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-muted-foreground">Salary:</span>
                                                                                <span className="font-semibold">{Math.round(candidate.match_score.salary_score)}/5</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Icon name="ChartBarIcon" size={48} className="mx-auto text-muted-foreground mb-4" variant="outline" />
                            <p className="text-muted-foreground mb-2">Select a job to see candidate rankings</p>
                            <p className="text-sm text-muted-foreground">Choose a job position above and click "Rank Candidates"</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}


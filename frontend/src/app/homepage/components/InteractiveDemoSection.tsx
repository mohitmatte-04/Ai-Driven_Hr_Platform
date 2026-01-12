'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface DemoTab {
    id: string;
    label: string;
    icon: string;
    description: string;
}

interface InteractiveDemoSectionProps {
    className?: string;
}

const InteractiveDemoSection = ({ className = '' }: InteractiveDemoSectionProps) => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeTab, setActiveTab] = useState('parsing');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const demoTabs: DemoTab[] = [
        {
            id: 'parsing',
            label: 'Resume Parsing',
            icon: 'DocumentTextIcon',
            description: 'Upload a resume and watch AI extract key information instantly'
        },
        {
            id: 'ranking',
            label: 'Candidate Ranking',
            icon: 'ChartBarIcon',
            description: 'See how candidates are automatically ranked by match score'
        },
        {
            id: 'communication',
            label: 'Communication',
            icon: 'ChatBubbleLeftRightIcon',
            description: 'Experience automated candidate engagement workflows'
        }
    ];

    const handleTabChange = (tabId: string) => {
        if (!isHydrated) return;
        setActiveTab(tabId);
    };

    const handleProcessDemo = () => {
        if (!isHydrated) return;
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
    };

    if (!isHydrated) {
        return (
            <section className={`py-20 lg:py-28 bg-gradient-to-br from-white via-red-50/20 to-white ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
                            Experience Hiring Intelligence Platform in Action
                        </h2>
                        <p className="text-lg text-muted-foreground">Loading interactive demo...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`py-20 lg:py-28 bg-gradient-to-br from-white via-red-50/20 to-white ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
                        Experience Hiring Intelligence Platform in Action
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Try our interactive demo to see how AI-powered recruitment can transform your hiring process.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-elevated border border-border overflow-hidden">
                    {/* Demo Tabs */}
                    <div className="border-b border-border">
                        <div className="flex overflow-x-auto">
                            {demoTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex-1 min-w-[200px] px-6 py-4 text-left transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-primary/5 border-b-2 border-primary' : 'hover:bg-muted'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Icon
                                            name={tab.icon as any}
                                            size={24}
                                            className={activeTab === tab.id ? 'text-[#696969]' : 'text-muted-foreground'}
                                            variant={activeTab === tab.id ? 'solid' : 'outline'}
                                        />
                                        <span className="font-semibold" style={activeTab === tab.id ? { color: '#696969' } : undefined}>
                                            {tab.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{tab.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Demo Content */}
                    <div className="p-8 lg:p-12">
                        {activeTab === 'parsing' && (
                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                                    <Icon name="CloudArrowUpIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
                                    <p className="text-lg font-semibold text-foreground mb-2">Drop resume file here or click to upload</p>
                                    <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX formats</p>
                                </div>

                                <button
                                    onClick={handleProcessDemo}
                                    disabled={isProcessing}
                                    className="w-full px-6 py-4 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card hover:shadow-coral transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                                            <span>Processing Resume...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="BoltIcon" size={20} variant="solid" />
                                            <span>Parse Resume with AI</span>
                                        </>
                                    )}
                                </button>

                                {isProcessing && (
                                    <div className="bg-muted rounded-xl p-6 space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                                            <span className="text-sm text-muted-foreground">Extracting candidate information...</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                                            <span className="text-sm text-muted-foreground">Analyzing work experience...</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                                            <span className="text-sm text-muted-foreground">Identifying skills and qualifications...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'ranking' && (
                            <div className="space-y-4">
                                <div className="bg-muted rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Top Candidates for Senior Developer Role</h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Alex Thompson', score: 96, skills: 'React, TypeScript, Node.js' },
                                            { name: 'Maria Garcia', score: 92, skills: 'Python, Django, PostgreSQL' },
                                            { name: 'James Wilson', score: 88, skills: 'Java, Spring Boot, AWS' }
                                        ].map((candidate, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <span className="text-lg font-bold" style={{ color: '#696969' }}>#{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{candidate.name}</p>
                                                        <p className="text-sm text-muted-foreground">{candidate.skills}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-3xl font-bold" style={{ color: '#696969' }}>{candidate.score}</p>
                                                    <p className="text-xs text-muted-foreground">Match Score</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'communication' && (
                            <div className="space-y-4">
                                <div className="bg-muted rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Automated Communication Timeline</h3>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'Application Received', time: 'Immediate', status: 'completed' },
                                            { action: 'Initial Screening Email', time: '2 hours', status: 'completed' },
                                            { action: 'Interview Invitation', time: '1 day', status: 'pending' },
                                            { action: 'Follow-up Reminder', time: '3 days', status: 'scheduled' }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-success/10' :
                                                    item.status === 'pending' ? 'bg-warning/10' : 'bg-muted-foreground/10'
                                                    }`}>
                                                    <Icon
                                                        name={item.status === 'completed' ? 'CheckIcon' : 'ClockIcon'}
                                                        size={20}
                                                        className={
                                                            item.status === 'completed' ? 'text-success' :
                                                                item.status === 'pending' ? 'text-warning' : 'text-muted-foreground'
                                                        }
                                                        variant="solid"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-foreground">{item.action}</p>
                                                    <p className="text-sm text-muted-foreground">{item.time}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'completed' ? 'bg-success/10 text-success' :
                                                    item.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-muted-foreground/10 text-muted-foreground'
                                                    }`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveDemoSection;

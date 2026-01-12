import React from 'react';

interface HeroSectionProps {
    className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
    return (
        <section className={`bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 lg:py-24 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <span className="text-sm font-semibold text-primary">Trusted by 500+ Companies</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
                        Real Results from Real Recruiters
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                        Discover how leading organizations are transforming their hiring processes with Hiring Intelligence Platform. From Fortune 500 companies to fast-growing startups, see the measurable impact of AI-powered recruitment.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 pt-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">85%</div>
                            <div className="text-sm text-muted-foreground">Time Saved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">3.2x</div>
                            <div className="text-sm text-muted-foreground">Faster Hiring</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">92%</div>
                            <div className="text-sm text-muted-foreground">Match Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">$2.4M</div>
                            <div className="text-sm text-muted-foreground">Avg. Annual Savings</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

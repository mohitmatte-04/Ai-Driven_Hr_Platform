'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CalculatorInputs {
    recruiters: number;
    avgTimePerHire: number;
    avgHiresPerMonth: number;
    avgRecruiterSalary: number;
}

interface CalculatorResults {
    currentMonthlyCost: number;
    timeSaved: number;
    monthlySavings: number;
    annualSavings: number;
    roi: number;
}

interface ROICalculatorProps {
    className?: string;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ className = '' }) => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [inputs, setInputs] = useState<CalculatorInputs>({
        recruiters: 5,
        avgTimePerHire: 40,
        avgHiresPerMonth: 10,
        avgRecruiterSalary: 65000
    });

    const [results, setResults] = useState<CalculatorResults>({
        currentMonthlyCost: 0,
        timeSaved: 0,
        monthlySavings: 0,
        annualSavings: 0,
        roi: 0
    });

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        const hourlyRate = inputs.avgRecruiterSalary / 2080;
        const currentMonthlyCost = inputs.avgTimePerHire * inputs.avgHiresPerMonth * hourlyRate;
        const timeSavedPercentage = 0.85;
        const timeSaved = inputs.avgTimePerHire * timeSavedPercentage;
        const monthlySavings = currentMonthlyCost * timeSavedPercentage;
        const annualSavings = monthlySavings * 12;
        const platformCost = 499 * 12;
        const roi = ((annualSavings - platformCost) / platformCost) * 100;

        setResults({
            currentMonthlyCost,
            timeSaved,
            monthlySavings,
            annualSavings,
            roi
        });
    }, [inputs, isHydrated]);

    const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
        if (!isHydrated) return;
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    if (!isHydrated) {
        return (
            <section className={`bg-gradient-to-br from-primary/5 to-secondary/5 py-16 lg:py-24 ${className}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                            Calculate Your ROI
                        </h2>
                        <p className="text-lg text-muted-foreground">Loading calculator...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`bg-gradient-to-br from-primary/5 to-secondary/5 py-16 lg:py-24 ${className}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Calculate Your ROI
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        See how much time and money you could save with Hiring Intelligence Platform
                    </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-heading font-bold text-foreground mb-6">Your Current Situation</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Number of Recruiters
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.recruiters}
                                        onChange={(e) => handleInputChange('recruiters', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Average Hours Per Hire
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.avgTimePerHire}
                                        onChange={(e) => handleInputChange('avgTimePerHire', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Average Hires Per Month
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.avgHiresPerMonth}
                                        onChange={(e) => handleInputChange('avgHiresPerMonth', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Average Recruiter Salary (Annual)
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.avgRecruiterSalary}
                                        onChange={(e) => handleInputChange('avgRecruiterSalary', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        min="1"
                                        step="1000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-heading font-bold text-foreground mb-6">Your Potential Savings</h3>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon name="ClockIcon" size={24} className="text-primary" />
                                        <span className="text-sm font-semibold text-muted-foreground">Time Saved Per Hire</span>
                                    </div>
                                    <div className="text-3xl font-bold text-primary">
                                        {results.timeSaved.toFixed(1)} hours
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon name="CurrencyDollarIcon" size={24} className="text-success" />
                                        <span className="text-sm font-semibold text-muted-foreground">Monthly Savings</span>
                                    </div>
                                    <div className="text-3xl font-bold text-success">
                                        ${results.monthlySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon name="ChartBarIcon" size={24} className="text-accent" />
                                        <span className="text-sm font-semibold text-muted-foreground">Annual Savings</span>
                                    </div>
                                    <div className="text-3xl font-bold text-accent">
                                        ${results.annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-6 text-white">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon name="SparklesIcon" size={24} />
                                        <span className="text-sm font-semibold">Return on Investment</span>
                                    </div>
                                    <div className="text-4xl font-bold">
                                        {results.roi.toFixed(0)}%
                                    </div>
                                    <p className="text-sm mt-2 opacity-90">
                                        Based on $499/month platform cost
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Ready to start saving? Get started with a free trial today.
                        </p>
                        <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors">
                            <span>Start Free Trial</span>
                            <Icon name="ArrowRightIcon" size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ROICalculator;

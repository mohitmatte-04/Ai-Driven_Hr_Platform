'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOption {
    id: string;
    label: string;
}

interface FilterBarProps {
    selectedIndustry: string;
    selectedCompanySize: string;
    onIndustryChange: (industry: string) => void;
    onCompanySizeChange: (size: string) => void;
    className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
    selectedIndustry,
    selectedCompanySize,
    onIndustryChange,
    onCompanySizeChange,
    className = ''
}) => {
    const industries: FilterOption[] = [
        { id: 'all', label: 'All Industries' },
        { id: 'technology', label: 'Technology' },
        { id: 'healthcare', label: 'Healthcare' },
        { id: 'finance', label: 'Finance' },
        { id: 'retail', label: 'Retail' },
        { id: 'manufacturing', label: 'Manufacturing' }
    ];

    const companySizes: FilterOption[] = [
        { id: 'all', label: 'All Sizes' },
        { id: 'startup', label: 'Startup (1-50)' },
        { id: 'small', label: 'Small (51-200)' },
        { id: 'medium', label: 'Medium (201-1000)' },
        { id: 'enterprise', label: 'Enterprise (1000+)' }
    ];

    return (
        <div className={`bg-card border border-border rounded-lg p-4 lg:p-6 ${className}`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-2 text-foreground">
                    <Icon name="FunnelIcon" size={20} className="text-primary" />
                    <span className="font-semibold">Filter Stories:</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="flex-1">
                        <select
                            value={selectedIndustry}
                            onChange={(e) => onIndustryChange(e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            {industries.map((industry) => (
                                <option key={industry.id} value={industry.id}>
                                    {industry.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <select
                            value={selectedCompanySize}
                            onChange={(e) => onCompanySizeChange(e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            {companySizes.map((size) => (
                                <option key={size.id} value={size.id}>
                                    {size.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;

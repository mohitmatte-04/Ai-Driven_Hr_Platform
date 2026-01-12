'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOption {
    label: string;
    value: string;
    count: number;
}

interface FilterPanelProps {
    onFilterChange: (filters: {
        categories: string[];
        types: string[];
        industries: string[];
    }) => void;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const categories: FilterOption[] = [
        { label: 'Best Practices', value: 'best-practices', count: 24 },
        { label: 'Industry Insights', value: 'industry-insights', count: 18 },
        { label: 'How-To Guides', value: 'how-to-guides', count: 32 },
        { label: 'Templates', value: 'templates', count: 15 },
        { label: 'Benchmarks', value: 'benchmarks', count: 12 },
        { label: 'Trends', value: 'trends', count: 20 },
    ];

    const types: FilterOption[] = [
        { label: 'Article', value: 'article', count: 45 },
        { label: 'Guide', value: 'guide', count: 28 },
        { label: 'Template', value: 'template', count: 15 },
        { label: 'Webinar', value: 'webinar', count: 12 },
        { label: 'Checklist', value: 'checklist', count: 10 },
        { label: 'Report', value: 'report', count: 11 },
    ];

    const industries: FilterOption[] = [
        { label: 'Technology', value: 'technology', count: 35 },
        { label: 'Healthcare', value: 'healthcare', count: 22 },
        { label: 'Finance', value: 'finance', count: 18 },
        { label: 'Retail', value: 'retail', count: 15 },
        { label: 'Manufacturing', value: 'manufacturing', count: 12 },
        { label: 'Education', value: 'education', count: 19 },
    ];

    const handleCategoryToggle = (value: string) => {
        const updated = selectedCategories.includes(value)
            ? selectedCategories.filter(c => c !== value)
            : [...selectedCategories, value];
        setSelectedCategories(updated);
        onFilterChange({
            categories: updated,
            types: selectedTypes,
            industries: selectedIndustries,
        });
    };

    const handleTypeToggle = (value: string) => {
        const updated = selectedTypes.includes(value)
            ? selectedTypes.filter(t => t !== value)
            : [...selectedTypes, value];
        setSelectedTypes(updated);
        onFilterChange({
            categories: selectedCategories,
            types: updated,
            industries: selectedIndustries,
        });
    };

    const handleIndustryToggle = (value: string) => {
        const updated = selectedIndustries.includes(value)
            ? selectedIndustries.filter(i => i !== value)
            : [...selectedIndustries, value];
        setSelectedIndustries(updated);
        onFilterChange({
            categories: selectedCategories,
            types: selectedTypes,
            industries: updated,
        });
    };

    const handleClearAll = () => {
        setSelectedCategories([]);
        setSelectedTypes([]);
        setSelectedIndustries([]);
        onFilterChange({
            categories: [],
            types: [],
            industries: [],
        });
    };

    const totalFilters = selectedCategories.length + selectedTypes.length + selectedIndustries.length;

    if (!isHydrated) {
        return (
            <div className="bg-card rounded-lg shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-heading font-bold text-foreground">Filters</h3>
                </div>
            </div>
        );
    }

    const FilterContent = () => (
        <>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-bold text-foreground">Filters</h3>
                {totalFilters > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-primary hover:text-accent font-semibold transition-colors"
                    >
                        Clear All ({totalFilters})
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Category</h4>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label
                                key={category.value}
                                className="flex items-center justify-between cursor-pointer group"
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.value)}
                                        onChange={() => handleCategoryToggle(category.value)}
                                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                                    />
                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                        {category.label}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{category.count}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Content Type</h4>
                    <div className="space-y-2">
                        {types.map((type) => (
                            <label
                                key={type.value}
                                className="flex items-center justify-between cursor-pointer group"
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type.value)}
                                        onChange={() => handleTypeToggle(type.value)}
                                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                                    />
                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                        {type.label}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{type.count}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Industry</h4>
                    <div className="space-y-2">
                        {industries.map((industry) => (
                            <label
                                key={industry.value}
                                className="flex items-center justify-between cursor-pointer group"
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIndustries.includes(industry.value)}
                                        onChange={() => handleIndustryToggle(industry.value)}
                                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                                    />
                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                        {industry.label}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{industry.count}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed bottom-20 right-4 z-40 p-4 bg-primary text-primary-foreground rounded-full shadow-elevated hover:bg-accent transition-colors"
                aria-label="Toggle filters"
            >
                <Icon name="AdjustmentsHorizontalIcon" size={24} />
                {totalFilters > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                        {totalFilters}
                    </span>
                )}
            </button>

            {/* Mobile Filter Panel */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileOpen(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-80 bg-card shadow-elevated overflow-y-auto p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
                            aria-label="Close filters"
                        >
                            <Icon name="XMarkIcon" size={24} />
                        </button>
                        <FilterContent />
                    </div>
                </div>
            )}

            {/* Desktop Filter Panel */}
            <div className="hidden lg:block bg-card rounded-lg shadow-card p-6 sticky top-24">
                <FilterContent />
            </div>
        </>
    );
}

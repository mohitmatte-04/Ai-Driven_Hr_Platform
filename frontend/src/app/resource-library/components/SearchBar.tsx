'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search resources...' }: SearchBarProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const popularSearches = [
        'AI recruitment trends',
        'Candidate screening best practices',
        'Interview templates',
        'Hiring benchmarks 2026',
        'Remote hiring guide',
        'Diversity recruitment',
        'ATS integration',
        'Recruitment automation',
    ];

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        if (value.length > 2) {
            const filtered = popularSearches.filter(search =>
                search.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (!isHydrated) {
        return (
            <div className="relative w-full max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full px-6 py-4 pl-14 pr-14 text-lg border-2 border-border rounded-lg bg-background"
                        placeholder={placeholder}
                        disabled
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
                <Icon
                    name="MagnifyingGlassIcon"
                    size={24}
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-6 py-4 pl-14 pr-14 text-lg border-2 border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background text-foreground"
                    placeholder={placeholder}
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSuggestions([]);
                            setShowSuggestions(false);
                            onSearch('');
                        }}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        <Icon name="XMarkIcon" size={20} />
                    </button>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-popover rounded-lg shadow-elevated border border-border">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-6 py-3 text-left hover:bg-muted transition-colors flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg"
                        >
                            <Icon name="MagnifyingGlassIcon" size={16} className="text-muted-foreground" />
                            <span className="text-foreground">{suggestion}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

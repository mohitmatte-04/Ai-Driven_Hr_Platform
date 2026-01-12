'use client';

import { useState, useEffect } from 'react';
import ResourceCard from './ResourceCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import NewsletterSignup from './NewsletterSignup';
import UpcomingWebinars from './UpcomingWebinars';
import Icon from '@/components/ui/AppIcon';

interface Resource {
    id: number;
    title: string;
    description: string;
    category: string;
    type: string;
    image: string;
    alt: string;
    author: string;
    date: string;
    readTime: string;
    downloads: number;
    rating: number;
    tags: string[];
    industry: string;
}

export default function ResourceLibraryInteractive() {
    const [isHydrated, setIsHydrated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filters, setFilters] = useState({
        categories: [] as string[],
        types: [] as string[],
        industries: [] as string[]
    });

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const allResources: Resource[] = [
        {
            id: 1,
            title: 'The Complete Guide to AI-Powered Recruitment in 2026',
            description: 'Discover how artificial intelligence is revolutionizing the recruitment landscape. Learn about the latest AI tools, best practices for implementation, and real-world success stories from leading companies.',
            category: 'Best Practices',
            type: 'Guide',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1339d031a-1764642895849.png",
            alt: 'Modern office workspace with laptop showing recruitment analytics dashboard and coffee cup',
            author: 'Dr. Sarah Mitchell',
            date: 'Jan 8, 2026',
            readTime: '12 min read',
            downloads: 1247,
            rating: 4.8,
            tags: ['AI', 'Automation', 'Technology'],
            industry: 'technology'
        },
        {
            id: 2,
            title: 'Candidate Screening Checklist: 15 Essential Steps',
            description: 'A comprehensive checklist to ensure you never miss critical steps in your candidate screening process. Includes templates and best practices from top recruiters.',
            category: 'Templates',
            type: 'Checklist',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eeabcb8c-1766854969750.png",
            alt: 'Professional recruiter reviewing candidate documents with checklist on desk',
            author: 'Michael Chen',
            date: 'Jan 5, 2026',
            readTime: '8 min read',
            downloads: 892,
            rating: 4.9,
            tags: ['Screening', 'Process', 'Templates'],
            industry: 'technology'
        },
        {
            id: 3,
            title: '2026 Recruitment Benchmarks Report',
            description: 'Industry-leading data on hiring metrics, time-to-hire, cost-per-hire, and candidate quality across different sectors. Essential reading for data-driven recruiters.',
            category: 'Benchmarks',
            type: 'Report',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c3895ecc-1764656426788.png",
            alt: 'Business analytics charts and graphs showing recruitment metrics on computer screen',
            author: 'Emily Rodriguez',
            date: 'Jan 3, 2026',
            readTime: '15 min read',
            downloads: 2134,
            rating: 4.7,
            tags: ['Data', 'Metrics', 'Industry'],
            industry: 'finance'
        },
        {
            id: 4,
            title: 'Building Diverse Teams: A Practical Framework',
            description: 'Learn proven strategies for creating inclusive hiring processes that attract and retain diverse talent. Includes actionable steps and real case studies.',
            category: 'Best Practices',
            type: 'Article',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_171170bd3-1764687877901.png",
            alt: 'Diverse team of professionals collaborating around conference table in modern office',
            author: 'James Thompson',
            date: 'Dec 28, 2025',
            readTime: '10 min read',
            downloads: 1567,
            rating: 4.9,
            tags: ['Diversity', 'Inclusion', 'Culture'],
            industry: 'healthcare'
        },
        {
            id: 5,
            title: 'Remote Hiring Best Practices: Complete Playbook',
            description: 'Master the art of remote recruitment with this comprehensive guide covering virtual interviews, remote assessments, and digital onboarding strategies.',
            category: 'How-To Guides',
            type: 'Guide',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_18127f02f-1764714866990.png",
            alt: 'Person conducting video interview on laptop in home office setup',
            author: 'Lisa Anderson',
            date: 'Dec 22, 2025',
            readTime: '14 min read',
            downloads: 1823,
            rating: 4.8,
            tags: ['Remote Work', 'Virtual', 'Process'],
            industry: 'technology'
        },
        {
            id: 6,
            title: 'Interview Question Templates for Technical Roles',
            description: 'Ready-to-use interview questions for software engineers, data scientists, and other technical positions. Includes scoring rubrics and evaluation criteria.',
            category: 'Templates',
            type: 'Template',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1141ac617-1768023474572.png",
            alt: 'Interviewer taking notes during technical interview with candidate at desk',
            author: 'David Park',
            date: 'Dec 18, 2025',
            readTime: '6 min read',
            downloads: 2456,
            rating: 4.9,
            tags: ['Interviews', 'Technical', 'Templates'],
            industry: 'technology'
        },
        {
            id: 7,
            title: 'The Future of Recruitment: 2026 Trends Analysis',
            description: 'Explore emerging trends shaping the recruitment industry including AI advancements, candidate expectations, and evolving workplace dynamics.',
            category: 'Trends',
            type: 'Article',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ce42dfc3-1766760009915.png",
            alt: 'Futuristic digital interface showing recruitment technology trends and analytics',
            author: 'Rachel Green',
            date: 'Dec 15, 2025',
            readTime: '11 min read',
            downloads: 1678,
            rating: 4.7,
            tags: ['Trends', 'Future', 'Innovation'],
            industry: 'retail'
        },
        {
            id: 8,
            title: 'Healthcare Recruitment: Specialized Strategies',
            description: 'Industry-specific recruitment strategies for healthcare organizations. Learn how to attract and retain top medical professionals in a competitive market.',
            category: 'Industry Insights',
            type: 'Article',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_112e34ddc-1767887234192.png",
            alt: 'Healthcare professionals in medical scrubs collaborating in hospital corridor',
            author: 'Dr. Amanda Foster',
            date: 'Dec 10, 2025',
            readTime: '13 min read',
            downloads: 1234,
            rating: 4.8,
            tags: ['Healthcare', 'Industry', 'Specialized'],
            industry: 'healthcare'
        },
        {
            id: 9,
            title: 'Candidate Experience Optimization Guide',
            description: 'Transform your candidate experience with proven strategies that improve engagement, reduce drop-off rates, and enhance your employer brand.',
            category: 'How-To Guides',
            type: 'Guide',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_11a3bc1f1-1767656454658.png",
            alt: 'Smiling candidate shaking hands with recruiter in bright modern office reception',
            author: 'Kevin Martinez',
            date: 'Dec 5, 2025',
            readTime: '9 min read',
            downloads: 1445,
            rating: 4.9,
            tags: ['Experience', 'Engagement', 'Brand'],
            industry: 'manufacturing'
        }];


    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
    };

    const handleDownload = (resourceId: number) => {
        console.log(`Downloading resource ${resourceId}`);
    };

    const filteredResources = allResources.filter((resource) => {
        const matchesSearch = searchQuery === '' ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = filters.categories.length === 0 ||
            filters.categories.some((cat) => resource.category.toLowerCase().replace(/\s+/g, '-') === cat);

        const matchesType = filters.types.length === 0 ||
            filters.types.some((type) => resource.type.toLowerCase() === type);

        const matchesIndustry = filters.industries.length === 0 ||
            filters.industries.includes(resource.industry);

        return matchesSearch && matchesCategory && matchesType && matchesIndustry;
    });

    const sortedResources = [...filteredResources].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'popular':
                return b.downloads - a.downloads;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                            Resource Library
                        </h1>
                    </div>
                </div>
            </div>);

    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
                            Resource Library
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Explore our comprehensive collection of guides, templates, and insights to transform your recruitment process
                        </p>
                    </div>

                    <SearchBar onSearch={handleSearch} />

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Icon name="DocumentTextIcon" size={16} />
                            <span>121 Resources</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Icon name="UserGroupIcon" size={16} />
                            <span>15,000+ Downloads</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Icon name="StarIcon" size={16} />
                            <span>4.8 Average Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-3">
                        <FilterPanel onFilterChange={handleFilterChange} />
                    </div>

                    {/* Resources Grid */}
                    <div className="lg:col-span-9 mt-8 lg:mt-0">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-muted-foreground">
                                    {sortedResources.length} {sortedResources.length === 1 ? 'resource' : 'resources'} found
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border-2 border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background text-foreground text-sm">

                                    <option value="newest">Newest First</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                </select>

                                <div className="flex items-center space-x-2 border-2 border-border rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
                                        }
                                        aria-label="Grid view">

                                        <Icon name="Squares2X2Icon" size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
                                        }
                                        aria-label="List view">

                                        <Icon name="ListBulletIcon" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Resources Display */}
                        {sortedResources.length > 0 ?
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                                {sortedResources.map((resource) =>
                                    <ResourceCard
                                        key={resource.id}
                                        resource={resource}
                                        onDownload={handleDownload} />

                                )}
                            </div> :

                            <div className="text-center py-16">
                                <Icon name="FolderOpenIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                                    No resources found
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Try adjusting your filters or search query
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilters({ categories: [], types: [], industries: [] });
                                    }}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold">

                                    Clear All Filters
                                </button>
                            </div>
                        }
                    </div>
                </div>

                {/* Upcoming Webinars Section */}
                <div className="mt-16">
                    <UpcomingWebinars />
                </div>

                {/* Newsletter Signup */}
                <div className="mt-16">
                    <NewsletterSignup />
                </div>
            </div>
        </div>);

}

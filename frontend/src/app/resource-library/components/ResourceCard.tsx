'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ResourceCardProps {
    resource: {
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
    };
    onDownload: (id: number) => void;
}

export default function ResourceCard({ resource, onDownload }: ResourceCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Best Practices': 'bg-blue-100 text-blue-800',
            'Industry Insights': 'bg-purple-100 text-purple-800',
            'How-To Guides': 'bg-green-100 text-green-800',
            'Templates': 'bg-orange-100 text-orange-800',
            'Benchmarks': 'bg-pink-100 text-pink-800',
            'Trends': 'bg-indigo-100 text-indigo-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getTypeIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            'Article': 'DocumentTextIcon',
            'Guide': 'BookOpenIcon',
            'Template': 'DocumentDuplicateIcon',
            'Webinar': 'VideoCameraIcon',
            'Checklist': 'ClipboardDocumentCheckIcon',
            'Report': 'ChartBarIcon',
        };
        return icons[type] || 'DocumentIcon';
    };

    return (
        <div className="bg-card rounded-lg shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
                <AppImage
                    src={resource.image}
                    alt={resource.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                    </span>
                </div>
                <button
                    onClick={handleBookmark}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-card hover:shadow-elevated transition-all duration-200"
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                    <Icon
                        name={isBookmarked ? 'BookmarkIcon' : 'BookmarkIcon'}
                        variant={isBookmarked ? 'solid' : 'outline'}
                        size={20}
                        className={isBookmarked ? 'text-primary' : 'text-gray-600'}
                    />
                </button>
            </div>

            <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                    <Icon name={getTypeIcon(resource.type)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{resource.type}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{resource.readTime}</span>
                </div>

                <h3 className="text-xl font-heading font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {resource.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {resource.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Icon name="StarIcon" variant="solid" size={16} className="text-warning" />
                            <span className="text-sm font-semibold text-foreground">{resource.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Icon name="ArrowDownTrayIcon" size={16} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{resource.downloads}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onDownload(resource.id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors text-sm font-semibold"
                    >
                        Download
                    </button>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">By {resource.author}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{resource.date}</span>
                </div>
            </div>
        </div>
    );
}

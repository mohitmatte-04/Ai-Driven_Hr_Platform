'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface VideoTestimonial {
    id: string;
    company: string;
    industry: string;
    thumbnail: string;
    thumbnailAlt: string;
    videoUrl: string;
    author: string;
    authorRole: string;
    authorImage: string;
    authorImageAlt: string;
    quote: string;
    duration: string;
}

interface VideoTestimonialCardProps {
    testimonial: VideoTestimonial;
    className?: string;
}

const VideoTestimonialCard: React.FC<VideoTestimonialCardProps> = ({ testimonial, className = '' }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    return (
        <div className={`bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevated transition-all duration-300 ${className}`}>
            <div className="relative aspect-video overflow-hidden group cursor-pointer" onClick={handlePlayClick}>
                {!isPlaying ? (
                    <>
                        <AppImage
                            src={testimonial.thumbnail}
                            alt={testimonial.thumbnailAlt}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon name="PlayIcon" size={32} className="text-white ml-1" variant="solid" />
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                            {testimonial.duration}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        <div className="text-white text-center">
                            <Icon name="PlayCircleIcon" size={64} className="mx-auto mb-2" variant="solid" />
                            <p className="text-sm">Video player would load here</p>
                            <p className="text-xs text-gray-400 mt-1">{testimonial.videoUrl}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <AppImage
                        src={testimonial.authorImage}
                        alt={testimonial.authorImageAlt}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <div className="font-semibold text-foreground">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.authorRole}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                </div>

                <p className="text-muted-foreground italic mb-3">"{testimonial.quote}"</p>

                <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {testimonial.industry}
                </span>
            </div>
        </div>
    );
};

export default VideoTestimonialCard;

'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Webinar {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: string;
    speaker: string;
    speakerTitle: string;
    speakerImage: string;
    speakerAlt: string;
    attendees: number;
    category: string;
}

export default function UpcomingWebinars() {
    const [isHydrated, setIsHydrated] = useState(false);
    const [registeredWebinars, setRegisteredWebinars] = useState<number[]>([]);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const webinars: Webinar[] = [
        {
            id: 1,
            title: 'AI-Powered Candidate Screening: Best Practices for 2026',
            description: 'Learn how to leverage AI technology to streamline your candidate screening process and improve hiring quality.',
            date: 'Jan 18, 2026',
            time: '2:00 PM EST',
            duration: '60 min',
            speaker: 'Sarah Johnson',
            speakerTitle: 'Head of Talent Acquisition',
            speakerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_13c84c86e-1763298886932.png",
            speakerAlt: 'Professional woman with brown hair in navy blazer smiling at camera',
            attendees: 234,
            category: 'AI & Automation'
        },
        {
            id: 2,
            title: 'Building Diverse Teams: Strategies That Work',
            description: 'Discover proven strategies for creating inclusive hiring processes and building diverse, high-performing teams.',
            date: 'Jan 25, 2026',
            time: '11:00 AM EST',
            duration: '45 min',
            speaker: 'Michael Chen',
            speakerTitle: 'Diversity & Inclusion Consultant',
            speakerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1668620af-1763293446808.png",
            speakerAlt: 'Asian man in gray suit with glasses smiling professionally',
            attendees: 189,
            category: 'Best Practices'
        },
        {
            id: 3,
            title: 'Remote Hiring Masterclass: From Screening to Onboarding',
            description: 'Master the art of remote hiring with practical tips for virtual interviews, assessments, and seamless onboarding.',
            date: 'Feb 1, 2026',
            time: '3:00 PM EST',
            duration: '90 min',
            speaker: 'Emily Rodriguez',
            speakerTitle: 'Remote Work Specialist',
            speakerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f225624a-1763293838525.png",
            speakerAlt: 'Hispanic woman with long dark hair in professional attire smiling warmly',
            attendees: 312,
            category: 'Remote Work'
        }];


    const handleRegister = (webinarId: number) => {
        setRegisteredWebinars((prev) =>
            prev.includes(webinarId) ?
                prev.filter((id) => id !== webinarId) :
                [...prev, webinarId]
        );
    };

    if (!isHydrated) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-heading font-bold text-foreground">Upcoming Webinars</h2>
                </div>
            </div>);

    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-foreground">Upcoming Webinars</h2>
                <span className="text-sm text-muted-foreground">{webinars.length} upcoming events</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webinars.map((webinar) =>
                    <div
                        key={webinar.id}
                        className="bg-card rounded-lg shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden">

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    {webinar.category}
                                </span>
                                <div className="flex items-center space-x-1 text-muted-foreground">
                                    <Icon name="UserGroupIcon" size={16} />
                                    <span className="text-xs">{webinar.attendees}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-heading font-bold text-foreground mb-2 line-clamp-2">
                                {webinar.title}
                            </h3>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {webinar.description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center space-x-2 text-sm text-foreground">
                                    <Icon name="CalendarIcon" size={16} className="text-muted-foreground" />
                                    <span>{webinar.date}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-foreground">
                                    <Icon name="ClockIcon" size={16} className="text-muted-foreground" />
                                    <span>{webinar.time} • {webinar.duration}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-4 border-t border-border mb-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                    <AppImage
                                        src={webinar.speakerImage}
                                        alt={webinar.speakerAlt}
                                        className="w-full h-full object-cover" />

                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">{webinar.speaker}</p>
                                    <p className="text-xs text-muted-foreground truncate">{webinar.speakerTitle}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRegister(webinar.id)}
                                className={`w-full py-2 rounded-lg font-semibold transition-colors ${registeredWebinars.includes(webinar.id) ?
                                        'bg-success text-white' : 'bg-primary text-primary-foreground hover:bg-accent'}`
                                }>

                                {registeredWebinars.includes(webinar.id) ?
                                    <span className="flex items-center justify-center space-x-2">
                                        <Icon name="CheckIcon" size={16} />
                                        <span>Registered</span>
                                    </span> :

                                    'Register Now'
                                }
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>);

}

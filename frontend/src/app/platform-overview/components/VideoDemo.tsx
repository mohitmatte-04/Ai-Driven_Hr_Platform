'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface VideoDemoProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VideoDemo({ isOpen, onClose }: VideoDemoProps) {
    const [activeDemo, setActiveDemo] = useState<string>('overview');

    const demos = [
        {
            id: 'overview',
            title: 'Platform Overview',
            duration: '3:45',
            thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1c7085398-1764660533982.png",
            thumbnailAlt: 'Modern office workspace with multiple computer monitors displaying recruitment analytics dashboards and data visualizations'
        },
        {
            id: 'jd-parsing',
            title: 'JD Parsing Demo',
            duration: '2:30',
            thumbnail: "https://images.unsplash.com/photo-1704360843640-cb238862b366",
            thumbnailAlt: 'Close-up of hands typing on laptop keyboard with job description document visible on screen'
        },
        {
            id: 'resume-parsing',
            title: 'Resume Parsing',
            duration: '2:15',
            thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1096d8e11-1767919238044.png",
            thumbnailAlt: 'Professional resume documents being scanned and analyzed on modern tablet device'
        },
        {
            id: 'ranking',
            title: 'Candidate Ranking',
            duration: '3:00',
            thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_14f04c770-1765006471552.png",
            thumbnailAlt: 'HR manager reviewing ranked candidate profiles on large desktop monitor with scoring metrics visible'
        }];


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h3 className="text-2xl font-bold text-foreground">Interactive Platform Demo</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        aria-label="Close demo">

                        <Icon name="XMarkIcon" size={24} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="grid lg:grid-cols-3 gap-6 p-6">
                    {/* Video Player */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                            <AppImage
                                src={demos.find((d) => d.id === activeDemo)?.thumbnail || ''}
                                alt={demos.find((d) => d.id === activeDemo)?.thumbnailAlt || ''}
                                className="w-full h-full object-cover" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="w-20 h-20 bg-primary bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 hover:scale-110 transition-all duration-200 shadow-xl">
                                    <Icon name="PlayIcon" size={32} variant="solid" className="text-white ml-1" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl p-6">
                            <h4 className="text-xl font-bold text-foreground mb-2">
                                {demos.find((d) => d.id === activeDemo)?.title}
                            </h4>
                            <p className="text-muted-foreground">
                                Watch how Hiring Intelligence Platform transforms your recruitment workflow with intelligent automation and seamless integration.
                            </p>
                        </div>
                    </div>

                    {/* Demo List */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-foreground mb-4">More Demos</h4>
                        {demos.map((demo) =>
                            <button
                                key={demo.id}
                                onClick={() => setActiveDemo(demo.id)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${activeDemo === demo.id ?
                                        'border-primary bg-primary bg-opacity-5' : 'border-border hover:border-primary hover:bg-muted'}`
                                }>

                                <div className="flex items-center space-x-3">
                                    <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                        <AppImage
                                            src={demo.thumbnail}
                                            alt={demo.thumbnailAlt}
                                            className="w-full h-full object-cover" />

                                        {activeDemo === demo.id &&
                                            <div className="absolute inset-0 bg-primary bg-opacity-20 flex items-center justify-center">
                                                <Icon name="PlayIcon" size={16} variant="solid" className="text-white" />
                                            </div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground text-sm truncate">
                                            {demo.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{demo.duration}</p>
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>);

}

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import HeroSection from './HeroSection';
import MissionVisionSection from './MissionVisionSection';
import ValuesSection from './ValuesSection';
import TimelineSection from './TimelineSection';
import LeadershipSection from './LeadershipSection';
import CareersSection from './CareersSection';
import AwardsSection from './AwardsSection';
import LocationsSection from './LocationsSection';
import CTASection from './CTASection';

export default function AboutContent() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-16 lg:pt-24">
                    <div className="animate-pulse space-y-8 px-4 py-12">
                        <div className="h-64 bg-muted rounded-lg"></div>
                        <div className="h-96 bg-muted rounded-lg"></div>
                        <div className="h-96 bg-muted rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16 lg:pt-24">
                <HeroSection />
                <MissionVisionSection />
                <ValuesSection />
                <TimelineSection />
                <LeadershipSection />
                <CareersSection />
                <AwardsSection />
                <LocationsSection />
                <CTASection />
            </main>
        </div>
    );
}

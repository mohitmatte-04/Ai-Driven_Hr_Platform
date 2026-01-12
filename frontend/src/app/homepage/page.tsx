import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SocialProofSection from './components/SocialProofSection';
import InteractiveDemoSection from './components/InteractiveDemoSection';
import Footer from './components/Footer';

export const metadata: Metadata = {
    title: 'Hiring Intelligence Platform - AI-Powered Recruitment Platform',
    description: 'Transform your hiring process with Hiring Intelligence Platform\'s intelligent automation. AI-powered document parsing, candidate ranking, and streamlined communication workflows for smarter recruitment decisions.',
};

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main>
                <HeroSection />
                <FeaturesSection />
                <SocialProofSection />
                <InteractiveDemoSection />
            </main>

            <Footer />
        </div>
    );
}

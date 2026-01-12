import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BackButton from '@/app/components/BackButton';
import PlatformOverviewInteractive from './components/PlatformOverviewInteractive';

export const metadata: Metadata = {
    title: 'Platform Overview - Hiring Intelligence Platform',
    description: 'Explore the comprehensive features and capabilities of our AI-powered recruitment platform.',
};

export default function PlatformOverviewPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 px-4 max-w-7xl mx-auto mb-8">
                <BackButton />
            </div>
            <PlatformOverviewInteractive />
        </div>
    );
}

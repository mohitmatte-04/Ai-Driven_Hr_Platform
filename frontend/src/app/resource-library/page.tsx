import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/app/homepage/components/Footer';
import BackButton from '@/app/components/BackButton';
import ResourceLibraryInteractive from './components/ResourceLibraryInteractive';

export const metadata: Metadata = {
    title: 'Resource Library - Hiring Intelligence Platform',
    description: 'Access comprehensive resources, guides, and documentation for our AI-powered recruitment platform.',
};

export default function ResourceLibraryPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 px-4 max-w-7xl mx-auto mb-8">
                <BackButton />
            </div>
            <ResourceLibraryInteractive />
            <Footer />
        </div>
    );
}

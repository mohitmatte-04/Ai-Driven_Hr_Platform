import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/app/homepage/components/Footer';
import BackButton from '@/app/components/BackButton';
import SolutionsInteractive from './components/SolutionsInteractive';

export const metadata: Metadata = {
    title: 'Solutions Hub - Hiring Intelligence Platform',
    description: 'Discover our comprehensive recruitment solutions powered by AI.',
};

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 px-4 max-w-7xl mx-auto mb-8">
                <BackButton />
            </div>
            <SolutionsInteractive />
            <Footer />
        </div>
    );
}

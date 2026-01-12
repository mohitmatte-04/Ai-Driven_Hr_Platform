import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/app/homepage/components/Footer';
import BackButton from '@/app/components/BackButton';
import CustomerSuccessInteractive from './components/CustomerSuccessInteractive';

export const metadata: Metadata = {
    title: 'Customer Success - Hiring Intelligence Platform',
    description: 'Discover how leading organizations are transforming their hiring processes with our AI-powered recruitment platform.',
};

export default function CustomerSuccessPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 px-4 max-w-7xl mx-auto mb-8">
                <BackButton />
            </div>
            <CustomerSuccessInteractive />
            <Footer />
        </div>
    );
}

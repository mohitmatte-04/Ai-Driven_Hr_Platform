'use client';

import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const BackButton = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground bg-white hover:bg-muted border-2 border-border rounded-lg transition-all duration-200"
        >
            <Icon name="ArrowLeftIcon" size={20} />
            Back to Home
        </button>
    );
};

export default BackButton;

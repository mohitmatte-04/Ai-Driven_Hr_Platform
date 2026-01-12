import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface CTASectionProps {
    className?: string;
}

const CTASection = ({ className = '' }: CTASectionProps) => {
    return (
        <section className={`py-20 lg:py-28 bg-gradient-to-br from-primary via-accent to-primary ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl text-white/90 mb-10 leading-relaxed">
                        Join 1,200+ companies using Hiring Intelligence Platform to make smarter hiring decisions. Start your free trial today—no credit card required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            href="/platform-overview"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary bg-white hover:bg-gray-50 rounded-lg shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Start Free Trial
                            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
                        </Link>
                        <Link
                            href="/customer-success"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-lg backdrop-blur-sm transition-all duration-200"
                        >
                            View Success Stories
                            <Icon name="ArrowTopRightOnSquareIcon" size={20} className="ml-2" />
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
                        <div className="flex items-center space-x-2">
                            <Icon name="CheckCircleIcon" size={24} variant="solid" />
                            <span className="text-sm font-medium">14-day free trial</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon name="CheckCircleIcon" size={24} variant="solid" />
                            <span className="text-sm font-medium">No credit card required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon name="CheckCircleIcon" size={24} variant="solid" />
                            <span className="text-sm font-medium">Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CTASection() {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                    Ready to Transform Your Recruitment?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join hundreds of companies using Hiring Intelligence Platform to make smarter hiring decisions faster. Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/platform-overview"
                        className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent shadow-card hover:shadow-coral hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <span>Start Free Trial</span>
                        <Icon name="ArrowRightIcon" size={20} />
                    </Link>
                    <Link
                        href="/platform-overview"
                        className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-card text-foreground rounded-lg font-semibold hover:bg-muted border border-border shadow-card hover:shadow-elevated transition-all duration-200"
                    >
                        <Icon name="PlayIcon" size={20} />
                        <span>Watch Demo</span>
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                    No credit card required • 14-day free trial • Cancel anytime
                </p>
            </div>
        </section>
    );
}

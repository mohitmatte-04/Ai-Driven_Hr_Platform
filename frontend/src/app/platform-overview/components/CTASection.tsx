import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-foreground to-gray-800 rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed">
                            Join leading companies using Hiring Intelligence Platform to revolutionize their recruitment process. Start your journey today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href="/platform-overview"
                                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:bg-accent hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <span>Start Free Trial</span>
                                <Icon name="ArrowRightIcon" size={20} />
                            </Link>

                            <Link
                                href="/customer-success"
                                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Icon name="ChatBubbleLeftRightIcon" size={20} />
                                <span>Talk to Sales</span>
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-white text-opacity-80 text-sm">
                            <div className="flex items-center space-x-2">
                                <Icon name="CheckCircleIcon" size={20} variant="solid" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon name="CheckCircleIcon" size={20} variant="solid" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon name="CheckCircleIcon" size={20} variant="solid" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface HeroSectionProps {
    className?: string;
}

const HeroSection = ({ className = '' }: HeroSectionProps) => {
    return (
        <section className={`relative bg-gradient-to-br from-white via-red-50/30 to-white py-12 lg:py-20 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full border border-primary/20">
                            <Icon name="SparklesIcon" size={20} className="text-[#696969]" variant="solid" />
                            <span className="text-sm font-semibold" style={{ color: '#696969' }}>AI-Powered Recruitment Platform</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                            Transform Your Hiring with{' '}
                            <span style={{ color: '#696969' }}>Intelligent Automation</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                            Hiring Intelligence Platform amplifies human insight with AI-powered document parsing, intelligent candidate ranking, and streamlined communication workflows. Make smarter recruitment decisions faster.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/platform-overview"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card hover:shadow-coral hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Start Free Trial
                                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
                            </Link>
                            <Link
                                href="/platform-overview"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground bg-white hover:bg-muted border-2 border-border rounded-lg transition-all duration-200"
                            >
                                <Icon name="PlayIcon" size={20} className="mr-2" variant="solid" />
                                Watch Demo
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center space-x-2">
                                <Icon name="CheckBadgeIcon" size={24} className="text-success" variant="solid" />
                                <span className="text-sm text-muted-foreground">SOC 2 Certified</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon name="ShieldCheckIcon" size={24} className="text-success" variant="solid" />
                                <span className="text-sm text-muted-foreground">GDPR Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon name="LockClosedIcon" size={24} className="text-success" variant="solid" />
                                <span className="text-sm text-muted-foreground">256-bit Encryption</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual - Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl shadow-elevated overflow-hidden border border-border">
                            <img
                                src="/assets/resume-genius-9si2noVCVH8-unsplash.jpg"
                                alt="Recruitment Platform Visual"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Floating Stats */}
                        <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-card p-4 border border-border">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Icon name="BoltIcon" size={24} className="text-[#696969]" variant="solid" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">10x</p>
                                    <p className="text-xs text-muted-foreground">Faster Screening</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

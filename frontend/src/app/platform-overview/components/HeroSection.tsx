import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface HeroSectionProps {
    onDemoClick: () => void;
}

export default function HeroSection({ onDemoClick }: HeroSectionProps) {
    return (
        <section className="relative bg-gradient-to-br from-white via-red-50 to-white py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-2 bg-red-100 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                            <Icon name="SparklesIcon" size={16} variant="solid" />
                            <span>AI-Powered Recruitment Platform</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                            Your Complete
                            <span className="text-primary block mt-2">Recruitment Command Center</span>
                        </h1>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Transform your hiring process with intelligent automation. Hiring Intelligence Platform combines advanced AI parsing, smart candidate ranking, and seamless communication in one powerful platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onDemoClick}
                                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:bg-accent hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">

                                <Icon name="PlayIcon" size={20} variant="solid" />
                                <span>Watch Interactive Demo</span>
                            </button>

                            <Link
                                href="/solutions-hub"
                                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-foreground border-2 border-border rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200">

                                <span>Explore Solutions</span>
                                <Icon name="ArrowRightIcon" size={20} />
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Icon name="CheckBadgeIcon" size={20} variant="solid" className="text-success" />
                                <span>SOC 2 Certified</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-success" />
                                <span>GDPR Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Icon name="LockClosedIcon" size={20} variant="solid" className="text-success" />
                                <span>Enterprise Security</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <AppImage
                                src="https://img.rocket.new/generatedImages/rocket_gen_img_1cec7b6ac-1765212939526.png"
                                alt="Diverse team of HR professionals collaborating around modern computer workstation reviewing recruitment analytics dashboard"
                                className="w-full h-auto" />


                            {/* Floating Stats Cards */}
                            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 backdrop-blur-sm bg-opacity-95">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
                                        <Icon name="ChartBarIcon" size={24} variant="solid" className="text-success" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">87%</p>
                                        <p className="text-xs text-muted-foreground">Time Saved</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 backdrop-blur-sm bg-opacity-95">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                                        <Icon name="UserGroupIcon" size={24} variant="solid" className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">10K+</p>
                                        <p className="text-xs text-muted-foreground">Candidates Ranked</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>);

}

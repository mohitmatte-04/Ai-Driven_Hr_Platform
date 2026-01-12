'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function SolutionsInteractive() {
    const solutions = [
        {
            id: 'jd-parsing',
            icon: 'DocumentTextIcon',
            title: 'JD Parsing',
            description: 'Upload job descriptions and let our AI automatically extract and organize job details for easy management.',
            stat: '500+ Jobs Parsed',
            color: 'bg-blue-50 text-blue-600',
            href: '/jd-parsing'
        },
        {
            id: 'resume-parsing',
            icon: 'DocumentMagnifyingGlassIcon',
            title: 'Resume Parsing',
            description: 'Add candidates by uploading resumes. Our AI extracts skills, experience, and qualifications automatically.',
            stat: '2000+ Candidates',
            color: 'bg-purple-50 text-purple-600',
            href: '/resume-parsing'
        },
        {
            id: 'smart-ranking',
            icon: 'ChartBarIcon',
            title: 'Smart Ranking',
            description: 'Automatically rank candidates based on job requirements. See the best matches at the top instantly.',
            stat: '95% Accuracy',
            color: 'bg-green-50 text-green-600',
            href: '/smart-ranking'
        },
        {
            id: 'communication',
            icon: 'ChatBubbleLeftRightIcon',
            title: 'Communication Hub',
            description: 'Reach out to top candidates with automated communication workflows and interview scheduling.',
            stat: '85% Response Rate',
            color: 'bg-orange-50 text-orange-600',
            href: '/communication'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-red-50/30 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full border border-primary/20 mb-8">
                            <Icon name="SparklesIcon" size={20} className="text-primary" variant="solid" />
                            <span className="text-sm font-semibold text-primary">AI-Powered Solutions</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
                            Comprehensive Recruitment Solutions
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Explore our suite of AI-powered tools designed to streamline every step of your hiring process, from parsing to placement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {solutions.map((solution, index) => (
                            <Link
                                key={index}
                                href={solution.href}
                                className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-elevated border border-border transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start space-x-6">
                                    <div className={`w-16 h-16 ${solution.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon name={solution.icon as any} size={32} variant="solid" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                            {solution.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            {solution.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-primary">
                                                {solution.stat}
                                            </span>
                                            <Icon
                                                name="ArrowRightIcon"
                                                size={20}
                                                className="text-primary group-hover:translate-x-1 transition-transform"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-16 lg:py-24 bg-muted">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                            Built for Modern Recruitment Teams
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Whether you're a startup or enterprise, our solutions scale with your needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'High-Volume Hiring',
                                description: 'Process hundreds of resumes in minutes, not days. Perfect for seasonal recruitment or rapid growth phases.',
                                icon: 'UsersIcon'
                            },
                            {
                                title: 'Quality over Quantity',
                                description: 'Advanced AI matching ensures you see the most qualified candidates first, reducing time-to-hire.',
                                icon: 'StarIcon'
                            },
                            {
                                title: 'Remote Teams',
                                description: 'Coordinate hiring across time zones with automated scheduling and communication workflows.',
                                icon: 'GlobeAltIcon'
                            }
                        ].map((useCase, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-card border border-border">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Icon name={useCase.icon as any} size={24} className="text-primary" variant="solid" />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                                    {useCase.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {useCase.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
                        Ready to Transform Your Recruitment?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Start using our AI-powered solutions today. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/platform-overview"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card transition-all duration-200"
                        >
                            Start Free Trial
                            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground bg-white hover:bg-muted border-2 border-border rounded-lg transition-all duration-200"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

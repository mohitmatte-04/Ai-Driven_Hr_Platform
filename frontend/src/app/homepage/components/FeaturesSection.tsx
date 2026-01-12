import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface Feature {
    icon: string;
    title: string;
    description: string;
    color: string;
    href: string;
}

interface FeaturesSectionProps {
    className?: string;
}

const FeaturesSection = ({ className = '' }: FeaturesSectionProps) => {
    const features: Feature[] = [
        {
            icon: 'DocumentTextIcon',
            title: 'JD Parsing',
            description: 'Automatically extract key requirements, skills, and qualifications from job descriptions with 99% accuracy using advanced NLP algorithms.',
            color: 'bg-blue-50 text-blue-600',
            href: '/jd-parsing'
        },
        {
            icon: 'DocumentMagnifyingGlassIcon',
            title: 'Resume Parsing',
            description: 'Intelligent document analysis that extracts candidate information, work history, skills, and education from any resume format instantly.',
            color: 'bg-purple-50 text-purple-600',
            href: '/resume-parsing'
        },
        {
            icon: 'ChartBarIcon',
            title: 'Candidate Ranking',
            description: 'AI-powered matching algorithm that ranks candidates based on job requirements, experience, skills, and cultural fit with transparent scoring.',
            color: 'bg-green-50 text-green-600',
            href: '/smart-ranking'
        },
        {
            icon: 'ChatBubbleLeftRightIcon',
            title: 'Communication Hub',
            description: 'Centralized platform for managing all candidate communications with automated scheduling, email templates, and interview coordination.',
            color: 'bg-orange-50 text-orange-600',
            href: '/communication'
        }
    ];

    return (
        <section className={`py-20 lg:py-28 bg-muted ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
                        Four Powerful Services, One Platform
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Hiring Intelligence Platform combines cutting-edge AI technology with intuitive design to streamline every step of your recruitment process.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Link
                            key={index}
                            href={feature.href}
                            className="card bg-base-100 border-2 border-base-300 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="card-body">
                                <h2 className="card-title">{feature.title}</h2>
                                <p>{feature.description}</p>
                            </div>
                            <figure className={`p-6 ${feature.color}`}>
                                <Icon name={feature.icon as any} size={64} variant="solid" />
                            </figure>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;

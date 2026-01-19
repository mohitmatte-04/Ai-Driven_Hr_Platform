import Link from 'next/link';
import Image from 'next/image';

interface Feature {
    title: string;
    description: string;
    imageSrc: string;
    gradientFrom: string;
    gradientTo: string;
    href: string;
}

interface FeaturesSectionProps {
    className?: string;
}

const FeaturesSection = ({ className = '' }: FeaturesSectionProps) => {
    const features: Feature[] = [
        {
            title: 'JD Parsing',
            description: 'Automatically extract key requirements, skills, and qualifications from job descriptions with 99% accuracy using advanced NLP algorithms.',
            imageSrc: '/assets/jd-parsing.png',
            gradientFrom: 'from-blue-900/80',
            gradientTo: 'to-blue-600/40',
            href: '/jd-parsing'
        },
        {
            title: 'Resume Parsing',
            description: 'Intelligent document analysis that extracts candidate information, work history, skills, and education from any resume format instantly.',
            imageSrc: '/assets/resume-parsing.png',
            gradientFrom: 'from-purple-900/80',
            gradientTo: 'to-purple-600/40',
            href: '/resume-parsing'
        },
        {
            title: 'Candidate Ranking',
            description: 'AI-powered matching algorithm that ranks candidates based on job requirements, experience, skills, and cultural fit with transparent scoring.',
            imageSrc: '/assets/candidate-ranking.png',
            gradientFrom: 'from-green-900/80',
            gradientTo: 'to-green-600/40',
            href: '/smart-ranking'
        },
        {
            title: 'Communication Hub',
            description: 'Centralized platform for managing all candidate communications with automated scheduling, email templates, and interview coordination.',
            imageSrc: '/assets/communication-hub.png',
            gradientFrom: 'from-orange-900/80',
            gradientTo: 'to-orange-600/40',
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

                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <Link
                            key={index}
                            href={feature.href}
                            className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] aspect-[4/5]"
                        >
                            {/* Background Image */}
                            <Image
                                src={feature.imageSrc}
                                alt={feature.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradientFrom} ${feature.gradientTo}`} />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                <h3 className="text-3xl font-bold mb-3 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-100 mb-6 leading-relaxed opacity-90">
                                    {feature.description}
                                </p>
                                <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 w-full group-hover:shadow-lg">
                                    Learn More
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;

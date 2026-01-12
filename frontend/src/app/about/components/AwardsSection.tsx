import Icon from '@/components/ui/AppIcon';

interface Award {
    id: number;
    title: string;
    organization: string;
    year: string;
    description: string;
    icon: string;
}

export default function AwardsSection() {
    const awards: Award[] = [
        {
            id: 1,
            title: 'Best AI Innovation in HR Tech',
            organization: 'TechCrunch Disrupt',
            year: '2024',
            description: 'Recognized for groundbreaking AI-powered recruitment automation',
            icon: 'TrophyIcon'
        },
        {
            id: 2,
            title: 'Top 50 SaaS Companies',
            organization: 'Forbes Cloud 100',
            year: '2024',
            description: 'Listed among the most promising cloud companies',
            icon: 'StarIcon'
        },
        {
            id: 3,
            title: 'Excellence in Customer Success',
            organization: 'SaaS Awards',
            year: '2023',
            description: 'Awarded for outstanding customer satisfaction and support',
            icon: 'CheckBadgeIcon'
        },
        {
            id: 4,
            title: 'Best Workplace Culture',
            organization: 'Great Place to Work',
            year: '2023',
            description: 'Certified for exceptional employee experience and culture',
            icon: 'HeartIcon'
        },
        {
            id: 5,
            title: 'Innovation Leader Award',
            organization: 'HR Tech Conference',
            year: '2022',
            description: 'Recognized for transformative impact on recruitment industry',
            icon: 'LightBulbIcon'
        },
        {
            id: 6,
            title: 'SOC 2 Type II Certified',
            organization: 'AICPA',
            year: '2022',
            description: 'Certified for security, availability, and confidentiality',
            icon: 'ShieldCheckIcon'
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-muted/30 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Awards & Recognition
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Industry recognition for our innovation, customer success, and commitment to excellence
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {awards.map((award) => (
                        <div
                            key={award.id}
                            className="bg-card rounded-xl p-6 lg:p-8 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 border border-border"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon name={award.icon} size={24} className="text-primary" />
                                </div>
                                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                    {award.year}
                                </span>
                            </div>
                            <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                                {award.title}
                            </h3>
                            <p className="text-sm font-semibold text-primary mb-3">
                                {award.organization}
                            </p>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {award.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

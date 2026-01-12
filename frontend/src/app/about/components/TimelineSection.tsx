import Icon from '@/components/ui/AppIcon';

interface Milestone {
    id: number;
    year: string;
    title: string;
    description: string;
    icon: string;
}

export default function TimelineSection() {
    const milestones: Milestone[] = [
        {
            id: 1,
            year: '2020',
            title: 'Company Founded',
            description: 'Hiring Intelligence Platform was born from a vision to transform recruitment through intelligent automation and human-centered AI.',
            icon: 'SparklesIcon'
        },
        {
            id: 2,
            year: '2021',
            title: 'First AI Model Launch',
            description: 'Released our groundbreaking resume parsing engine with 95% accuracy, setting new industry standards.',
            icon: 'CpuChipIcon'
        },
        {
            id: 3,
            year: '2022',
            title: '100+ Enterprise Clients',
            description: 'Reached a major milestone with over 100 enterprise customers trusting Hiring Intelligence Platform for their recruitment needs.',
            icon: 'BuildingOfficeIcon'
        },
        {
            id: 4,
            year: '2023',
            title: 'Series A Funding',
            description: 'Secured $15M in Series A funding to accelerate product development and global expansion.',
            icon: 'BanknotesIcon'
        },
        {
            id: 5,
            year: '2024',
            title: 'Global Expansion',
            description: 'Expanded operations to Europe and Asia, serving customers across 25 countries worldwide.',
            icon: 'GlobeAltIcon'
        },
        {
            id: 6,
            year: '2025',
            title: '1M+ Candidates Matched',
            description: 'Celebrated matching over 1 million candidates with their ideal roles, transforming countless careers.',
            icon: 'TrophyIcon'
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Our Journey
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Key milestones that shaped Hiring Intelligence Platform into the industry-leading platform it is today
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border"></div>

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone.id}
                                className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                            >
                                {/* Content */}
                                <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                                    <div className="bg-card rounded-xl p-6 lg:p-8 shadow-card hover:shadow-elevated transition-all duration-300 border border-border">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon name={milestone.icon} size={20} className="text-primary" />
                                            </div>
                                            <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                                        </div>
                                        <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center dot */}
                                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-card"></div>

                                {/* Spacer */}
                                <div className="hidden lg:block w-5/12"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

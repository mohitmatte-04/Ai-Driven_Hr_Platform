import Icon from '@/components/ui/AppIcon';

interface Value {
    id: number;
    title: string;
    description: string;
    icon: string;
}

export default function ValuesSection() {
    const values: Value[] = [
        {
            id: 1,
            title: 'Trust & Transparency',
            description: 'We build trust through transparent processes, honest communication, and reliable technology that recruiters can depend on every day.',
            icon: 'ShieldCheckIcon'
        },
        {
            id: 2,
            title: 'Innovation with Purpose',
            description: 'We innovate not for the sake of technology, but to solve real recruitment challenges and create meaningful impact for our users.',
            icon: 'LightBulbIcon'
        },
        {
            id: 3,
            title: 'Human-Centered AI',
            description: 'Our AI amplifies human insight rather than replacing it, ensuring that technology serves people, not the other way around.',
            icon: 'UserGroupIcon'
        },
        {
            id: 4,
            title: 'Precision & Quality',
            description: 'We obsess over accuracy, quality, and attention to detail in everything we build, from algorithms to user experiences.',
            icon: 'CheckBadgeIcon'
        },
        {
            id: 5,
            title: 'Continuous Learning',
            description: 'We embrace a growth mindset, constantly learning from our users, data, and the evolving recruitment landscape.',
            icon: 'AcademicCapIcon'
        },
        {
            id: 6,
            title: 'Collaborative Success',
            description: 'We succeed when our customers succeed, fostering partnerships built on mutual growth and shared achievements.',
            icon: 'HandRaisedIcon'
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-muted/30 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Our Core Values
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        The principles that guide our decisions, shape our culture, and define who we are as a company
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {values.map((value) => (
                        <div
                            key={value.id}
                            className="bg-card rounded-xl p-6 lg:p-8 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 border border-border"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Icon name={value.icon} size={24} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                                {value.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

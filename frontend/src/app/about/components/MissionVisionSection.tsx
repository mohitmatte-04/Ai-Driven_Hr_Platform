import Icon from '@/components/ui/AppIcon';

interface MissionVisionCard {
    id: number;
    type: 'mission' | 'vision';
    title: string;
    description: string;
    icon: string;
}

export default function MissionVisionSection() {
    const cards: MissionVisionCard[] = [
        {
            id: 1,
            type: 'mission',
            title: 'Our Mission',
            description: 'To revolutionize the recruitment industry by providing AI-powered tools that enhance human decision-making, streamline hiring processes, and create meaningful connections between exceptional talent and forward-thinking organizations.',
            icon: 'RocketLaunchIcon'
        },
        {
            id: 2,
            type: 'vision',
            title: 'Our Vision',
            description: 'To become the global standard for intelligent recruitment technology, where every hiring decision is informed by data-driven insights while preserving the essential human element that makes great matches possible.',
            icon: 'EyeIcon'
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Driving the Future of Recruitment
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Our mission and vision guide everything we do, from product development to customer success
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="bg-card rounded-2xl p-8 lg:p-10 shadow-card hover:shadow-elevated transition-all duration-300 border border-border"
                        >
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Icon name={card.icon} size={28} className="text-primary" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-heading font-bold text-foreground pt-2">
                                    {card.title}
                                </h3>
                            </div>
                            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

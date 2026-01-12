import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Benefit {
    id: number;
    title: string;
    description: string;
    icon: string;
}

interface OpenPosition {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
}

export default function CareersSection() {
    const benefits: Benefit[] = [
        {
            id: 1,
            title: 'Competitive Compensation',
            description: 'Industry-leading salaries with equity options',
            icon: 'CurrencyDollarIcon'
        },
        {
            id: 2,
            title: 'Health & Wellness',
            description: 'Comprehensive health, dental, and vision coverage',
            icon: 'HeartIcon'
        },
        {
            id: 3,
            title: 'Flexible Work',
            description: 'Remote-first culture with flexible schedules',
            icon: 'HomeModernIcon'
        },
        {
            id: 4,
            title: 'Learning Budget',
            description: '$2,000 annual budget for courses and conferences',
            icon: 'BookOpenIcon'
        },
        {
            id: 5,
            title: 'Unlimited PTO',
            description: 'Take time off when you need it',
            icon: 'CalendarDaysIcon'
        },
        {
            id: 6,
            title: 'Team Events',
            description: 'Regular team building and social activities',
            icon: 'UsersIcon'
        }];


    const openPositions: OpenPosition[] = [
        {
            id: 1,
            title: 'Senior Full-Stack Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time'
        },
        {
            id: 2,
            title: 'Machine Learning Engineer',
            department: 'AI/ML',
            location: 'San Francisco, CA',
            type: 'Full-time'
        },
        {
            id: 3,
            title: 'Product Designer',
            department: 'Design',
            location: 'Remote',
            type: 'Full-time'
        },
        {
            id: 4,
            title: 'Customer Success Manager',
            department: 'Customer Success',
            location: 'New York, NY',
            type: 'Full-time'
        }];


    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Join Our Team
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Help us build the future of recruitment while growing your career in a supportive, innovative environment
                    </p>
                </div>

                {/* Culture Image */}
                <div className="mb-16 rounded-2xl overflow-hidden shadow-elevated">
                    <AppImage
                        src="https://img.rocket.new/generatedImages/rocket_gen_img_171170bd3-1764687877901.png"
                        alt="Diverse team of professionals collaborating around conference table with laptops in bright modern office space"
                        className="w-full h-64 lg:h-96 object-cover" />

                </div>

                {/* Benefits */}
                <div className="mb-16">
                    <h3 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                        Why Work With Us
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit) =>
                            <div
                                key={benefit.id}
                                className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border">

                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Icon name={benefit.icon} size={24} className="text-primary" />
                                </div>
                                <h4 className="text-lg font-heading font-bold text-foreground mb-2">
                                    {benefit.title}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                    {benefit.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Open Positions */}
                <div>
                    <h3 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                        Open Positions
                    </h3>
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {openPositions.map((position) =>
                            <div
                                key={position.id}
                                className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div className="flex-1">
                                    <h4 className="text-lg font-heading font-bold text-foreground mb-2">
                                        {position.title}
                                    </h4>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center space-x-1">
                                            <Icon name="BriefcaseIcon" size={16} />
                                            <span>{position.department}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Icon name="MapPinIcon" size={16} />
                                            <span>{position.location}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Icon name="ClockIcon" size={16} />
                                            <span>{position.type}</span>
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href="/platform-overview"
                                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors text-center whitespace-nowrap">

                                    Apply Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>);

}

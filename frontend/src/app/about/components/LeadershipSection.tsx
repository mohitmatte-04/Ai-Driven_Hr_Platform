import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Leader {
    id: number;
    name: string;
    role: string;
    bio: string;
    image: string;
    alt: string;
    linkedin: string;
}

export default function LeadershipSection() {
    const leaders: Leader[] = [
        {
            id: 1,
            name: 'Sarah Chen',
            role: 'CEO & Co-Founder',
            bio: 'Former VP of Engineering at LinkedIn with 15+ years in HR tech. Stanford CS graduate passionate about AI-driven recruitment.',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_19a48b2d0-1763294125036.png",
            alt: 'Professional Asian woman with shoulder-length black hair in navy blazer smiling confidently in modern office',
            linkedin: '#'
        },
        {
            id: 2,
            name: 'Michael Rodriguez',
            role: 'CTO & Co-Founder',
            bio: 'AI researcher with PhD from MIT. Previously led machine learning teams at Google. Expert in NLP and document parsing.',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_11f75a57b-1763296108528.png",
            alt: 'Hispanic man with short dark hair and beard in charcoal suit with warm smile in corporate setting',
            linkedin: '#'
        },
        {
            id: 3,
            name: 'Emily Thompson',
            role: 'Chief Product Officer',
            bio: '20+ years in product management at Microsoft and Salesforce. Drives user-centric design and product innovation.',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1456eb2f9-1763294356174.png",
            alt: 'Caucasian woman with blonde hair in professional gray suit jacket with confident expression in bright office',
            linkedin: '#'
        },
        {
            id: 4,
            name: 'David Okonkwo',
            role: 'VP of Engineering',
            bio: 'Former tech lead at Amazon. Specializes in scalable systems and cloud architecture. Carnegie Mellon graduate.',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_18f80f35a-1763294443891.png",
            alt: 'African American man with short hair in dark blue suit with professional demeanor in modern workspace',
            linkedin: '#'
        },
        {
            id: 5,
            name: 'Priya Sharma',
            role: 'Head of Customer Success',
            bio: 'Customer success expert with background at HubSpot. Ensures clients achieve maximum ROI and satisfaction.',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f953953d-1763294126115.png",
            alt: 'Indian woman with long dark hair in burgundy blazer with warm smile in professional office environment',
            linkedin: '#'
        },
        {
            id: 6,
            name: 'James Wilson',
            role: 'Chief Revenue Officer',
            bio: 'Sales leader with proven track record at Oracle and SAP. Drives growth strategy and enterprise partnerships.',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eeccc02b-1763300934261.png",
            alt: 'Caucasian man with short brown hair in light gray suit with confident smile in corporate boardroom',
            linkedin: '#'
        }];


    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Leadership Team
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Meet the experienced leaders driving Hiring Intelligence Platform's vision and innovation
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {leaders.map((leader) =>
                        <div
                            key={leader.id}
                            className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border group">

                            <div className="relative h-64 overflow-hidden">
                                <AppImage
                                    src={leader.image}
                                    alt={leader.alt}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                                    {leader.name}
                                </h3>
                                <p className="text-primary font-semibold mb-3">{leader.role}</p>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    {leader.bio}
                                </p>
                                <a
                                    href={leader.linkedin}
                                    className="inline-flex items-center space-x-2 text-primary hover:text-accent transition-colors"
                                    aria-label={`Connect with ${leader.name} on LinkedIn`}>

                                    <Icon name="LinkIcon" size={18} />
                                    <span className="text-sm font-semibold">LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>);

}

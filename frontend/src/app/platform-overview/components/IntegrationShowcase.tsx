import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Integration {
    name: string;
    category: string;
    logo: string;
    logoAlt: string;
    description: string;
}

interface IntegrationShowcaseProps {
    integrations: Integration[];
}

export default function IntegrationShowcase({ integrations }: IntegrationShowcaseProps) {
    const categories = Array.from(new Set(integrations.map(i => i.category)));

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Seamless Integration with Your Existing Tools
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Hiring Intelligence Platform connects with your favorite HR systems, ATS platforms, and communication tools
                    </p>
                </div>

                <div className="space-y-12">
                    {categories.map((category) => (
                        <div key={category}>
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                                <Icon name="LinkIcon" size={24} className="text-primary" />
                                <span>{category}</span>
                            </h3>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {integrations
                                    .filter(i => i.category === category)
                                    .map((integration, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-card rounded-xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-200 group"
                                        >
                                            <div className="flex items-center justify-center h-16 mb-4">
                                                <AppImage
                                                    src={integration.logo}
                                                    alt={integration.logoAlt}
                                                    className="max-h-12 w-auto object-contain"
                                                />
                                            </div>
                                            <h4 className="text-center font-semibold text-foreground mb-2">
                                                {integration.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground text-center">
                                                {integration.description}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 lg:p-12 text-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                        Need a Custom Integration?
                    </h3>
                    <p className="text-lg text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
                        Our API-first architecture makes it easy to connect Hiring Intelligence Platform with any system in your tech stack
                    </p>
                    <button className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                        <Icon name="CodeBracketIcon" size={20} />
                        <span>View API Documentation</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

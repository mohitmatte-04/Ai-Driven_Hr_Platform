import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[];
    image: string;
    imageAlt: string;
    color: string;
}

interface CoreServicesSectionProps {
    services: Service[];
    onServiceClick: (serviceId: string) => void;
}

export default function CoreServicesSection({ services, onServiceClick }: CoreServicesSectionProps) {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Four Powerful Services, One Platform
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Everything you need to transform your recruitment process from job posting to candidate placement
                    </p>
                </div>

                <div className="space-y-24">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Content */}
                            <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.color}`}>
                                    <Icon name={service.icon as any} size={32} variant="solid" className="text-white" />
                                </div>

                                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                                    {service.title}
                                </h3>

                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {service.description}
                                </p>

                                <ul className="space-y-3">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <Icon name="CheckCircleIcon" size={20} variant="solid" className="text-success mt-1 flex-shrink-0" />
                                            <span className="text-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => onServiceClick(service.id)}
                                    className="inline-flex items-center space-x-2 text-primary font-semibold hover:text-accent transition-colors group"
                                >
                                    <span>Explore {service.title}</span>
                                    <Icon name="ArrowRightIcon" size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Visual */}
                            <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                    <AppImage
                                        src={service.image}
                                        alt={service.imageAlt}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

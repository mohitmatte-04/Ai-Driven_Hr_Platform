import Icon from '@/components/ui/AppIcon';

interface Metric {
    icon: string;
    value: string;
    label: string;
    description: string;
    color: string;
}

interface PerformanceMetricsProps {
    metrics: Metric[];
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-accent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Platform Performance That Speaks for Itself
                    </h2>
                    <p className="text-lg text-white text-opacity-90 max-w-3xl mx-auto">
                        Real metrics from thousands of successful recruitments powered by Hiring Intelligence Platform
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {metrics.map((metric, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${metric.color} mb-6`}>
                                <Icon name={metric.icon as any} size={32} variant="solid" className="text-white" />
                            </div>

                            <div className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                                {metric.value}
                            </div>

                            <div className="text-lg font-semibold text-foreground mb-3">
                                {metric.label}
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-lg text-white text-opacity-90 mb-6">
                        Join thousands of recruiters who trust Hiring Intelligence Platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                            <span>Start Free Trial</span>
                            <Icon name="ArrowRightIcon" size={20} />
                        </button>
                        <button className="inline-flex items-center space-x-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200">
                            <Icon name="PhoneIcon" size={20} />
                            <span>Schedule Demo</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

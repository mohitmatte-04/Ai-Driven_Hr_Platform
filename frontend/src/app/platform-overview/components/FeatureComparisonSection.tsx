import Icon from '@/components/ui/AppIcon';

interface ComparisonFeature {
    category: string;
    features: {
        name: string;
        recruitflow: boolean | string;
        traditional: boolean | string;
    }[];
}

interface FeatureComparisonSectionProps {
    comparisonData: ComparisonFeature[];
}

export default function FeatureComparisonSection({ comparisonData }: FeatureComparisonSectionProps) {
    const renderValue = (value: boolean | string) => {
        if (typeof value === 'boolean') {
            return value ? (
                <Icon name="CheckIcon" size={24} variant="solid" className="text-success mx-auto" />
            ) : (
                <Icon name="XMarkIcon" size={24} className="text-muted-foreground mx-auto" />
            );
        }
        return <span className="text-sm font-medium text-foreground">{value}</span>;
    };

    return (
        <section className="py-16 lg:py-24 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Why Hiring Intelligence Platform Outperforms Traditional Methods
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        See how our AI-powered platform compares to conventional recruitment tools
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-3 bg-card border-b border-border">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-foreground">Features</h3>
                        </div>
                        <div className="p-6 bg-primary bg-opacity-5 border-l border-border">
                            <div className="flex items-center justify-center space-x-2">
                                <Icon name="SparklesIcon" size={20} variant="solid" className="text-primary" />
                                <h3 className="text-lg font-bold text-primary">Hiring Intelligence Platform</h3>
                            </div>
                        </div>
                        <div className="p-6 border-l border-border">
                            <h3 className="text-lg font-bold text-muted-foreground text-center">Traditional Tools</h3>
                        </div>
                    </div>

                    {/* Comparison Rows */}
                    {comparisonData.map((category, categoryIdx) => (
                        <div key={categoryIdx}>
                            <div className="bg-muted px-6 py-3 border-b border-border">
                                <h4 className="font-semibold text-foreground">{category.category}</h4>
                            </div>

                            {category.features.map((feature, featureIdx) => (
                                <div
                                    key={featureIdx}
                                    className="grid grid-cols-3 border-b border-border hover:bg-muted hover:bg-opacity-50 transition-colors"
                                >
                                    <div className="p-6">
                                        <p className="text-sm text-foreground">{feature.name}</p>
                                    </div>
                                    <div className="p-6 bg-primary bg-opacity-5 border-l border-border flex items-center justify-center">
                                        {renderValue(feature.recruitflow)}
                                    </div>
                                    <div className="p-6 border-l border-border flex items-center justify-center">
                                        {renderValue(feature.traditional)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-lg text-muted-foreground mb-6">
                        Ready to experience the difference?
                    </p>
                    <button className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:bg-accent hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                        <span>Start Free Trial</span>
                        <Icon name="ArrowRightIcon" size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}

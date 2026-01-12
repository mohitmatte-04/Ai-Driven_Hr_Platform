import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Metric {
    label: string;
    value: string;
    icon: string;
}

interface CaseStudy {
    id: string;
    company: string;
    industry: string;
    companySize: string;
    logo: string;
    logoAlt: string;
    image: string;
    imageAlt: string;
    title: string;
    description: string;
    challenge: string;
    solution: string;
    metrics: Metric[];
    testimonial: string;
    author: string;
    authorRole: string;
    authorImage: string;
    authorImageAlt: string;
    pdfUrl: string;
}

interface CaseStudyCardProps {
    caseStudy: CaseStudy;
    className?: string;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy, className = '' }) => {
    return (
        <article className={`bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevated transition-all duration-300 ${className}`}>
            <div className="relative h-48 overflow-hidden">
                <AppImage
                    src={caseStudy.image}
                    alt={caseStudy.imageAlt}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                    <div className="bg-white rounded-lg p-2 shadow-card">
                        <AppImage
                            src={caseStudy.logo}
                            alt={caseStudy.logoAlt}
                            className="h-8 w-auto"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {caseStudy.industry}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                        {caseStudy.companySize}
                    </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    {caseStudy.title}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                    {caseStudy.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                    {caseStudy.metrics.slice(0, 3).map((metric, index) => (
                        <div key={index} className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-muted rounded-lg p-4 mb-4">
                    <p className="text-sm text-foreground italic mb-3">"{caseStudy.testimonial}"</p>
                    <div className="flex items-center gap-3">
                        <AppImage
                            src={caseStudy.authorImage}
                            alt={caseStudy.authorImageAlt}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <div className="text-sm font-semibold text-foreground">{caseStudy.author}</div>
                            <div className="text-xs text-muted-foreground">{caseStudy.authorRole}</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        href={`/customer-success/${caseStudy.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors"
                    >
                        <span>Read Full Story</span>
                        <Icon name="ArrowRightIcon" size={16} />
                    </Link>
                    <a
                        href={caseStudy.pdfUrl}
                        download
                        className="inline-flex items-center justify-center px-4 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
                        aria-label="Download case study PDF"
                    >
                        <Icon name="ArrowDownTrayIcon" size={20} />
                    </a>
                </div>
            </div>
        </article>
    );
};

export default CaseStudyCard;

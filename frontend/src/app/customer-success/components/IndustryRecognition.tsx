import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Award {
    id: string;
    title: string;
    organization: string;
    year: string;
    logo: string;
    logoAlt: string;
    category: string;
}

interface IndustryRecognitionProps {
    className?: string;
}

const IndustryRecognition: React.FC<IndustryRecognitionProps> = ({ className = '' }) => {
    const awards: Award[] = [
        {
            id: '1',
            title: 'Best AI Recruitment Platform',
            organization: 'HR Tech Awards',
            year: '2025',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_16bfb8478-1766496001607.png",
            logoAlt: 'Gold trophy award with star emblem on dark background',
            category: 'Innovation'
        },
        {
            id: '2',
            title: 'Top 50 HR Technology',
            organization: 'TechCrunch',
            year: '2025',
            logo: "https://images.unsplash.com/photo-1667406556079-3f64ce676979",
            logoAlt: 'Silver medal with ribbon on white surface',
            category: 'Technology'
        },
        {
            id: '3',
            title: 'Customer Choice Award',
            organization: 'G2 Crowd',
            year: '2026',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1f2673c56-1764670078536.png",
            logoAlt: 'Bronze trophy cup with laurel wreath design',
            category: 'Customer Satisfaction'
        },
        {
            id: '4',
            title: 'Innovation Excellence',
            organization: 'Recruitment Tech Summit',
            year: '2025',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_11c3b669e-1764855731866.png",
            logoAlt: 'Modern glass award trophy with geometric design',
            category: 'Innovation'
        },
        {
            id: '5',
            title: 'Best Startup Solution',
            organization: 'SaaS Awards',
            year: '2024',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1d4d24fbd-1767431529074.png",
            logoAlt: 'Crystal star award on reflective black surface',
            category: 'Startup'
        },
        {
            id: '6',
            title: 'Leader in ATS',
            organization: 'Forrester Wave',
            year: '2026',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1f8a8707b-1765560030281.png",
            logoAlt: 'Elegant wooden plaque award with engraved text',
            category: 'Market Leader'
        }];


    const certifications = [
        { name: 'SOC 2 Type II', icon: 'ShieldCheckIcon' },
        { name: 'GDPR Compliant', icon: 'LockClosedIcon' },
        { name: 'ISO 27001', icon: 'CheckBadgeIcon' },
        { name: 'CCPA Certified', icon: 'DocumentCheckIcon' }];


    return (
        <section className={`py-16 lg:py-24 bg-background ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Industry Recognition & Trust
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Recognized by leading industry organizations and trusted by companies worldwide for security and compliance
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {awards.map((award) =>
                        <div
                            key={award.id}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-elevated transition-all duration-300">

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                    <AppImage
                                        src={award.logo}
                                        alt={award.logoAlt}
                                        className="w-full h-full object-cover" />

                                </div>
                                <div className="flex-1">
                                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-2">
                                        {award.year}
                                    </span>
                                    <h3 className="font-heading font-bold text-foreground mb-1">
                                        {award.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{award.organization}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Icon name="TagIcon" size={14} />
                                <span>{award.category}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 lg:p-12">
                    <h3 className="text-2xl font-heading font-bold text-foreground text-center mb-8">
                        Security & Compliance Certifications
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {certifications.map((cert, index) =>
                            <div
                                key={index}
                                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-card transition-all duration-300">

                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                                    <Icon name={cert.icon as any} size={24} className="text-primary" />
                                </div>
                                <div className="font-semibold text-foreground">{cert.name}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-6">
                        Featured in leading publications and media outlets
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                        <span className="text-2xl font-bold text-foreground">TechCrunch</span>
                        <span className="text-2xl font-bold text-foreground">Forbes</span>
                        <span className="text-2xl font-bold text-foreground">VentureBeat</span>
                        <span className="text-2xl font-bold text-foreground">HR Dive</span>
                        <span className="text-2xl font-bold text-foreground">Business Insider</span>
                    </div>
                </div>
            </div>
        </section>);

};

export default IndustryRecognition;

import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Stat {
    value: string;
    label: string;
    icon: string;
}

interface Company {
    name: string;
    logo: string;
    alt: string;
}

interface SocialProofSectionProps {
    className?: string;
}

const SocialProofSection = ({ className = '' }: SocialProofSectionProps) => {
    const stats: Stat[] = [
        { value: '50K+', label: 'Successful Placements', icon: 'UserGroupIcon' },
        { value: '85%', label: 'Time Saved on Screening', icon: 'ClockIcon' },
        { value: '1,200+', label: 'Active Companies', icon: 'BuildingOfficeIcon' },
        { value: '4.9/5', label: 'Customer Satisfaction', icon: 'StarIcon' }];


    const companies: Company[] = [
        { name: 'TechCorp', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_16ff9e543-1764654461389.png", alt: 'TechCorp company logo with blue and white color scheme' },
        { name: 'InnovateLabs', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_19a415dd0-1764657339830.png", alt: 'InnovateLabs company logo with modern geometric design' },
        { name: 'GlobalHR', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_16e009ac0-1768023468938.png", alt: 'GlobalHR company logo with professional typography' },
        { name: 'FutureWorks', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1933e3b26-1766569661431.png", alt: 'FutureWorks company logo with minimalist design' },
        { name: 'DataDrive', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c308f336-1766986669085.png", alt: 'DataDrive company logo with tech-focused branding' },
        { name: 'CloudScale', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1d48472f6-1767328493322.png", alt: 'CloudScale company logo with cloud computing theme' }];


    return (
        <section className={`py-20 lg:py-28 bg-white ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat, index) =>
                        <div key={index} className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                <Icon name={stat.icon as any} size={32} className="text-[#696969]" variant="solid" />
                            </div>
                            <p className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
                                {stat.value}
                            </p>
                            <p className="text-muted-foreground font-medium">
                                {stat.label}
                            </p>
                        </div>
                    )}
                </div>

                {/* Company Logos */}
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                        Trusted by Leading Organizations
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                        {companies.map((company, index) =>
                            <div
                                key={index}
                                className="flex items-center justify-center p-4 bg-muted rounded-lg hover:bg-red-50/50 transition-colors">

                                <AppImage
                                    src={company.logo}
                                    alt={company.alt}
                                    className="w-full h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" />

                            </div>
                        )}
                    </div>
                </div>

                {/* Testimonial */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-red-50/50 rounded-2xl p-8 lg:p-12 border border-primary/10">
                    <div className="flex items-start space-x-1 mb-6">
                        {[...Array(5)].map((_, i) =>
                            <Icon key={i} name="StarIcon" size={24} className="text-warning" variant="solid" />
                        )}
                    </div>
                    <blockquote className="text-xl lg:text-2xl text-foreground font-medium leading-relaxed mb-8">
                        "Hiring Intelligence Platform transformed our hiring process completely. We reduced time-to-hire by 60% and improved candidate quality significantly. The AI-powered ranking system is incredibly accurate."
                    </blockquote>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="UserIcon" size={32} className="text-[#696969]" variant="solid" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-lg">Jennifer Martinez</p>
                            <p className="text-muted-foreground">VP of Talent Acquisition, TechCorp</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>);

};

export default SocialProofSection;

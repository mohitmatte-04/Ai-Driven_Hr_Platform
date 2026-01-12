'use client';

import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import CaseStudyCard from './CaseStudyCard';
import VideoTestimonialCard from './VideoTestimonialCard';

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

interface VideoTestimonial {
    id: string;
    company: string;
    industry: string;
    thumbnail: string;
    thumbnailAlt: string;
    videoUrl: string;
    author: string;
    authorRole: string;
    authorImage: string;
    authorImageAlt: string;
    quote: string;
    duration: string;
}

const CustomerSuccessInteractive: React.FC = () => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [selectedCompanySize, setSelectedCompanySize] = useState('all');

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const caseStudies: CaseStudy[] = [
        {
            id: 'techcorp-transformation',
            company: 'TechCorp Solutions',
            industry: 'technology',
            companySize: 'enterprise',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1535965e3-1764635714824.png",
            logoAlt: 'TechCorp Solutions modern blue and white logo with geometric design',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1efc8391b-1767700962291.png",
            imageAlt: 'Modern office space with diverse team collaborating around conference table with laptops',
            title: 'How TechCorp Reduced Time-to-Hire by 65%',
            description: 'Leading software company transforms recruitment process with AI-powered automation, achieving unprecedented efficiency gains.',
            challenge: 'TechCorp was struggling with a 45-day average time-to-hire and losing top candidates to competitors due to slow processes.',
            solution: 'Implemented Hiring Intelligence Platform\'s complete platform including AI resume parsing, intelligent ranking, and automated communication workflows.',
            metrics: [
                { label: 'Time Saved', value: '65%', icon: 'ClockIcon' },
                { label: 'Faster Hiring', value: '3.2x', icon: 'BoltIcon' },
                { label: 'Cost Reduction', value: '$1.2M', icon: 'CurrencyDollarIcon' },
                { label: 'Quality Score', value: '94%', icon: 'StarIcon' }],

            testimonial: 'Hiring Intelligence Platform transformed our entire hiring process. We\'re now making better hires faster than ever before.',
            author: 'Sarah Chen',
            authorRole: 'VP of Talent Acquisition',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1732abd57-1763294834320.png",
            authorImageAlt: 'Professional Asian woman with long dark hair in navy blazer smiling at camera',
            pdfUrl: '/case-studies/techcorp-transformation.pdf'
        },
        {
            id: 'healthplus-scale',
            company: 'HealthPlus Medical',
            industry: 'healthcare',
            companySize: 'medium',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1acdfb47d-1767763567774.png",
            logoAlt: 'HealthPlus Medical logo with red cross symbol and modern typography',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cd949ee5-1766416775050.png",
            imageAlt: 'Healthcare professionals in white coats reviewing patient charts in bright hospital corridor',
            title: 'Scaling Healthcare Recruitment During Rapid Growth',
            description: 'Regional healthcare provider successfully scales hiring operations while maintaining quality standards during 200% growth phase.',
            challenge: 'Needed to triple their workforce within 18 months while ensuring all candidates met strict healthcare compliance requirements.',
            solution: 'Leveraged Hiring Intelligence Platform\'s compliance-focused features and automated screening to maintain quality at scale.',
            metrics: [
                { label: 'Hires Completed', value: '450+', icon: 'UserGroupIcon' },
                { label: 'Compliance Rate', value: '100%', icon: 'ShieldCheckIcon' },
                { label: 'Time Saved', value: '72%', icon: 'ClockIcon' },
                { label: 'Candidate NPS', value: '89', icon: 'HeartIcon' }],

            testimonial: 'We couldn\'t have scaled this fast without Hiring Intelligence Platform. The compliance automation alone saved us countless hours.',
            author: 'Dr. Michael Rodriguez',
            authorRole: 'Chief Human Resources Officer',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f147df5d-1763301649610.png",
            authorImageAlt: 'Hispanic male doctor in white coat with stethoscope smiling confidently',
            pdfUrl: '/case-studies/healthplus-scale.pdf'
        },
        {
            id: 'fintech-innovation',
            company: 'FinTech Innovations',
            industry: 'finance',
            companySize: 'startup',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_19a5a771a-1768023468225.png",
            logoAlt: 'FinTech Innovations sleek logo with gradient blue and green colors',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_175115bcb-1764706023945.png",
            imageAlt: 'Young diverse startup team celebrating success in modern open office with glass walls',
            title: 'Building a World-Class Team from Scratch',
            description: 'Fast-growing fintech startup builds entire engineering team using data-driven recruitment strategies.',
            challenge: 'As a new company, needed to compete with established firms for top talent while building employer brand from zero.',
            solution: 'Used Hiring Intelligence Platform\'s candidate ranking and communication tools to create personalized, efficient hiring experiences.',
            metrics: [
                { label: 'Team Built', value: '85', icon: 'UsersIcon' },
                { label: 'Offer Accept', value: '92%', icon: 'CheckCircleIcon' },
                { label: 'Time-to-Hire', value: '18 days', icon: 'CalendarIcon' },
                { label: 'Retention', value: '96%', icon: 'TrophyIcon' }],

            testimonial: 'Hiring Intelligence Platform gave us the tools to compete with tech giants. Our hiring process is now our competitive advantage.',
            author: 'Jessica Park',
            authorRole: 'Co-Founder & Head of People',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b2fb6b9a-1763301304281.png",
            authorImageAlt: 'Young Asian woman with glasses and casual blazer smiling in startup office',
            pdfUrl: '/case-studies/fintech-innovation.pdf'
        },
        {
            id: 'retail-transformation',
            company: 'RetailMax Group',
            industry: 'retail',
            companySize: 'enterprise',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_132a89a65-1767167520619.png",
            logoAlt: 'RetailMax Group logo with shopping bag icon in vibrant orange',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_16d12ccdc-1764794606714.png",
            imageAlt: 'Busy retail store interior with customers shopping and staff assisting in modern layout',
            title: 'Modernizing Retail Recruitment Across 200+ Locations',
            description: 'National retail chain transforms decentralized hiring process into streamlined, data-driven operation.',
            challenge: 'Managing inconsistent hiring practices across hundreds of locations with high turnover and seasonal demands.',
            solution: 'Centralized recruitment through Hiring Intelligence Platform with location-specific workflows and automated candidate communication.',
            metrics: [
                { label: 'Locations', value: '200+', icon: 'MapPinIcon' },
                { label: 'Annual Hires', value: '5,000+', icon: 'UserPlusIcon' },
                { label: 'Cost Per Hire', value: '-58%', icon: 'ArrowDownIcon' },
                { label: 'Quality Score', value: '88%', icon: 'StarIcon' }],

            testimonial: 'Hiring Intelligence Platform brought consistency and efficiency to our hiring across all locations. Game-changing for retail.',
            author: 'David Thompson',
            authorRole: 'SVP of Human Capital',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_14400dd67-1763294361779.png",
            authorImageAlt: 'Mature Caucasian businessman in dark suit with confident smile in corporate setting',
            pdfUrl: '/case-studies/retail-transformation.pdf'
        },
        {
            id: 'manufacturing-excellence',
            company: 'PrecisionMfg Industries',
            industry: 'manufacturing',
            companySize: 'medium',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1cc6042fd-1764661553303.png",
            logoAlt: 'PrecisionMfg Industries logo with gear icon in industrial gray and blue',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3af06b7-1767945942748.png",
            imageAlt: 'Manufacturing facility floor with workers in safety gear operating modern machinery',
            title: 'Finding Specialized Talent in Competitive Market',
            description: 'Manufacturing company overcomes skilled labor shortage with targeted recruitment strategies.',
            challenge: 'Struggling to find qualified candidates for specialized manufacturing roles in tight labor market.',
            solution: 'Implemented AI-powered candidate matching to identify transferable skills and hidden talent pools.',
            metrics: [
                { label: 'Fill Rate', value: '95%', icon: 'CheckBadgeIcon' },
                { label: 'Time-to-Fill', value: '-42%', icon: 'ClockIcon' },
                { label: 'Quality Hires', value: '91%', icon: 'SparklesIcon' },
                { label: 'Retention', value: '94%', icon: 'ShieldCheckIcon' }],

            testimonial: 'The AI matching helped us find candidates we would have missed. Our production floor has never been stronger.',
            author: 'Robert Martinez',
            authorRole: 'Director of Operations',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1078b8bc3-1763296698021.png",
            authorImageAlt: 'Hispanic man with beard in hard hat and safety vest smiling in industrial setting',
            pdfUrl: '/case-studies/manufacturing-excellence.pdf'
        },
        {
            id: 'agency-growth',
            company: 'TalentBridge Recruiting',
            industry: 'technology',
            companySize: 'small',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1eea8e2d7-1764900444188.png",
            logoAlt: 'TalentBridge Recruiting logo with bridge icon in professional teal',
            image: "https://images.unsplash.com/photo-1538688554366-621d446302aa",
            imageAlt: 'Small recruitment team collaborating around laptop in bright modern office space',
            title: 'Recruitment Agency Doubles Client Capacity',
            description: 'Boutique recruiting firm scales operations without adding headcount through automation.',
            challenge: 'Wanted to grow client base but limited by manual processes and small team size.',
            solution: 'Automated routine tasks with Hiring Intelligence Platform, allowing recruiters to focus on relationship building and placements.',
            metrics: [
                { label: 'Client Growth', value: '120%', icon: 'ArrowTrendingUpIcon' },
                { label: 'Placements', value: '2.5x', icon: 'UserGroupIcon' },
                { label: 'Revenue', value: '+$850K', icon: 'CurrencyDollarIcon' },
                { label: 'Efficiency', value: '78%', icon: 'BoltIcon' }],

            testimonial: 'Hiring Intelligence Platform is like adding 3 recruiters to our team. We\'re serving more clients with the same headcount.',
            author: 'Amanda Foster',
            authorRole: 'Founder & CEO',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_116022a91-1763299783599.png",
            authorImageAlt: 'Professional woman with blonde hair in business casual attire smiling warmly',
            pdfUrl: '/case-studies/agency-growth.pdf'
        }];


    const videoTestimonials: VideoTestimonial[] = [
        {
            id: 'video-1',
            company: 'GlobalTech Corp',
            industry: 'technology',
            thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_18b824279-1767883812278.png",
            thumbnailAlt: 'Professional woman in business attire speaking to camera in modern office with city view',
            videoUrl: 'https://example.com/testimonials/globaltech.mp4',
            author: 'Emily Watson',
            authorRole: 'Chief People Officer',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_141b6fda2-1763295319855.png",
            authorImageAlt: 'Professional woman with brown hair in navy blazer smiling confidently',
            quote: 'Hiring Intelligence Platform has completely transformed how we approach talent acquisition. The AI capabilities are truly game-changing.',
            duration: '2:45'
        },
        {
            id: 'video-2',
            company: 'MedCare Systems',
            industry: 'healthcare',
            thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1d468052f-1764794631419.png",
            thumbnailAlt: 'Male doctor in white coat with stethoscope speaking in hospital conference room',
            videoUrl: 'https://example.com/testimonials/medcare.mp4',
            author: 'Dr. James Wilson',
            authorRole: 'VP of Talent Management',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f6ba27b0-1763296311975.png",
            authorImageAlt: 'African American male doctor in white coat with warm smile',
            quote: 'The compliance features and automated screening have saved us hundreds of hours while ensuring we never miss a requirement.',
            duration: '3:12'
        },
        {
            id: 'video-3',
            company: 'InnovateFin',
            industry: 'finance',
            thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_152a20dcc-1763294701388.png",
            thumbnailAlt: 'Young businessman in suit presenting in modern glass-walled conference room',
            videoUrl: 'https://example.com/testimonials/innovatefin.mp4',
            author: 'Marcus Johnson',
            authorRole: 'Head of Recruitment',
            authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1ffe872cd-1763294679798.png",
            authorImageAlt: 'Professional Black man in charcoal suit with confident expression',
            quote: 'We went from 40 days to 14 days average time-to-hire. The ROI was evident within the first month.',
            duration: '2:28'
        }];


    const filteredCaseStudies = caseStudies.filter((study) => {
        const industryMatch = selectedIndustry === 'all' || study.industry === selectedIndustry;
        const sizeMatch = selectedCompanySize === 'all' || study.companySize === selectedCompanySize;
        return industryMatch && sizeMatch;
    });

    const filteredVideoTestimonials = videoTestimonials.filter((video) => {
        return selectedIndustry === 'all' || video.industry === selectedIndustry;
    });

    if (!isHydrated) {
        return (
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-muted-foreground">Loading success stories...</div>
                </div>
            </div>);

    }

    return (
        <>
            <section className="py-16 lg:py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FilterBar
                        selectedIndustry={selectedIndustry}
                        selectedCompanySize={selectedCompanySize}
                        onIndustryChange={setSelectedIndustry}
                        onCompanySizeChange={setSelectedCompanySize}
                        className="mb-12" />


                    <div className="mb-16">
                        <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-8">
                            Featured Case Studies
                        </h2>
                        {filteredCaseStudies.length > 0 ?
                            <div className="grid lg:grid-cols-2 gap-8">
                                {filteredCaseStudies.map((caseStudy) =>
                                    <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                                )}
                            </div> :

                            <div className="text-center py-12 bg-muted rounded-lg">
                                <p className="text-muted-foreground">No case studies found matching your filters. Try adjusting your selection.</p>
                            </div>
                        }
                    </div>

                    <div>
                        <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-8">
                            Video Testimonials
                        </h2>
                        {filteredVideoTestimonials.length > 0 ?
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredVideoTestimonials.map((testimonial) =>
                                    <VideoTestimonialCard key={testimonial.id} testimonial={testimonial} />
                                )}
                            </div> :

                            <div className="text-center py-12 bg-muted rounded-lg">
                                <p className="text-muted-foreground">No video testimonials found matching your filters.</p>
                            </div>
                        }
                    </div>
                </div>
            </section>
        </>);

};

export default CustomerSuccessInteractive;

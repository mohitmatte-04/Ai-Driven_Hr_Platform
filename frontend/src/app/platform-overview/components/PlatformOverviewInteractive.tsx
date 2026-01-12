'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import CoreServicesSection from './CoreServicesSection';
import FeatureComparisonSection from './FeatureComparisonSection';
import IntegrationShowcase from './IntegrationShowcase';
import PerformanceMetrics from './PerformanceMetrics';
import VideoDemo from './VideoDemo';
import Footer from './Footer';

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

interface ComparisonFeature {
    category: string;
    features: {
        name: string;
        recruitflow: boolean | string;
        traditional: boolean | string;
    }[];
}

interface Integration {
    name: string;
    category: string;
    logo: string;
    logoAlt: string;
    description: string;
}

interface Metric {
    icon: string;
    value: string;
    label: string;
    description: string;
    color: string;
}

export default function PlatformOverviewInteractive() {
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    const services: Service[] = [
        {
            id: 'jd-parsing',
            icon: 'DocumentTextIcon',
            title: 'JD Parsing',
            description: 'Transform unstructured job descriptions into structured, searchable data. Our AI extracts key requirements, skills, and qualifications automatically.',
            features: [
                'Automatic skill extraction from any job description format',
                'Requirement categorization (must-have vs nice-to-have)',
                'Experience level detection and standardization',
                'Location and compensation parsing'],

            image: "https://img.rocket.new/generatedImages/rocket_gen_img_139da30ae-1768023471700.png",
            imageAlt: 'Professional recruiter reviewing structured job description data on modern laptop with highlighted skills and requirements',
            color: 'bg-blue-500'
        },
        {
            id: 'resume-parsing',
            icon: 'DocumentCheckIcon',
            title: 'Resume Parsing',
            description: 'Extract and structure candidate information from any resume format. Our advanced AI handles PDFs, Word docs, and even scanned documents.',
            features: [
                'Multi-format support (PDF, DOCX, images)',
                'Contact information extraction',
                'Work history and education parsing',
                'Skills and certifications identification'],

            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ecd150f1-1766953611540.png",
            imageAlt: 'Close-up of hands holding professional resume document being scanned by AI parsing software on tablet device',
            color: 'bg-green-500'
        },
        {
            id: 'candidate-ranking',
            icon: 'ChartBarIcon',
            title: 'Candidate Ranking',
            description: 'Intelligent matching algorithm that ranks candidates based on job requirements. Get the best matches first, every time.',
            features: [
                'AI-powered skill matching and scoring',
                'Experience relevance calculation',
                'Cultural fit indicators',
                'Customizable ranking criteria'],

            image: "https://img.rocket.new/generatedImages/rocket_gen_img_14f04c770-1765006471552.png",
            imageAlt: 'HR manager analyzing ranked candidate profiles on large monitor with scoring metrics and match percentages displayed',
            color: 'bg-purple-500'
        },
        {
            id: 'communication-hub',
            icon: 'ChatBubbleLeftRightIcon',
            title: 'Communication Hub',
            description: 'Centralized communication platform for seamless candidate engagement. Manage all interactions in one place.',
            features: [
                'Automated email templates and scheduling',
                'Interview scheduling with calendar integration',
                'SMS and WhatsApp messaging support',
                'Communication history tracking'],

            image: "https://img.rocket.new/generatedImages/rocket_gen_img_139d45c67-1766844396733.png",
            imageAlt: 'Diverse team of recruiters collaborating around conference table with communication dashboard visible on wall-mounted screen',
            color: 'bg-orange-500'
        }];


    const comparisonData: ComparisonFeature[] = [
        {
            category: 'AI & Automation',
            features: [
                { name: 'AI-Powered Parsing', recruitflow: true, traditional: false },
                { name: 'Intelligent Ranking', recruitflow: true, traditional: false },
                { name: 'Auto-Categorization', recruitflow: true, traditional: 'Limited' },
                { name: 'Smart Matching', recruitflow: '95% accuracy', traditional: '60% accuracy' }]

        },
        {
            category: 'Efficiency',
            features: [
                { name: 'Processing Speed', recruitflow: '< 2 seconds', traditional: '5-10 minutes' },
                { name: 'Bulk Processing', recruitflow: true, traditional: false },
                { name: 'Time Saved', recruitflow: '87%', traditional: '30%' },
                { name: 'Manual Review Required', recruitflow: 'Minimal', traditional: 'Extensive' }]

        },
        {
            category: 'Integration',
            features: [
                { name: 'ATS Integration', recruitflow: true, traditional: 'Limited' },
                { name: 'API Access', recruitflow: true, traditional: false },
                { name: 'Custom Workflows', recruitflow: true, traditional: false },
                { name: 'Real-time Sync', recruitflow: true, traditional: false }]

        }];


    const integrations: Integration[] = [
        {
            name: 'Greenhouse',
            category: 'Applicant Tracking Systems',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_11eeccf9e-1764745323833.png",
            logoAlt: 'Greenhouse ATS platform logo with green leaf icon',
            description: 'Seamless candidate sync'
        },
        {
            name: 'Workday',
            category: 'Applicant Tracking Systems',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_125c23015-1767333361127.png",
            logoAlt: 'Workday HR software logo with blue and orange colors',
            description: 'Full HR integration'
        },
        {
            name: 'Lever',
            category: 'Applicant Tracking Systems',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1576cf5-1766481181537.png",
            logoAlt: 'Lever recruitment platform logo with purple gradient',
            description: 'Automated workflows'
        },
        {
            name: 'BambooHR',
            category: 'Applicant Tracking Systems',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff9fbd3e-1764695490028.png",
            logoAlt: 'BambooHR platform logo with bamboo leaf design',
            description: 'Employee data sync'
        },
        {
            name: 'Slack',
            category: 'Communication Tools',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_103aa447c-1764658017289.png",
            logoAlt: 'Slack messaging platform logo with colorful hashtag symbol',
            description: 'Team notifications'
        },
        {
            name: 'Microsoft Teams',
            category: 'Communication Tools',
            logo: "https://images.unsplash.com/photo-1633410189542-36d96e3762b8",
            logoAlt: 'Microsoft Teams logo with purple and blue colors',
            description: 'Video interviews'
        },
        {
            name: 'Zoom',
            category: 'Communication Tools',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_11fc5d02e-1767109863690.png",
            logoAlt: 'Zoom video conferencing logo with blue camera icon',
            description: 'Interview scheduling'
        },
        {
            name: 'Gmail',
            category: 'Communication Tools',
            logo: "https://img.rocket.new/generatedImages/rocket_gen_img_10b54c343-1766481136185.png",
            logoAlt: 'Gmail email service logo with red and white envelope icon',
            description: 'Email automation'
        }];


    const metrics: Metric[] = [
        {
            icon: 'ClockIcon',
            value: '87%',
            label: 'Time Saved',
            description: 'Average reduction in screening time per candidate',
            color: 'bg-blue-500'
        },
        {
            icon: 'UserGroupIcon',
            value: '10K+',
            label: 'Candidates Ranked',
            description: 'Successfully matched and placed monthly',
            color: 'bg-green-500'
        },
        {
            icon: 'ChartBarIcon',
            value: '95%',
            label: 'Match Accuracy',
            description: 'AI-powered candidate-job fit scoring',
            color: 'bg-purple-500'
        },
        {
            icon: 'BoltIcon',
            value: '< 2s',
            label: 'Processing Speed',
            description: 'Average time to parse and rank resumes',
            color: 'bg-orange-500'
        }];


    const handleDemoClick = () => {
        setIsDemoOpen(true);
    };

    const handleServiceClick = (serviceId: string) => {
        console.log(`Navigating to service: ${serviceId}`);
    };

    return (
        <>
            <HeroSection onDemoClick={handleDemoClick} />
            <CoreServicesSection services={services} onServiceClick={handleServiceClick} />
            <FeatureComparisonSection comparisonData={comparisonData} />
            <IntegrationShowcase integrations={integrations} />
            <PerformanceMetrics metrics={metrics} />
            <Footer />
            <VideoDemo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
        </>);

}

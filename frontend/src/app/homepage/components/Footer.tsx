'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface FooterProps {
    className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [currentYear, setCurrentYear] = useState(2026);

    useEffect(() => {
        setIsHydrated(true);
        setCurrentYear(new Date().getFullYear());
    }, []);

    const footerSections: FooterSection[] = [
        {
            title: 'Platform',
            links: [
                { label: 'Overview', href: '/platform-overview' },
                { label: 'Features', href: '/platform-overview' },
                { label: 'Pricing', href: '/platform-overview' },
                { label: 'Security', href: '/platform-overview' }
            ]
        },
        {
            title: 'Solutions',
            links: [
                { label: 'JD Parsing', href: '/solutions-hub' },
                { label: 'Resume Parsing', href: '/solutions-hub' },
                { label: 'Candidate Ranking', href: '/solutions-hub' },
                { label: 'Communication Hub', href: '/solutions-hub' }
            ]
        },
        {
            title: 'Resources',
            links: [
                { label: 'Documentation', href: '/resource-library' },
                { label: 'API Reference', href: '/resource-library' },
                { label: 'Blog', href: '/resource-library' },
                { label: 'Help Center', href: '/resource-library' }
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/about' },
                { label: 'Success Stories', href: '/customer-success' },
                { label: 'Careers', href: '/about' },
                { label: 'Contact', href: '/about' }
            ]
        }
    ];

    const socialLinks = [
        { name: 'Twitter', icon: 'XMarkIcon', href: '#' },
        { name: 'LinkedIn', icon: 'LinkIcon', href: '#' },
        { name: 'GitHub', icon: 'CodeBracketIcon', href: '#' }
    ];

    if (!isHydrated) {
        return (
            <footer className={`bg-gray-50 border-t border-border ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className={`bg-gray-50 border-t border-border ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/homepage" className="flex items-center space-x-2 mb-6">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width="40" height="40" rx="8" fill="#f35959" />
                                <path
                                    d="M12 14C12 12.8954 12.8954 12 14 12H18C19.1046 12 20 12.8954 20 14V18C20 19.1046 19.1046 20 18 20H14C12.8954 20 12 19.1046 12 18V14Z"
                                    fill="white"
                                />
                                <path
                                    d="M22 14C22 12.8954 22.8954 12 24 12H26C27.1046 12 28 12.8954 28 14V26C28 27.1046 27.1046 28 26 28H24C22.8954 28 22 27.1046 22 26V14Z"
                                    fill="white"
                                />
                                <path
                                    d="M12 22C12 20.8954 12.8954 20 14 20H18C19.1046 20 20 20.8954 20 22V26C20 27.1046 19.1046 28 18 28H14C12.8954 28 12 27.1046 12 26V22Z"
                                    fill="white"
                                    fillOpacity="0.7"
                                />
                            </svg>
                            <span className="text-xl font-heading font-bold text-foreground">Hiring Intelligence Platform</span>
                        </Link>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            AI-powered recruitment platform that transforms traditional hiring through intelligent automation.
                        </p>
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 bg-gray-200 hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-colors text-foreground"
                                    aria-label={social.name}
                                >
                                    <Icon name={social.icon as any} size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Hiring Intelligence Platform. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6">
                            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

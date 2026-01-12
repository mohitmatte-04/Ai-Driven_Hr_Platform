import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { label: 'Platform Overview', href: '/platform-overview' },
            { label: 'Solutions Hub', href: '/solutions-hub' },
            { label: 'Resource Library', href: '/resource-library' },
        ],
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Customer Success', href: '/customer-success' },
            { label: 'Careers', href: '/about' },
        ],
        support: [
            { label: 'Help Center', href: '/resource-library' },
            { label: 'API Documentation', href: '/resource-library' },
            { label: 'Contact Us', href: '/customer-success' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/about' },
            { label: 'Terms of Service', href: '/about' },
            { label: 'Security', href: '/about' },
        ],
    };

    const socialLinks = [
        { name: 'Twitter', icon: 'AtSymbolIcon', href: '#' },
        { name: 'LinkedIn', icon: 'BuildingOfficeIcon', href: '#' },
        { name: 'GitHub', icon: 'CodeBracketIcon', href: '#' },
    ];

    return (
        <footer className="bg-foreground text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/homepage" className="flex items-center space-x-2 mb-4">
                            <svg
                                width="32"
                                height="32"
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
                            <span className="text-xl font-bold">Hiring Intelligence Platform</span>
                        </Link>
                        <p className="text-sm text-white text-opacity-70 mb-4">
                            AI-powered recruitment platform transforming hiring through intelligent automation.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-white bg-opacity-10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                                    aria-label={social.name}
                                >
                                    <Icon name={social.icon as any} size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2">
                            {footerLinks.platform.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white text-opacity-70 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white text-opacity-70 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white text-opacity-70 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white text-opacity-70 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white border-opacity-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <p className="text-sm text-white text-opacity-70">
                            &copy; {currentYear} Hiring Intelligence Platform. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-white text-opacity-70">
                            <span className="flex items-center space-x-1">
                                <Icon name="ShieldCheckIcon" size={16} />
                                <span>SOC 2 Certified</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <Icon name="LockClosedIcon" size={16} />
                                <span>GDPR Compliant</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

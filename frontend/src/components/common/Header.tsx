'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
    className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/homepage' },
        { name: 'Platform', href: '/platform-overview' },
        { name: 'Solutions', href: '/solutions-hub' },
        { name: 'Resources', href: '/resource-library' },
        { name: 'Success Stories', href: '/customer-success' },
    ];

    const moreLinks = [
        { name: 'About', href: '/about' },
    ];

    return (
        <header className={`bg-white border-b border-border sticky top-0 z-50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/homepage" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold text-primary">Hiring Intelligence Platform</div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* More Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                            >
                                <span>More</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>

                            {isMoreDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border">
                                    {moreLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                                            onClick={() => setIsMoreDropdownOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="#demo"
                            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                        >
                            Watch Demo
                        </Link>
                        <Link
                            href="#trial"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                        >
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-foreground hover:text-primary"
                    >
                        {isMobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-border">
                    <nav className="px-4 pt-2 pb-4 space-y-2">
                        {[...navLinks, ...moreLinks].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-2">
                            <Link
                                href="#demo"
                                className="block py-2 text-center text-foreground hover:text-primary transition-colors duration-200 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Watch Demo
                            </Link>
                            <Link
                                href="#trial"
                                className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

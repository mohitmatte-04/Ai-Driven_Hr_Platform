import type { Metadata } from 'next';
import '../styles/tailwind.css';

export const metadata: Metadata = {
    title: 'Hiring Intelligence Platform - AI-Powered Recruitment Platform',
    description: 'Transform your hiring process with intelligent automation',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="font-sans">{children}</body>
        </html>
    );
}

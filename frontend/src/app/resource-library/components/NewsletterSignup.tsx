'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function NewsletterSignup() {
    const [isHydrated, setIsHydrated] = useState(false);
    const [email, setEmail] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const topics = [
        { id: 'ai-trends', label: 'AI & Automation' },
        { id: 'best-practices', label: 'Best Practices' },
        { id: 'industry-news', label: 'Industry News' },
        { id: 'case-studies', label: 'Case Studies' },
    ];

    const handleTopicToggle = (topicId: string) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(t => t !== topicId)
                : [...prev, topicId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && selectedTopics.length > 0) {
            setIsSubmitted(true);
            setTimeout(() => {
                setEmail('');
                setSelectedTopics([]);
                setIsSubmitted(false);
            }, 3000);
        }
    };

    if (!isHydrated) {
        return (
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                        Stay Updated with Latest Insights
                    </h3>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="CheckIcon" size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                        Successfully Subscribed!
                    </h3>
                    <p className="text-muted-foreground">
                        Check your inbox for a confirmation email.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                        Stay Updated with Latest Insights
                    </h3>
                    <p className="text-muted-foreground">
                        Get personalized content delivered to your inbox. Choose your interests and receive weekly updates.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="newsletter-email" className="block text-sm font-semibold text-foreground mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Icon
                                name="EnvelopeIcon"
                                size={20}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@company.com"
                                required
                                className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background text-foreground"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                            Content Preferences
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {topics.map((topic) => (
                                <label
                                    key={topic.id}
                                    className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTopics.includes(topic.id)}
                                        onChange={() => handleTopicToggle(topic.id)}
                                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                                    />
                                    <span className="text-sm text-foreground">{topic.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!email || selectedTopics.length === 0}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Subscribe to Newsletter
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                        By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
                    </p>
                </form>
            </div>
        </div>
    );
}

import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/app/homepage/components/Footer';
import BackButton from '@/app/components/BackButton';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
    title: 'Communication - Hiring Intelligence Platform',
    description: 'Reach out to top candidates with automated communication workflows.',
};

export default function CommunicationPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 px-4 pb-20 max-w-7xl mx-auto">
                <div className="mb-8">
                    <BackButton />
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
                        <Icon name="ChatBubbleLeftRightIcon" size={36} className="text-primary" variant="solid" />
                        Communication Hub
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Reach out to top candidates with automated communication workflows.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                <Icon name="PaperAirplaneIcon" size={24} className="text-orange-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">1000+</p>
                                <p className="text-sm text-muted-foreground">Messages Sent</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Icon name="CheckCircleIcon" size={24} className="text-green-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">85%</p>
                                <p className="text-sm text-muted-foreground">Response Rate</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-card border border-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Icon name="ClockIcon" size={24} className="text-blue-600" variant="solid" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground">5x</p>
                                <p className="text-sm text-muted-foreground">Faster Outreach</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Message Composer */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-card border border-border p-6 sticky top-32">
                            <h2 className="text-xl font-heading font-bold text-foreground mb-4">Send Message</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Job Position
                                    </label>
                                    <select className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                                        <option value="">Select job...</option>
                                        <option value="1">Senior React Developer</option>
                                        <option value="2">Full-Stack Engineer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Candidate
                                    </label>
                                    <select className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                                        <option value="">Select candidate...</option>
                                        <option value="1">Sarah Johnson</option>
                                        <option value="2">Michael Chen</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Message Template
                                    </label>
                                    <select className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mb-3">
                                        <option value="">Choose template...</option>
                                        <option value="interview">Interview Invitation</option>
                                        <option value="shortlist">Shortlist Notification</option>
                                        <option value="followup">Follow-up</option>
                                    </select>
                                    <textarea
                                        placeholder="Type your message..."
                                        rows={6}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                    />
                                </div>

                                <button className="w-full px-6 py-3 text-base font-semibold text-primary-foreground bg-primary hover:bg-accent rounded-lg shadow-card transition-all duration-200">
                                    <Icon name="PaperAirplaneIcon" size={20} className="inline mr-2" />
                                    Send Message
                                </button>

                                {/* Backend Integration Placeholder */}
                                <div className="mt-6 p-4 bg-muted rounded-lg border-l-4 border-primary">
                                    <p className="text-sm font-semibold text-foreground mb-1">Backend Integration</p>
                                    <p className="text-xs text-muted-foreground">
                                        Connect to your Communication Agent API endpoint here
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-card border border-border p-6">
                            <h2 className="text-xl font-heading font-bold text-foreground mb-6">Recent Communications</h2>

                            {/* Empty State */}
                            <div className="text-center py-12">
                                <Icon name="ChatBubbleLeftRightIcon" size={48} className="mx-auto text-muted-foreground mb-4" variant="outline" />
                                <p className="text-muted-foreground">No messages sent yet. Send your first message above!</p>
                            </div>

                            {/* Example of message card (hidden by default) */}
                            <div className="hidden space-y-4">
                                <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-heading font-bold text-primary mb-1">Sarah Johnson</h3>
                                            <p className="text-sm text-muted-foreground mb-3">Senior React Developer</p>
                                            <p className="text-sm text-foreground mb-3">
                                                We're impressed with your background and would like to invite you for an interview...
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>Sent 2 hours ago</span>
                                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full font-semibold">Replied</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

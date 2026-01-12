import AppImage from '@/components/ui/AppImage';

export default function HeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                            <span className="text-sm font-semibold text-primary">About Hiring Intelligence Platform</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
                            Empowering Recruiters with{' '}
                            <span style={{ color: '#696969' }}>Intelligent Automation</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                            We believe in a future where technology amplifies human insight rather than replacing it. Hiring Intelligence Platform empowers recruiters to make better matches faster through AI-powered precision, efficiency, and trust.
                        </p>
                        <div className="flex flex-wrap gap-8 pt-4">
                            <div>
                                <div className="text-3xl lg:text-4xl font-bold text-primary">500+</div>
                                <div className="text-sm text-muted-foreground mt-1">Companies Trust Us</div>
                            </div>
                            <div>
                                <div className="text-3xl lg:text-4xl font-bold text-primary">1M+</div>
                                <div className="text-sm text-muted-foreground mt-1">Candidates Matched</div>
                            </div>
                            <div>
                                <div className="text-3xl lg:text-4xl font-bold text-primary">85%</div>
                                <div className="text-sm text-muted-foreground mt-1">Time Saved</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-elevated">
                        <AppImage
                            src="https://img.rocket.new/generatedImages/rocket_gen_img_1efc8391b-1767700962291.png"
                            alt="Diverse team of professionals collaborating in modern office with laptops and documents on conference table"
                            className="w-full h-full object-cover" />

                    </div>
                </div>
            </div>
        </section>);

}

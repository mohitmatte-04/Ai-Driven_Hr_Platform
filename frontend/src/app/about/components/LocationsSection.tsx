import Icon from '@/components/ui/AppIcon';

interface Location {
    id: number;
    city: string;
    country: string;
    address: string;
    phone: string;
    email: string;
    type: string;
    lat: number;
    lng: number;
}

export default function LocationsSection() {
    const locations: Location[] = [
        {
            id: 1,
            city: 'San Francisco',
            country: 'United States',
            address: '123 Market Street, Suite 500, San Francisco, CA 94103',
            phone: '+1 (415) 555-0123',
            email: 'sf@Hiring Intelligence Platform.com',
            type: 'Headquarters',
            lat: 37.7749,
            lng: -122.4194
        },
        {
            id: 2,
            city: 'New York',
            country: 'United States',
            address: '456 Fifth Avenue, Floor 12, New York, NY 10018',
            phone: '+1 (212) 555-0456',
            email: 'ny@Hiring Intelligence Platform.com',
            type: 'Regional Office',
            lat: 40.7128,
            lng: -74.0060
        },
        {
            id: 3,
            city: 'London',
            country: 'United Kingdom',
            address: '789 Oxford Street, London W1D 2HG',
            phone: '+44 20 7123 4567',
            email: 'london@Hiring Intelligence Platform.com',
            type: 'European HQ',
            lat: 51.5074,
            lng: -0.1278
        },
        {
            id: 4,
            city: 'Singapore',
            country: 'Singapore',
            address: '321 Orchard Road, #15-01, Singapore 238865',
            phone: '+65 6789 0123',
            email: 'singapore@Hiring Intelligence Platform.com',
            type: 'Asia Pacific HQ',
            lat: 1.3521,
            lng: 103.8198
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                        Our Global Presence
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        With offices across the globe, we're here to support your recruitment needs wherever you are
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {locations.map((location) => (
                        <div
                            key={location.id}
                            className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border"
                        >
                            {/* Map */}
                            <div className="h-48 bg-muted relative overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    loading="lazy"
                                    title={`${location.city} Office Location`}
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=14&output=embed`}
                                    className="border-0"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                                            {location.city}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{location.country}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {location.type}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <Icon name="MapPinIcon" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-muted-foreground">{location.address}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Icon name="PhoneIcon" size={18} className="text-primary flex-shrink-0" />
                                        <a
                                            href={`tel:${location.phone}`}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {location.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Icon name="EnvelopeIcon" size={18} className="text-primary flex-shrink-0" />
                                        <a
                                            href={`mailto:${location.email}`}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {location.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

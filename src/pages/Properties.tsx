import { MapPin, Building2 } from "lucide-react";
import Layout from "@/components/Layout";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const properties = [
  {
    image: property1,
    name: "The Meridian Tower",
    location: "Manhattan, NY",
    type: "Luxury Residential",
    units: "120 Units",
    description: "A premier luxury residential high-rise in the heart of Manhattan, featuring state-of-the-art amenities and concierge services.",
  },
  {
    image: property2,
    name: "Commerce Plaza",
    location: "Midtown, NY",
    type: "Commercial Office",
    units: "85,000 sq ft",
    description: "A Class-A commercial office building offering premium workspace with modern infrastructure and 24/7 building management.",
  },
  {
    image: property3,
    name: "Brooklyn Heritage Residences",
    location: "Brooklyn Heights, NY",
    type: "Boutique Residential",
    units: "32 Units",
    description: "Beautifully restored brownstone residences combining historic charm with modern living standards.",
  },
  {
    image: property1,
    name: "Queens Gateway",
    location: "Long Island City, NY",
    type: "Mixed-Use",
    units: "200 Units",
    description: "A dynamic mixed-use development featuring residential apartments and ground-floor retail in Queens' fastest-growing neighborhood.",
  },
  {
    image: property2,
    name: "Bronx Central Business Hub",
    location: "Bronx, NY",
    type: "Commercial",
    units: "45,000 sq ft",
    description: "A modern commercial complex serving the Bronx business community with flexible office and retail spaces.",
  },
  {
    image: property3,
    name: "Staten Island Waterfront",
    location: "Staten Island, NY",
    type: "Residential",
    units: "68 Units",
    description: "Waterfront residential community offering stunning views and resort-style amenities on Staten Island's North Shore.",
  },
];

const Properties = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-navy">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Our Portfolio</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream max-w-2xl">
            Properties Under Management
          </h1>
          <p className="font-body text-cream/70 mt-4 max-w-xl">
            Managing a diverse portfolio of residential and commercial properties across the United States.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.name}
                className="bg-card border border-border shadow-card hover:shadow-elevated transition-shadow duration-300 group overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-navy/90 text-cream px-3 py-1 text-xs font-body tracking-wide">
                    {property.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14} className="text-gold" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 size={14} className="text-gold" />
                      {property.units}
                    </div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Properties;

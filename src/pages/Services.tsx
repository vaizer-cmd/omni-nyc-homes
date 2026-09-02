import { useEffect } from "react";
import { Building2, Wrench, Users, Shield, Clock, BarChart3, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    id: "property-management",
    icon: Building2,
    title: "Property Management",
    description: "End-to-end management of residential and commercial properties including tenant relations, lease administration, rent collection, and financial reporting.",
  },
  {
    id: "building-maintenance",
    icon: Wrench,
    title: "Building Maintenance",
    description: "Comprehensive maintenance of complex building systems — HVAC, plumbing, electrical, elevators, fire safety, and structural components.",
  },
  {
    id: "tenant-relations",
    icon: Users,
    title: "Tenant Relations",
    description: "Professional tenant communication, complaint resolution, move-in/move-out coordination, and community building programs.",
  },
  {
    id: "compliance-safety",
    icon: Shield,
    title: "Compliance & Safety",
    description: "Full compliance with NYC building codes, DOB requirements, fire safety regulations, and Local Law inspections.",
  },
  {
    id: "emergency-response",
    icon: Clock,
    title: "24/7 Emergency Response",
    description: "Round-the-clock emergency maintenance and response team available for all managed properties across the five boroughs.",
  },
  {
    id: "financial-management",
    icon: BarChart3,
    title: "Financial Management",
    description: "Transparent financial reporting, budgeting, capital planning, and cost optimization to maximize property value.",
  },
];

const expertise = [
  "HVAC & Mechanical Systems",
  "Electrical & Plumbing Infrastructure",
  "Fire Safety & Life Safety Systems",
  "Elevator & Vertical Transportation",
  "Structural Maintenance & Facade",
  "Energy Management & Sustainability",
  "Security Systems & Access Control",
  "Common Area & Amenity Management",
];

const Services = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [hash]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-6 md:py-12 bg-navy">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">What We Do</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 md:py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                id={service.id}
                className="bg-card border border-border p-8 shadow-card hover:shadow-elevated transition-shadow duration-300 group scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-navy flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                    <service.icon size={24} className="text-cream" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{service.title}</h3>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Expertise */}
      <section className="py-10 bg-navy">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
                Technical Expertise
              </h2>
              <p className="font-body text-cream/70">
                We specialize in maintaining the most complex building systems at the highest level of proficiency.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {expertise.map((item) => (
                <div key={item} className="flex items-center gap-3 py-3 px-4 border border-cream/10">
                  <CheckCircle size={18} className="text-gold shrink-0" />
                  <span className="font-body text-cream/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Tenants */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">How It Works for Tenants</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Your building, at your fingertips.
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Every tenant in an OMNI-managed building gets access to our online portal — a simple, direct line to our team. Submit a maintenance request, upload a photo, track the status of your repair, and get notified the moment something changes. No waiting on hold, no uncertainty, no chasing anyone down.
              </p>
              <p>
                We believe tenants deserve to know what's happening with their home. The portal makes that the default, not the exception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-navy">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-4">
            Need a Custom Solution?
          </h2>
          <p className="font-body text-cream/70 mb-8 max-w-lg mx-auto">
            We tailor our services to meet the unique needs of each property. Let's discuss how we can help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-10 py-4 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;

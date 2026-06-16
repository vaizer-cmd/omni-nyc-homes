import { useEffect } from "react";
import { Building2, Wrench, Users, Shield, Clock, BarChart3 } from "lucide-react";
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
      <section className="relative py-12 md:py-24 bg-navy">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">What We Do</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream max-w-2xl">
            Our Services
          </h1>
          <p className="font-body text-cream/70 mt-4 max-w-xl">
            Delivering AAA-level property management services with expertise in the most complex building systems.
          </p>
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

      {/* CTA */}
      <section className="py-20 bg-navy">
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

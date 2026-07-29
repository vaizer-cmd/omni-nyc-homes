import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, ShieldCheck, AlertTriangle, Sparkles, Users, MonitorSmartphone, Plus, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import heroImage from "@/assets/omni_backgound.png";

const highlights = [
  {
    icon: Wrench,
    title: "Daily Building Maintenance",
    description: "Our on-the-ground team handles day-to-day upkeep and repairs — catching issues early before they become costly problems.",
  },
  {
    icon: ShieldCheck,
    title: "Preventive Care & NYC Code Compliance",
    description: "Scheduled inspections and system maintenance aligned with New York City building code, keeping your property fully compliant year-round.",
  },
  {
    icon: AlertTriangle,
    title: "Violation Remediation",
    description: "We identify, address, and close open violations with the city — fast, thorough, and fully documented.",
  },
  {
    icon: Sparkles,
    title: "Cleaning Services",
    description: "Professional, recurring cleaning of common areas, lobbies, and basements. A clean building reflects an owner who cares.",
  },
  {
    icon: Users,
    title: "Tenant Management",
    description: "From rent collection and lease renewals to day-to-day communication and complaint handling — we're the face of your building.",
  },
  {
    icon: MonitorSmartphone,
    title: "Online Tenant Portal",
    description: "Tenants can submit requests, track progress in real time, and get updates without having to chase anyone down. Every request is logged, assigned, and followed through to completion — and tenants always know where things stand.",
  },
  {
    icon: Plus,
    title: "And More",
    description: "24/7 emergency response, vendor coordination, owner reporting, and everything in between.",
  },
];

const Index = () => {
  const highlightsRef = useRef<HTMLDivElement>(null);
  const [highlightsInView, setHighlightsInView] = useState(false);

  useEffect(() => {
    if (!highlightsRef.current || highlightsInView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHighlightsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(highlightsRef.current);
    return () => observer.disconnect();
  }, [highlightsInView]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-stretch md:items-start pt-8 md:pt-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="New York City skyline at dusk" className="w-full h-full object-cover md:object-right lg:object-center animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/[0.40] via-navy/[0.40] to-navy/[0.40]" />
        </div>
        <div className="relative container mx-auto px-4 md:px-6 flex flex-col w-full md:block">
          <div className="max-w-2xl md:max-w-4xl flex flex-col flex-1 md:block">
            <h1 className="font-display text-3xl md:text-6xl font-bold text-cream leading-tight mt-28 md:mt-12 mb-6 text-center md:text-left animate-fade-in-up [animation-fill-mode:both] [animation-delay:100ms] [text-shadow:_0_2px_12px_rgb(0_0_0_/_0.65)]">
              Your Building,
              <br />
              <span className="text-gold">Perfectly Managed.</span>
              <br />
              Your Tenants,
              <br />
              <span className="text-gold">always in the Loop.</span>
            </h1>
            <p className="font-body text-base md:text-lg text-cream leading-relaxed mt-2 md:mt-4 mb-8 max-w-2xl mx-auto md:mx-0 text-center md:text-left animate-fade-in-up [animation-fill-mode:both] [animation-delay:300ms] [text-shadow:_0_1px_8px_rgb(0_0_0_/_0.7)]">
              OMNI Management handles the day-to-day operations of your building — maintenance, compliance, violations, cleaning, and more — while giving every tenant direct access to our team through an online portal. Requests submitted, tracked, and resolved. No calls falling through the cracks.
            </p>
            <div className="flex flex-nowrap gap-3 md:gap-4 justify-center md:justify-start mt-auto md:mt-0 pb-8 md:pb-0 animate-fade-in-up [animation-fill-mode:both] [animation-delay:500ms]">
              <Link
                to="/contact"
                className="order-1 inline-flex items-center gap-2 bg-gold text-accent-foreground px-5 md:px-8 py-3 font-body font-semibold text-sm tracking-wide shadow-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="order-2 inline-flex items-center gap-2 border border-cream/60 bg-navy/30 backdrop-blur-sm text-cream px-5 md:px-8 py-3 font-body font-semibold text-sm tracking-wide hover:border-gold hover:text-gold transition-colors whitespace-nowrap"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Highlights */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Why Choose Us</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Built on Trust, Driven by Excellence.
            </h2>
          </div>
          <div ref={highlightsRef} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item, i) => (
              <div
                key={item.title}
                className={`bg-card p-8 shadow-card hover:shadow-elevated border border-border transition-all duration-300 hover:-translate-y-1 ${
                  highlightsInView
                    ? "animate-fade-in-up [animation-fill-mode:backwards]"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <item.icon size={36} className="text-gold shrink-0" />
                  <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="font-body text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body font-bold text-xl text-cream mb-4 max-w-2xl mx-auto">
            Whether you manage one building or twenty, OMNI takes the heavy lifting off your plate — and gives your tenants the responsiveness they expect.
          </p>
          <p className="font-body text-cream/70 mb-8 max-w-2xl mx-auto">
            <strong className="font-bold text-cream">Owners</strong> get a team that shows up and gets things done.
            <br />
            <strong className="font-bold text-cream">Tenants</strong> get a portal to submit requests, track progress, and get real answers.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-10 py-4 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Let's Talk <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

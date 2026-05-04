import { Link } from "react-router-dom";
import { Building2, Shield, Users, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import heroImage from "@/assets/hero-nyc.jpg";
import { useThemedPath } from "@/hooks/use-themed-path";

const highlights = [
  {
    icon: Building2,
    title: "Full-Service Management",
    description: "Comprehensive property management for residential and commercial buildings of any complexity.",
  },
  {
    icon: Shield,
    title: "AAA Service Standard",
    description: "We hold ourselves to the highest standards of maintenance, responsiveness, and professionalism.",
  },
  {
    icon: Users,
    title: "Decades of Expertise",
    description: "Our team of seasoned real estate professionals brings unmatched industry knowledge.",
  },
];

const Index = () => {
  const { themed } = useThemedPath();
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="New York City skyline at dusk" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/[0.40] via-navy/[0.40] to-navy/[0.40]" />
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-2xl md:max-w-4xl animate-fade-in-up">
<h1 className="font-display text-4xl md:text-6xl font-bold text-cream leading-tight mb-6">
              Elevating the Standard
              <br />
              of <span className="text-gold whitespace-nowrap">Property Management</span>
            </h1>
            <p className="font-body text-lg text-cream/80 leading-relaxed mb-8 max-w-xl">
              OMNI Management delivers exceptional building management and maintenance services across all five boroughs of New York City.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={themed("/about")}
                className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-8 py-3 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
              >
                Learn More <ArrowRight size={16} />
              </Link>
              <Link
                to={themed("/contact")}
                className="inline-flex items-center gap-2 border border-cream/30 text-cream px-8 py-3 font-body font-semibold text-sm tracking-wide hover:border-gold hover:text-gold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Highlights */}
      <section className="bg-cream py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Why Choose Us</span>
              <div className="h-px w-12 bg-gold" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Built on Trust, Driven by Excellence.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="bg-card p-8 shadow-card hover:shadow-elevated transition-shadow duration-300 border border-border"
              >
                <item.icon size={36} className="text-gold mb-5" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
            Ready to Experience Premium Management?
          </h2>
          <p className="font-body text-cream/70 mb-8 max-w-lg mx-auto">
            Partner with a team that treats every property as if it were their own.
          </p>
          <Link
            to={themed("/contact")}
            className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-10 py-4 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Get in Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

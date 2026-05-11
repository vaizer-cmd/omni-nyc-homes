import { Link } from "react-router-dom";
import { Building2, Shield, Users, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import heroImage from "@/assets/hero-nyc.jpeg";
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
  const { themed, isStaging } = useThemedPath();
  return (
    <Layout>
      {/* Hero */}
      <section className={`relative h-[85vh] min-h-[600px] flex md:pt-24 overflow-hidden ${isStaging ? "pt-8 items-stretch md:items-start" : "pt-16 items-start"}`}>
        <div className="absolute inset-0">
          <img src={heroImage} alt="New York City skyline at dusk" className={`w-full h-full object-cover md:object-right lg:object-center ${isStaging ? "animate-slow-zoom" : ""}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/[0.40] via-navy/[0.40] to-navy/[0.40]" />
        </div>
        <div className={`relative container mx-auto px-6 ${isStaging ? "flex flex-col w-full md:block" : ""}`}>
          <div className={`max-w-2xl md:max-w-4xl ${isStaging ? "flex flex-col flex-1 md:block" : "animate-fade-in-up"}`}>
<h1 className={`font-display text-3xl md:text-6xl font-bold text-cream leading-tight mt-6 md:mt-10 mb-6 [text-shadow:_0_2px_12px_rgb(0_0_0_/_0.65)] ${isStaging ? "text-center md:text-left animate-fade-in-up [animation-fill-mode:both] [animation-delay:100ms]" : ""}`}>
              Elevating the Standard
              <br />
              of <span className="text-gold md:whitespace-nowrap">Property Management</span>
            </h1>
            <p className={`font-body text-base md:text-lg text-cream leading-relaxed mb-8 max-w-xl [text-shadow:_0_1px_8px_rgb(0_0_0_/_0.7)] ${isStaging ? "text-center md:text-left mx-auto md:mx-0 animate-fade-in-up [animation-fill-mode:both] [animation-delay:300ms]" : ""}`}>
              OMNI Management delivers exceptional building management and maintenance services across all five boroughs of New York City.
            </p>
            <div className={`flex flex-wrap gap-4 ${isStaging ? "justify-center md:justify-start mt-auto md:mt-0 pb-8 md:pb-0 animate-fade-in-up [animation-fill-mode:both] [animation-delay:500ms]" : ""}`}>
              <Link
                to={themed("/about")}
                className={`inline-flex items-center gap-2 px-8 py-3 font-body font-semibold text-sm tracking-wide ${
                  isStaging
                    ? "order-2 border border-cream/60 bg-navy/30 backdrop-blur-sm text-cream hover:border-gold hover:text-gold transition-colors"
                    : "bg-gold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
                }`}
              >
                Learn More <ArrowRight size={16} />
              </Link>
              <Link
                to={themed("/contact")}
                className={`inline-flex items-center gap-2 px-8 py-3 font-body font-semibold text-sm tracking-wide ${
                  isStaging
                    ? "order-1 bg-gold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
                    : "border border-cream/60 bg-navy/30 backdrop-blur-sm text-cream hover:border-gold hover:text-gold transition-colors"
                }`}
              >
                Contact Us {isStaging && <ArrowRight size={16} />}
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

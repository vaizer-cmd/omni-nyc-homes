import { CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import aboutImage from "@/assets/about-building.jpg";

const values = [
  { title: "Integrity", desc: "Transparent operations and honest communication with every stakeholder." },
  { title: "Excellence", desc: "AAA-level service in every aspect of building management and maintenance." },
  { title: "Responsiveness", desc: "24/7 availability and rapid response to tenant and owner needs." },
  { title: "Innovation", desc: "Leveraging modern technology for efficient property operations." },
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

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-navy">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Our Story</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream max-w-2xl">
            Decades of Real Estate Excellence
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Founded by Industry Veterans
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  OMNI Property Management LLC was established by a group of highly experienced real estate professionals with over 20 years of combined expertise in the New York City market. Our founders recognized a critical gap: the need for truly premium, detail-oriented property management that treats every building—and every tenant—with the highest level of care.
                </p>
                <p>
                  Our mission is clear: to deliver an exceptional living and working experience for every tenant in every building we manage. We specialize in the maintenance and operation of complex residential and commercial building systems, from state-of-the-art HVAC to intricate fire safety networks.
                </p>
                <p>
                  Operating across all five boroughs of New York City, we bring the same unwavering commitment to quality whether managing a boutique residential building in Brooklyn Heights or a commercial high-rise in Midtown Manhattan.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={aboutImage}
                alt="Luxury building lobby managed by OMNI"
                className="w-full h-[500px] object-cover shadow-elevated"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Our Values</span>
              <div className="h-px w-12 bg-gold" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What Drives Us Every Day
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border p-6 shadow-card">
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-4">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Expertise */}
      <section className="py-20 bg-navy">
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
    </Layout>
  );
};

export default About;

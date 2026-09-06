import Layout from "@/components/Layout";
import aboutImage from "@/assets/about-building.jpg";

const values = [
  { title: "Reliability", desc: "When you call, we answer. When something needs to be fixed, we're there — not tomorrow, not after a follow-up, now." },
  { title: "Professionalism", desc: "Every job, every visit, every interaction is handled with care and accountability. We represent your building, and we take that seriously." },
  { title: "Responsiveness", desc: "We're available 24/7 for emergencies — and for everything else, tenants don't need to make a single phone call. Through our online portal, they can submit requests, get status updates, and communicate directly with our team at any time. Fast answers, full transparency, no runaround." },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-6 md:py-12 bg-navy">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Our Story</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-10 md:py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Founded by Industry Veterans
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  OMNI Management was built by people who know New York City real estate from the ground up, with more than 20 years of hands-on experience managing residential and commercial properties across all five boroughs.
                </p>
                <p>
                  We started OMNI because we saw the same problem again and again: owners and tenants waiting too long for answers, service, and resolution. When a boiler fails at midnight, a pipe bursts on a Sunday, or a violation needs immediate attention, you need a team that responds and takes ownership.
                </p>
                <p>
                  We're real people who know your building, know your tenants, and stay accountable from the moment an issue is reported until it's resolved. That's how property management should work.
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
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Our Values</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What You Can Count On
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border p-6 shadow-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;

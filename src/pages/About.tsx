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
      <section className="relative py-12 md:py-24 bg-navy">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Our Story</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream max-w-3xl">
            We Answer the Phone. We Show Up. We Get It Done.
          </h1>
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
                  OMNI Management was built by people who know New York City real estate from the ground up — with over 20 years of hands-on experience managing residential and commercial buildings across all five boroughs.
                </p>
                <p>
                  We started this company because we kept seeing the same problem: building owners and tenants couldn't get a straight answer, couldn't get someone on-site, and couldn't get their issues resolved without chasing people down for days. That's not how it should work.
                </p>
                <p>
                  When something goes wrong in your building — a boiler fails at midnight, a pipe bursts on a Sunday, a violation needs to be closed before an inspection — you need a team that picks up the phone and shows up ready to work. That's exactly what we do.
                </p>
                <p>
                  We're not a call center. We're not a ticketing system. We're real people who know your building, know your tenants, and take ownership of every problem until it's solved.
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

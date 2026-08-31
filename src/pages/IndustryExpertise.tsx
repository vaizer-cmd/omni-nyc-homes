import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const commercialPillars = [
  "Through our resident portal and responsive management approach, we help create well-maintained buildings and a better living experience for residents.",
  "For owners, our proactive management and disciplined cost control help eliminate unnecessary expenses, protect property value, and keep assets operating efficiently and profitably.",
];

const shelterPillars = [
  {
    title: "Experience on the Ground",
    desc: "OMNI has years of experience working with shelters and with the nonprofit organizations that run them. Our people know how to work alongside professional staff, under daily pressure, in an environment that can be complex. They do it with a big heart and a real understanding of the space they're working in.",
  },
  {
    title: "Hand in Hand with Program Staff",
    desc: "We work day to day with nonprofit leadership and program directors. Every issue is different, and so is the response it calls for. We're there with the program team to make sure clients get the full support they need.",
  },
  {
    title: "Understanding the Bigger Picture",
    desc: "We operate under demanding conditions with a working knowledge of the whole system. We know how the City and the operating organizations work, and what each side needs.",
  },
  {
    title: "Maintenance That Doesn't Wait for an Inspection",
    desc: "OMNI doesn't wait for a Callahan (right-to-shelter court standards) or Coalition for the Homeless inspection to maintain the building. We work every day, year-round, to OTDA (NYS Office of Temporary and Disability Assistance), Callahan, and CFH standards. The shelter stays clean, well maintained, and a decent place for clients to live and be supported.",
  },
];

const IndustryExpertise = () => {
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
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Industry Expertise</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream max-w-2xl">
            Built for Every Kind of Property
          </h1>
          <p className="font-body text-cream/70 mt-4 max-w-xl">
            From residential and commercial buildings to shelters operated with nonprofit partners, we bring the same discipline and accountability to every property we manage.
          </p>
        </div>
      </section>

      {/* Commercial & Residential */}
      <section id="commercial-and-residential" className="py-10 md:py-20 bg-cream scroll-mt-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Your Building, Perfectly Managed.</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Buildings That Run Right. Tenants Who Stay.
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              OMNI manages rental buildings, co-ops and condos, mixed-use properties, and office and retail spaces across the five boroughs. We take care of the day-to-day operations — maintenance, preventive care, compliance, cleaning, and vendors, to tenant communication, so landlords can focus on their investment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {commercialPillars.map((text) => (
              <div key={text} className="bg-card border-l-4 border-gold p-6 shadow-card">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-navy p-8 md:p-10">
            <h3 className="font-display text-2xl font-bold text-cream mb-4">
              Compliance &amp; Cost Protection
            </h3>
            <p className="font-body text-cream/70 leading-relaxed mb-8">
              We help landlords keep their buildings safe, compliant, and up to code, proactively addressing issues before they become costly violations. Our approach helps owners avoid unnecessary ECB, DOB, and FDNY violations and fines, potentially saving thousands of dollars while protecting the value of their property.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-8 py-3 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              Schedule a Walkthrough <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Shelters */}
      <section id="shelters" className="py-10 md:py-20 bg-background scroll-mt-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Your Building, Perfectly Managed.</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              An Experienced Partner to Shelters and Their Providers
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              OMNI is an experienced partner to shelters and the nonprofit providers that operate them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {shelterPillars.map((p) => (
              <div key={p.title} className="bg-card border border-border p-6 shadow-card">
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-10 py-4 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              Talk to Our Team <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IndustryExpertise;

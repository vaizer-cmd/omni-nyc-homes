import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import logoMocs from "@/assets/logo-mocs.png";
import logoAcco from "@/assets/logo-acco.png";
import logoNycDhs from "@/assets/logo-nyc-dhs.png";
import logoNycDss from "@/assets/logo-nyc-dss.png";
import logoDhsDss from "@/assets/logo-dhs-dss.png";
import logoPassport from "@/assets/logo-passport.png";
import logoCrf from "@/assets/logo-childrens-rescue-fund.png";
import logoNbd from "@/assets/logo-new-brooklyn-development.png";

const commercialPillars = [
  "Through our resident portal and responsive management approach, we help create well-maintained buildings and a better living experience for residents.",
  "For owners, our proactive management and disciplined cost control help eliminate unnecessary expenses, protect property value, and keep assets operating efficiently and profitably.",
];

const partnerLogos = [
  { src: logoMocs, alt: "NYC Mayor's Office of Contract Services" },
  { src: logoAcco, alt: "Agency Chief Contracting Officer (ACCO)" },
  { src: logoNycDhs, alt: "NYC Department of Homeless Services" },
  { src: logoNycDss, alt: "NYC Department of Social Services" },
  { src: logoDhsDss, alt: "NYC Department of Homeless Services & Department of Social Services" },
  { src: logoPassport, alt: "PASSPort - City of New York" },
  { src: logoCrf, alt: "Children's Rescue Fund" },
  { src: logoNbd, alt: "New Brooklyn Development" },
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
          <div className="flex items-center gap-3">
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Industry Expertise</span>
          </div>
        </div>
      </section>

      {/* Shelters / Nonprofit Organizations */}
      <section id="shelters" className="py-10 md:py-20 bg-background scroll-mt-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Your Building, Perfectly Managed.</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Approved New York City Mayor Office Vendor
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              OMNI is an approved vendor supporting Mayor's Office contracts and agencies including DHS, DSS, and ACCO, with an understanding of the unique demands of shelter and nonprofit environments.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mt-4">
              OMNI provides the operational backbone that keeps facilities safe, clean, compliant, and fully functional, allowing program staff to focus on their mission and the people they serve.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-10 py-4 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              Talk to Our Team <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-16 pt-12 border-t border-border">
            <p className="text-center font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8">
              Approved Vendor & Trusted Partner
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {partnerLogos.map((logo) => (
                <div
                  key={logo.alt}
                  className="flex items-center justify-center h-24 p-4 bg-card border border-border shadow-card"
                >
                  <img src={logo.src} alt={logo.alt} className="max-h-14 max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
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
              Commercial &amp; Residential
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
    </Layout>
  );
};

export default IndustryExpertise;

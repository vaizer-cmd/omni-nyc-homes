import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const privacyPolicy = `Privacy Policy

Effective Date: 01/01/2026

OMNI Property Management LLC ("Company", "we", "our", or "us") respects your privacy and is committed to protecting it through this Privacy Policy.

This Privacy Policy describes how we collect, use, and protect your information when you visit our website.

1. Information We Collect

We may collect the following types of information:

• Personal information such as name, email address, phone number, and any information you submit through contact forms.
• Technical information such as IP address, browser type, device information, and website usage data.
• Cookies and similar tracking technologies used to improve user experience.

2. How We Use Your Information

We may use the information we collect for the following purposes:

• To respond to inquiries or service requests
• To provide property management services
• To improve our website and services
• To communicate important updates or information
• To comply with legal obligations

3. Sharing of Information

We do not sell, trade, or rent your personal information. We may share information with trusted service providers who assist in operating our website or conducting our business, provided they agree to keep the information confidential.

4. Cookies

Our website may use cookies to enhance user experience and analyze website traffic. Users may choose to disable cookies through their browser settings.

5. Data Security

We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.

6. Third-Party Links

Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites.

7. Changes to This Policy

We reserve the right to update this Privacy Policy at any time. Updates will be posted on this page with a revised effective date.

8. Contact Us

If you have any questions regarding this Privacy Policy, please contact us:

OMNI Property Management LLC
Email: info@omnipropm.com`;

const termsOfUse = `Terms of Use

By accessing and using this website, you agree to comply with and be bound by the following Terms of Use.

1. Use of Website

This website is provided for informational purposes related to the services offered by OMNI Property Management LLC. You agree to use the website only for lawful purposes.

2. Intellectual Property

All content on this website, including text, graphics, logos, and images, is the property of OMNI Property Management LLC unless otherwise stated and is protected by applicable copyright laws.

3. Disclaimer

The information provided on this website is for general informational purposes only and does not constitute professional or legal advice.

4. Limitation of Liability

OMNI Property Management LLC shall not be liable for any damages resulting from the use or inability to use this website.

5. Third-Party Links

This website may contain links to third-party websites. We are not responsible for the content or practices of those websites.

6. Modifications

We reserve the right to modify these Terms of Use at any time. Continued use of the website constitutes acceptance of the updated terms.

7. Governing Law

These Terms shall be governed by and interpreted in accordance with the laws of the United States and the applicable state jurisdiction.

8. Contact Information

OMNI Property Management LLC
Email: info@omnipropm.com`;

const LegalModal = ({ title, content, onClose }: { title: string; content: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={onClose}>
    <div
      className="bg-cream max-w-2xl w-full mx-4 max-h-[80vh] rounded shadow-elevated flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="px-6 py-4 overflow-y-auto">
        <pre className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  </div>
);

const Footer = () => {
  const [modal, setModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <>
      <footer className="bg-navy text-cream/80">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-display text-2xl font-bold text-cream mb-2">OMNI</h3>
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Management</p>
              <p className="text-sm leading-relaxed text-cream/60">
                Excellence in property management across all five boroughs of New York City.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-sm font-semibold text-gold uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Home", to: "/" },
                  { label: "About", to: "/about" },
                  { label: "Services", to: "/services" },
                  { label: "Industry Expertise", to: "/industry-expertise" },
                  { label: "Contact", to: "/contact" },
                  { label: "Tenant Login", to: "https://omni-management-81ded.web.app", external: true },
                ].map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-cream/60 hover:text-gold transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="block text-sm text-cream/60 hover:text-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Industry Expertise */}
            <div>
              <Link to="/industry-expertise" className="font-display text-sm font-semibold text-gold uppercase tracking-wider mb-4 block hover:text-gold/80 transition-colors">
                Industry Expertise
              </Link>
              <div className="space-y-2 text-sm text-cream/60">
                {[
                  { label: "Commercial & Residential", hash: "commercial-and-residential" },
                  { label: "Shelters", hash: "shelters" },
                ].map((item) => (
                  <Link
                    key={item.hash}
                    to={`/industry-expertise#${item.hash}`}
                    className="block hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <Link to="/services" className="font-display text-sm font-semibold text-gold uppercase tracking-wider mb-4 block hover:text-gold/80 transition-colors">
                Services
              </Link>
              <div className="space-y-2 text-sm text-cream/60">
                {[
                  { label: "Property Management", hash: "property-management" },
                  { label: "Building Maintenance", hash: "building-maintenance" },
                  { label: "Tenant Relations", hash: "tenant-relations" },
                  { label: "Compliance & Safety", hash: "compliance-safety" },
                  { label: "24/7 Emergency Response", hash: "emergency-response" },
                  { label: "Financial Management", hash: "financial-management" },
                ].map((item) => (
                  <Link
                    key={item.hash}
                    to={`/services#${item.hash}`}
                    className="block hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-cream/40">
              © {new Date().getFullYear()} OMNI Property Management LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModal("privacy")}
                className="text-xs text-cream/40 hover:text-gold transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-xs text-cream/20">·</span>
              <button
                onClick={() => setModal("terms")}
                className="text-xs text-cream/40 hover:text-gold transition-colors"
              >
                Terms of Use
              </button>
            </div>
          </div>
        </div>
      </footer>

      {modal === "privacy" && (
        <LegalModal title="Privacy Policy" content={privacyPolicy} onClose={() => setModal(null)} />
      )}
      {modal === "terms" && (
        <LegalModal title="Terms of Use" content={termsOfUse} onClose={() => setModal(null)} />
      )}
    </>
  );
};

export default Footer;

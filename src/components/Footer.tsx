import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-cream/80">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-cream mb-2">OMNI</h3>
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Property Management</p>
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
              {["About", "Services", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block text-sm text-cream/60 hover:text-gold transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Services
            </h4>
            <div className="space-y-2 text-sm text-cream/60">
              <p>Residential Management</p>
              <p>Commercial Management</p>
              <p>Building Maintenance</p>
              <p>Tenant Relations</p>
            </div>
          </div>

        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Omni Property Management LLC. All rights reserved.
          </p>
          <p className="text-xs text-cream/40">
            Licensed Property Management · New York City
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

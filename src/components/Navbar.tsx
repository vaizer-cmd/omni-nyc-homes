import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/omni_logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
  { label: "Tenant Login", path: "https://omni-management-81ded.web.app", external: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b bg-white/95 border-navy/10">
      <div className="container mx-auto px-6 flex items-center justify-between py-2">
        <Link to="/" className="flex flex-col">
          <img src={logo} alt="OMNI" className="h-16 md:h-20 w-auto" />
        </Link>

        {/* Tagline */}
        <span className="font-display italic font-bold tracking-wide text-gold block text-[11px] text-center px-2 md:text-sm md:px-0">
          Built on Trust, Driven by Excellence.
        </span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gold text-accent-foreground font-body font-semibold tracking-wide text-base px-5 py-2 shadow-sm hover:opacity-90 transition-opacity"
                >
                  {link.label}
                </a>
              );
            }
            const to = link.path;
            const isActive = location.pathname === to;
            return (
              <Link
                key={link.path}
                to={to}
                className={`relative font-body font-medium tracking-wide text-xl transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-gold after:transition-all after:duration-300 ${
                  isActive
                    ? "text-gold after:w-full"
                    : "text-navy/80 hover:text-gold after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-navy"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="bg-white border-t border-navy/10 px-6 py-4 space-y-3">
          {navLinks.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center bg-gold text-accent-foreground font-body font-semibold tracking-wide text-base px-5 py-2 mt-1 shadow-sm hover:opacity-90 transition-opacity"
                >
                  {link.label}
                </a>
              );
            }
            const to = link.path;
            return (
              <Link
                key={link.path}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`block font-body font-medium tracking-wide py-2 text-xl ${
                  location.pathname === to ? "text-gold" : "text-navy/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

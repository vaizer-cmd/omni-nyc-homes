import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useThemedPath } from "@/hooks/use-themed-path";
import stagingLogo from "@/assets/omni_logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { themed } = useThemedPath();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b bg-white/95 border-navy/10">
      <div className="container mx-auto px-6 flex items-center justify-between py-2">
        <Link to={themed("/")} className="flex flex-col">
          <img src={stagingLogo} alt="OMNI" className="h-14 md:h-16 w-auto" />
        </Link>

        {/* Tagline */}
        <span className="font-display italic font-bold tracking-wide text-gold block text-[11px] text-center px-2 md:text-sm md:px-0">
          Built on Trust, Driven by Excellence.
        </span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const to = themed(link.path);
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
            const to = themed(link.path);
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

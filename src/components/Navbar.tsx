import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useThemedPath } from "@/hooks/use-themed-path";
import stagingLogo from "@/assets/logo-staging.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { themed, isStaging } = useThemedPath();

  const navBgClass = isStaging
    ? "bg-white/95 border-navy/10"
    : "bg-navy/95 border-gold/20";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${navBgClass}`}
    >
      <div
        className={`container mx-auto px-6 flex items-center justify-between ${
          isStaging ? "py-2" : "py-4"
        }`}
      >
        <Link to={themed("/")} className="flex flex-col">
          {isStaging ? (
            <img src={stagingLogo} alt="OMNI" className="h-14 md:h-16 w-auto" />
          ) : (
            <>
              <span className="font-display text-3xl font-bold tracking-wider text-cream">
                OMNI
              </span>
              <span className="text-xs tracking-[0.3em] text-gold uppercase font-body">
                Property Management
              </span>
            </>
          )}
        </Link>

        {/* Tagline */}
        <span
          className={`font-display italic font-bold tracking-wide text-gold ${
            isStaging
              ? "block text-[11px] text-center px-2 md:text-sm md:px-0"
              : "hidden md:block text-sm"
          }`}
        >
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
                className={`font-body font-medium tracking-wide transition-colors duration-200 ${
                  isStaging
                    ? `relative text-xl after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-gold after:transition-all after:duration-300 ${
                        isActive
                          ? "text-gold after:w-full"
                          : "text-navy/80 hover:text-gold after:w-0 hover:after:w-full"
                      }`
                    : `text-sm ${isActive ? "text-gold" : "text-cream/80 hover:text-gold"}`
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
          className={`md:hidden ${isStaging ? "text-navy" : "text-cream"}`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile tagline (default site only — staging shows it inline above) */}
      {!isStaging && (
        <div className="md:hidden border-t border-gold/20 px-6 py-2 flex justify-center">
          <span className="font-display text-xs italic font-bold tracking-wide text-gold">
            Built on Trust, Driven by Excellence.
          </span>
        </div>
      )}

      {/* Mobile menu */}
      {isStaging ? (
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
      ) : (
        isOpen && (
          <div className="md:hidden bg-navy border-t border-gold/20 px-6 py-4 space-y-3">
            {navLinks.map((link) => {
              const to = themed(link.path);
              return (
                <Link
                  key={link.path}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={`block font-body font-medium tracking-wide py-2 text-sm ${
                    location.pathname === to ? "text-gold" : "text-cream/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )
      )}
    </nav>
  );
};

export default Navbar;

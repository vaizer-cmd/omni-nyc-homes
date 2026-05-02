import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useThemedPath } from "@/hooks/use-themed-path";
import { useStagingTheme } from "@/components/ThemeProvider";
import stagingLogo from "@/assets/logo-staging.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const PaletteSelect = ({ className = "" }: { className?: string }) => {
  const { palettes, paletteId, setPaletteId } = useStagingTheme();
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs uppercase tracking-[0.2em] text-gold font-body">
        Palette
      </span>
      <select
        value={paletteId}
        onChange={(e) => setPaletteId(e.target.value)}
        className="bg-white text-navy border border-navy/30 rounded px-2 py-1 text-sm font-body focus:outline-none focus:border-gold"
      >
        {palettes.map((p) => (
          <option key={p.id} value={p.id} className="bg-white text-navy">
            {p.label}
          </option>
        ))}
      </select>
    </label>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { themed } = useThemedPath();
  const { isStaging } = useStagingTheme();

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
            <img src={stagingLogo} alt="OMNI" className="h-20 w-auto" />
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

        {/* Tagline / palette select - desktop */}
        {isStaging ? (
          <PaletteSelect className="hidden md:flex" />
        ) : (
          <span className="hidden md:block font-display text-sm italic font-bold tracking-wide text-gold">
            Built on Trust, Driven by Excellence.
          </span>
        )}

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const to = themed(link.path);
            return (
              <Link
                key={link.path}
                to={to}
                className={`font-body font-medium tracking-wide transition-colors duration-200 ${
                  isStaging ? "text-xl" : "text-sm"
                } ${
                  location.pathname === to
                    ? "text-gold"
                    : isStaging
                      ? "text-navy/80 hover:text-gold"
                      : "text-cream/80 hover:text-gold"
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

      {/* Mobile tagline / palette select */}
      <div
        className={`md:hidden border-t px-6 py-2 flex justify-center ${
          isStaging ? "border-navy/10" : "border-gold/20"
        }`}
      >
        {isStaging ? (
          <PaletteSelect />
        ) : (
          <span className="font-display text-xs italic font-bold tracking-wide text-gold">
            Built on Trust, Driven by Excellence.
          </span>
        )}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className={`md:hidden border-t px-6 py-4 space-y-3 ${
            isStaging ? "bg-white border-navy/10" : "bg-navy border-gold/20"
          }`}
        >
          {navLinks.map((link) => {
            const to = themed(link.path);
            return (
              <Link
                key={link.path}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`block font-body font-medium tracking-wide py-2 ${
                  isStaging ? "text-xl" : "text-sm"
                } ${
                  location.pathname === to
                    ? "text-gold"
                    : isStaging
                      ? "text-navy/80"
                      : "text-cream/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

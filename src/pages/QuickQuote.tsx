import { useState } from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import logo from "@/assets/omni_logo.png";

const inputClasses =
  "w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors";
const labelClasses = "block font-body text-sm font-medium text-foreground mb-2";

const QuickQuote = () => {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/quickquote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", organization: "", phone: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-card border border-border border-t-4 border-t-gold shadow-elevated">
        <div className="px-8 pt-8 pb-6 text-center border-b border-border">
          <img src={logo} alt="OMNI Management" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground">Quick Quote</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Tell us how we can help and we'll get back to you shortly.
          </p>
        </div>

        {status === "success" ? (
          <div className="px-8 py-12 text-center">
            <CheckCircle2 size={44} className="text-gold mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Thank you!</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              We received your request and will be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            <div>
              <label htmlFor="qq-name" className={labelClasses}>Name</label>
              <input
                id="qq-name"
                type="text"
                autoComplete="name"
                maxLength={200}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="qq-org" className={labelClasses}>Organization</label>
              <input
                id="qq-org"
                type="text"
                autoComplete="organization"
                maxLength={200}
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="qq-phone" className={labelClasses}>Phone Number *</label>
              <input
                id="qq-phone"
                required
                type="tel"
                autoComplete="tel"
                maxLength={50}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClasses}
                placeholder="(212) 555-0000"
              />
            </div>
            <div>
              <label htmlFor="qq-email" className={labelClasses}>Email Address *</label>
              <input
                id="qq-email"
                required
                type="email"
                autoComplete="email"
                maxLength={200}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="qq-message" className={labelClasses}>How can we help you?</label>
              <textarea
                id="qq-message"
                rows={4}
                maxLength={5000}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${inputClasses} resize-none`}
              />
            </div>

            {status === "error" && (
              <p role="alert" className="font-body text-sm text-destructive">
                Something went wrong. Please try again, or call us at (212) 460-5000.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold text-accent-foreground py-4 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Request a Quote"}
            </button>
          </form>
        )}

        <div className="bg-navy px-8 py-4 flex items-center justify-center gap-2">
          <Phone size={14} className="text-gold" />
          <a href="tel:+12124605000" className="font-body text-sm text-cream/90 hover:text-gold transition-colors">
            (212) 460-5000
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuickQuote;

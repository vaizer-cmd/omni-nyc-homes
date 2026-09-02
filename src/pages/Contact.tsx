import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. We'll get back to you within 1-2 business days.",
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-6 md:py-12 bg-navy">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">Get in Touch</span>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Let's Start a Conversation
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Whether you're a property owner seeking management services or a tenant with an inquiry, we're here to help.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: MapPin, label: "Address", value: "224 W 35th St Ste 500, New York, NY 10001" },
                  { icon: Phone, label: "Phone", value: "(212) 460-5000" },
                  { icon: Mail, label: "Email", value: "info@omnipropm.com", href: "mailto:info@omnipropm.com" },
                  { icon: Clock, label: "Hours", value: "Mon-Fri: 8AM - 6PM" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <div className="font-body text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="font-body text-foreground font-medium hover:text-gold transition-colors">{item.value}</a>
                      ) : (
                        <div className="font-body text-foreground font-medium whitespace-pre-line">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card border border-border p-8 shadow-card space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-2">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="(212) 555-0000"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-2">Subject *</label>
                    <input
                      required
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="Property Management Inquiry"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us about your property management needs..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy text-cream py-4 font-body font-semibold text-sm tracking-wide hover:bg-navy-light transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <section className="py-32 bg-cream">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-display text-6xl font-bold text-navy mb-4">404</h1>
          <p className="font-body text-xl text-muted-foreground mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-navy text-cream px-8 py-3 font-body font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Return to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;

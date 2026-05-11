import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useThemedPath } from "@/hooks/use-themed-path";

const Layout = ({ children }: { children: ReactNode }) => {
  const { isStaging } = useThemedPath();

  useEffect(() => {
    const root = document.documentElement;
    if (isStaging) root.classList.add("staging");
    else root.classList.remove("staging");
  }, [isStaging]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${isStaging ? "pt-[72px] md:pt-[80px]" : "pt-[72px]"}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

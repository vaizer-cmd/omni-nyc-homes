import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MobileMenuProvider } from "@/contexts/MobileMenuContext";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-[80px] md:pt-[96px]">{children}</main>
        <Footer />
      </div>
    </MobileMenuProvider>
  );
};

export default Layout;

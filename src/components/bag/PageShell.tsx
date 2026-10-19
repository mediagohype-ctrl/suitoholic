import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";

/** Shared frame for the bag, checkout and order pages. */
export default function PageShell({
  eyebrow,
  title,
  showShowcase = true,
  children,
}: {
  eyebrow: string;
  title: string;
  showShowcase?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-hidden selection:bg-black selection:text-white">
      <Header />
      <main className="relative z-10 flex-1 w-full max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 sm:pt-44 lg:pt-48 pb-16">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-[#666666] uppercase">{eyebrow}</span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal uppercase tracking-tight mt-1 text-black">{title}</h1>
          <div className="w-16 h-[1px] bg-black/30 mx-auto mt-3" />
        </div>
        {children}
      </main>
      {showShowcase && <CommonAtelierShowcase />}
      <Footer />
    </div>
  );
}

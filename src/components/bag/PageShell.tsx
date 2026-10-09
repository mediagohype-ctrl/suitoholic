import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** Shared frame for the bag, checkout and order pages. */
export default function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      <Header />
      <main className="relative z-10 flex-1 w-full max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 sm:pt-44 lg:pt-48 pb-16">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-[#9E774C] uppercase">{eyebrow}</span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal uppercase tracking-tight mt-1">{title}</h1>
          <div className="w-16 h-[1.5px] bg-[#9E774C] mx-auto mt-3" />
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
}

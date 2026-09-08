"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Ruler, Scissors, Award } from "lucide-react";

export default function NewsletterSection() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setNewsletterEmail("");
    }
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-6 sm:my-8 lg:my-10 select-none">
      <div className="relative w-full bg-gradient-to-r from-[#EBE0D3] via-[#E2D2BF] to-[#D7C2AB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#CBB39C] shadow-[0_12px_35px_rgba(20,17,14,0.06)] overflow-hidden">
        
        {/* Background Subtle Watermark */}
        <div className="absolute -right-10 -bottom-10 pointer-events-none opacity-[0.04] select-none">
          <span className="font-serif-luxury text-[140px] font-black tracking-widest text-[#14110E] uppercase">
            ATELIER
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left: Newsletter Copy & Badge */}
          <div className="lg:col-span-6 space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#8C5A28] uppercase bg-[#8C5A28]/10 px-3 py-1 rounded-full border border-[#8C5A28]/20">
              <Sparkles size={12} className="text-[#8C5A28]" />
              <span>THE SARTORIAL PRIVILEGE CLUB • ESTD. 2003</span>
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#14110E] tracking-tight leading-tight uppercase">
              CRAFTED FOR THOSE WHO <br />
              <span className="italic font-light text-[#70481F]">COMMAND DISTINCTION.</span>
            </h3>

            <p className="text-xs sm:text-sm lg:text-[15px] text-[#4A3B2E] max-w-lg font-normal leading-relaxed">
              Subscribe to unlock private runway previews, rare Egyptian Giza fabric allocations, and invitations to private bespoke trunk shows.
            </p>
          </div>

          {/* Right: Compact Subscription Form & Key Badges */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center space-y-3.5">
            {subscribed ? (
              <div className="bg-[#2D6A4F]/15 border border-[#2D6A4F]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center space-x-3 text-[#1B4332] shadow-xs">
                <CheckCircle2 size={22} className="shrink-0 text-[#2D6A4F]" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  Welcome to the Atelier Circle. A private invitation has been dispatched to your inbox.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3 w-full max-w-xl lg:ml-auto">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full bg-white border border-[#C5B3A0] focus:border-[#14110E] focus:ring-2 focus:ring-[#14110E]/10 text-xs sm:text-sm lg:text-base px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-full text-[#14110E] placeholder:text-[#8C7A6B] focus:outline-hidden transition-all shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#14110E] hover:bg-[#8C5A28] text-white text-xs sm:text-sm font-bold tracking-[0.2em] px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full transition-all duration-300 uppercase shadow-md flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer group"
                >
                  <span>JOIN CLUB</span>
                  <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            {/* 4 Micro Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#CBB39C]/60 lg:ml-auto w-full max-w-xl">
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#30251C]">
                <Ruler size={14} className="text-[#8C5A28] shrink-0" />
                <span>40+ Data Points</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#30251C]">
                <Scissors size={14} className="text-[#8C5A28] shrink-0" />
                <span>Draped Canvas</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#30251C]">
                <ShieldCheck size={14} className="text-[#8C5A28] shrink-0" />
                <span>Fit Guarantee</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#30251C]">
                <Award size={14} className="text-[#8C5A28] shrink-0" />
                <span>Express Air</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form is only valid when email has been entered AND the checkbox is checked
  const isFormValid = email.trim().length > 0 && agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setAgreed(false);
      }, 5000);
    }
  };

  return (
    <section className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-14 xl:px-20 my-10 sm:my-14 lg:my-16 select-none">
      <div className="relative w-full bg-[#EDE4DB] rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 xl:p-20 border border-[#D6C5B5] shadow-[0_10px_30px_rgba(20,17,14,0.05)] overflow-hidden min-h-[240px] sm:min-h-[280px] lg:min-h-[320px] flex items-center">
        
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 py-2 sm:py-4">
          
          {/* Left Column: Title & Subtitle Information */}
          <div className="w-full lg:w-5/12 space-y-3 text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#3B222E] tracking-tight leading-tight">
              Join Our Newsletter
            </h3>
            <p className="text-sm sm:text-base text-[#523B47] leading-relaxed font-normal">
              Get exclusive fabric drops, craftsmanship journals &amp; members-only offers directly to your inbox. No spam.
            </p>
          </div>

          {/* Right Column: Form & Confirmation */}
          <div className="w-full lg:w-7/12 flex-1">
            {submitted ? (
              <div className="bg-[#2D6A4F]/15 border border-[#2D6A4F]/40 p-4 sm:p-5 rounded-xl flex items-center space-x-3 text-[#1B4332] shadow-xs">
                <CheckCircle2 size={22} className="shrink-0 text-[#2D6A4F]" />
                <span className="text-xs sm:text-sm font-semibold">
                  Thank you for subscribing! You are now subscribed to Suitoholic private drops and offers.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full space-y-3">
                
                {/* Input + Subscribe Button Row */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3 w-full">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address (e.g. name@example.com)"
                      required
                      className="w-full bg-white border border-[#C5B3A0] focus:border-[#3B222E] focus:ring-2 focus:ring-[#3B222E]/10 text-sm sm:text-base px-4 sm:px-5 py-3.5 rounded-xl text-[#2C1822] placeholder:text-[#917B87] focus:outline-hidden transition-all shadow-xs"
                    />
                  </div>
                  
                  {/* Subscribe Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`text-sm sm:text-base font-bold tracking-wide px-7 sm:px-9 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shrink-0 ${
                      isFormValid
                        ? "bg-[#14110E] hover:bg-black text-white shadow-md cursor-pointer group scale-100"
                        : "bg-[#14110E]/40 text-white/60 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <span>Subscribe</span>
                    <Send size={15} className={`transition-transform ${isFormValid ? "group-hover:translate-x-0.5 text-white" : "text-[#8C7684]"}`} />
                  </button>
                </div>

                {/* Checkbox Consent */}
                <label className="flex items-start space-x-2.5 cursor-pointer select-none group pt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 rounded-sm border-[#A38D99] text-[#4A2635] focus:ring-[#4A2635] accent-[#4A2635] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#4E3744] font-medium leading-relaxed">
                    I agree to receive marketing emails from Suitoholic. Read our{" "}
                    <Link href="/privacy" className="text-[#3B222E] font-semibold underline hover:text-[#8C5A28] transition-colors">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

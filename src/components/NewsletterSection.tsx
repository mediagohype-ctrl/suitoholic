"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";
import { apiFetch, ApiError } from "@/lib/api";

export default function NewsletterSection() {
  const c = useContent("newsletter");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form is only valid when email has been entered AND the checkbox is checked
  const isFormValid = email.trim().length > 0 && agreed && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/newsletter", {
        method: "POST",
        body: { email: email.trim(), source: "newsletter_section" },
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setAgreed(false);
      }, 5000);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.details?.[0]?.message || apiErr.message || c.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 my-12 sm:my-16 lg:my-20 select-none">
      <div className="relative w-full bg-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 lg:p-16 xl:p-20 border border-[#E5E3DD] shadow-sm overflow-hidden min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] flex items-center">

        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 py-3 sm:py-6">

          {/* Left Column: Title & Subtitle Information */}
          <div className="w-full lg:w-5/12 space-y-3.5 text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-bold text-black tracking-tight leading-tight">
              {c.heading}
            </h3>
            <p className="text-sm sm:text-base lg:text-[17px] text-[#666666] leading-relaxed font-normal">
              {c.subtitle}
            </p>
          </div>

          {/* Right Column: Form & Confirmation */}
          <div className="w-full lg:w-7/12 flex-1">
            {submitted ? (
              <div className="bg-black/5 border border-black/20 p-4 sm:p-5 rounded-[12px] flex items-center space-x-3 text-black shadow-xs">
                <CheckCircle2 size={22} className="shrink-0 text-black" />
                <span className="text-xs sm:text-sm font-semibold">
                  {c.successMessage}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full space-y-3.5">

                {/* Input + Subscribe Button Row */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3.5 w-full">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder={c.emailPlaceholder}
                      disabled={loading}
                      required
                      className="w-full bg-[#F5F4F0] border border-[#E5E3DD] focus:border-black focus:ring-2 focus:ring-black/10 text-sm sm:text-base px-6 py-4 rounded-full text-black placeholder:text-[#888888] focus:outline-hidden transition-all shadow-xs"
                    />
                  </div>

                  {/* Subscribe Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`text-sm sm:text-base font-bold tracking-wide px-8 sm:px-10 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shrink-0 ${
                      isFormValid
                        ? "bg-black hover:bg-neutral-800 text-white shadow-sm hover:shadow-md cursor-pointer group scale-100"
                        : "bg-black/40 text-white/60 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <span>{loading ? c.subscribingLabel : c.subscribeLabel}</span>
                    <Send size={16} className={`transition-transform ${isFormValid ? "group-hover:translate-x-0.5 text-white" : "text-white/40"}`} />
                  </button>
                </div>

                {/* Checkbox Consent */}
                <label className="flex items-start space-x-2.5 cursor-pointer select-none group pt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 rounded-sm border-[#E5E3DD] text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#666666] font-medium leading-relaxed">
                    {c.consentText}{" "}
                    <Link href={c.privacyHref || "/privacy"} className="text-black font-semibold underline hover:opacity-75 transition-opacity">
                      {c.privacyLinkLabel}
                    </Link>
                    .
                  </span>
                </label>

                {error && (
                  <p role="alert" className="text-xs sm:text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

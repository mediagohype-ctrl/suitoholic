"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import { apiFetch, ApiError } from "@/lib/api";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  HelpCircle,
  ExternalLink,
  User,
  Scissors,
  ShieldCheck,
  Headphones,
  ChevronDown,
  Globe2,
} from "lucide-react";

// Inquiry categories → inquiry type stored by the API (shown in Admin → Inquiries)
const INQUIRY_TYPES: Record<string, string> = {
  fitting: "fitting_appointment",
  custom: "custom_order",
  fabric: "swatch_request",
  order: "order_status",
};
const CONTACT_METHODS: Record<string, string> = {
  email: "Email",
  phone: "Phone call",
  whatsapp: "WhatsApp",
};

// =========================================================================
// FAQ Data for Bespoke Concierge
// =========================================================================

export default function ContactPage() {
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await apiFetch<{ ok: boolean; id: number }>("/inquiries", {
        method: "POST",
        body: {
          type: "fitting_appointment",
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: service ? `Commission Inquiry: ${service}` : "Private Bespoke Commission",
          message: [
            message.trim(),
            "",
            service ? `Service Requested: ${service}` : "",
            preferredDate ? `Preferred Appointment Date: ${preferredDate}` : "",
          ].filter(Boolean).join("\n"),
        },
      });
      // The reference matches the inquiry number in the admin dashboard.
      setTicketId(`SUI-${String(res.id).padStart(6, "0")}`);
      setSubmitted(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setSubmitError(apiErr.details?.[0]?.message || apiErr.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setService("");
    setPreferredDate("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#14110E] font-sans antialiased flex flex-col justify-between selection:bg-[#8C5A28] selection:text-white">
      
      {/* 1. Header Navigation with active 'contact' tab */}
      <Header activeTab="contact" />

      <main className="flex-1 pb-16 sm:pb-24">
        
        {/* ========================================================================= */}
        {/* 2. HERO HEADER BANNER: Sunlit Bespoke Atelier (Signature Light Palette)   */}
        {/* ========================================================================= */}
        <section className="relative w-full h-[100dvh] min-h-[640px] flex items-center justify-center text-center overflow-hidden border-b border-[#DDD2D8] select-none bg-[#FAF6F8]">
          {/* Background Tailoring Atelier Photo (Clearly visible, vibrant, sunlit salon) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/contact_hero_light.jpg"
            alt="Suitoholic Bespoke Sartorial Salon"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            loading="eager"
          />

          {/* Gentle Top Navbar Scrim for pristine header readability */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />

          {/* Soft Center Radial Glow to give text effortless readability without washing out the photo */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.1)_35%,transparent_58%)] pointer-events-none" />

          {/* Centered Content Container */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 flex flex-col items-center">
            
            {/* Eyebrow: GET IN TOUCH */}
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="w-8 sm:w-12 h-[1px] bg-[#4A202A]/70" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.28em] text-[#4A202A] uppercase font-sans">
                GET IN TOUCH
              </span>
              <span className="w-8 sm:w-12 h-[1px] bg-[#4A202A]/70" />
            </div>

            {/* Main Headline: Let's Create Your Perfect Fit */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-[70px] xl:text-[76px] font-normal leading-[1.08] tracking-tight text-[#14110E] mb-3 sm:mb-4 drop-shadow-[0_2px_14px_rgba(255,255,255,0.85)]">
              Let&apos;s Create Your <span className="text-[#4A202A] italic">Perfect Fit</span>
            </h1>

            {/* Sub-badge: WE'RE HERE TO HELP */}
            <div className="text-[11px] sm:text-xs font-mono tracking-[0.24em] text-[#4A202A] uppercase font-bold mb-3 sm:mb-4">
              WE&apos;RE HERE TO HELP
            </div>

            {/* Subtle Vertical Royal Burgundy Divider Line */}
            <div className="w-[1.5px] h-8 sm:h-10 bg-[#4A202A]/60 mb-5 sm:mb-6" />

            {/* Paragraph Description */}
            <p className="max-w-xl mx-auto text-sm sm:text-base md:text-[17px] text-[#221B16] font-sans leading-relaxed font-medium drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)]">
              Book a consultation, ask a question, or start your tailoring journey with our team today.
            </p>

          </div>

          {/* Subtle Scroll Down Prompt Indicator (Light Theme) */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[9px] font-mono tracking-[0.24em] text-[#4A202A] uppercase font-bold">SCROLL</span>
            <div className="w-4 h-7 rounded-full border border-[#4A202A]/60 flex items-start justify-center p-1 bg-white/90 shadow-sm">
              <div className="w-1 h-1.5 rounded-full bg-[#4A202A] animate-bounce" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. COMMISSION ENQUIRY & GET IN TOUCH (MATCHING USER REFERENCE DESIGN)     */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#FAF6F8] py-16 sm:py-24 border-b border-[#DDD2D8] text-[#14110E]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              
              {/* LEFT COLUMN: Commission Inquiry Form (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {submitted ? (
                  <div className="bg-white border border-[#DDD2D8] rounded-xl p-8 sm:p-12 text-center space-y-5 shadow-[0_12px_36px_rgba(74,32,42,0.06)] animate-fadeIn">
                    <div className="w-14 h-14 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto border border-[#2D6A4F]/25">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#9E774C]">
                        ENQUIRY TRANSMITTED
                      </span>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#14110E]">
                        Thank You, {fullName || "Esteemed Client"}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#55473A] leading-relaxed max-w-md mx-auto">
                        Your bespoke commission inquiry has been sent to our master tailors. We reply within one business day.
                      </p>
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#DDD2D8] p-3.5 rounded-lg inline-block text-xs text-[#14110E] font-mono">
                      Reference ID: <strong className="text-[#4A202A]">{ticketId}</strong>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="bg-[#4A202A] hover:bg-[#34141D] active:scale-[0.99] text-[#FAF8F5] text-xs font-extrabold uppercase tracking-[0.22em] px-8 py-3.5 rounded-[4px] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer inline-block"
                      >
                        SEND ANOTHER ENQUIRY
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#7A6B5D] font-bold block">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="James Whitfield"
                          className="w-full bg-[#FAF8F5] border border-[#DDD2D8] hover:border-[#9E774C]/60 focus:border-[#4A202A] focus:ring-1 focus:ring-[#4A202A] rounded-md px-4 py-3.5 text-xs sm:text-sm text-[#14110E] placeholder:text-[#9E8E81] transition-all outline-hidden shadow-2xs font-sans"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#7A6B5D] font-bold block">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="james@example.com"
                          className="w-full bg-[#FAF8F5] border border-[#DDD2D8] hover:border-[#9E774C]/60 focus:border-[#4A202A] focus:ring-1 focus:ring-[#4A202A] rounded-md px-4 py-3.5 text-xs sm:text-sm text-[#14110E] placeholder:text-[#9E8E81] transition-all outline-hidden shadow-2xs font-sans"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Service */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#7A6B5D] font-bold block">
                          PHONE
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+44 7000 000000"
                          className="w-full bg-[#FAF8F5] border border-[#DDD2D8] hover:border-[#9E774C]/60 focus:border-[#4A202A] focus:ring-1 focus:ring-[#4A202A] rounded-md px-4 py-3.5 text-xs sm:text-sm text-[#14110E] placeholder:text-[#9E8E81] transition-all outline-hidden shadow-2xs font-sans"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#7A6B5D] font-bold block">
                          SERVICE
                        </label>
                        <div className="relative">
                          <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#DDD2D8] hover:border-[#9E774C]/60 focus:border-[#4A202A] focus:ring-1 focus:ring-[#4A202A] rounded-md pl-4 pr-10 py-3.5 text-xs sm:text-sm text-[#14110E] transition-all outline-hidden shadow-2xs appearance-none font-sans cursor-pointer"
                          >
                            <option value="">Select a service...</option>
                            <option value="Bespoke Suits & Tuxedos">Bespoke Suits & Tuxedos</option>
                            <option value="Custom Tailored Dress Shirts">Custom Tailored Dress Shirts</option>
                            <option value="Sartorial Trousers & Gurkhas">Sartorial Trousers & Gurkhas</option>
                            <option value="Ceremonial & Evening Wear">Ceremonial & Evening Wear</option>
                            <option value="Private Studio Fitting Appointment">Private Studio Fitting Appointment</option>
                            <option value="Fabric Swatch Archive Request">Fabric Swatch Archive Request</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6B5D] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Preferred Date */}
                    <div className="space-y-2">
                      <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#7A6B5D] font-bold block">
                        PREFERRED DATE
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#DDD2D8] hover:border-[#9E774C]/60 focus:border-[#4A202A] focus:ring-1 focus:ring-[#4A202A] rounded-md px-4 py-3.5 text-xs sm:text-sm text-[#14110E] placeholder:text-[#9E8E81] transition-all outline-hidden shadow-2xs font-sans cursor-pointer scheme-light"
                      />
                    </div>

                    {/* Row 4: Your Commission */}
                    <div className="space-y-2">
                      <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#7A6B5D] font-bold block">
                        YOUR COMMISSION
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about the occasion, your preferences, or any questions you have..."
                        className="w-full bg-[#FAF8F5] border border-[#DDD2D8] hover:border-[#9E774C]/60 focus:border-[#4A202A] focus:ring-1 focus:ring-[#4A202A] rounded-md p-4 text-xs sm:text-sm text-[#14110E] placeholder:text-[#9E8E81] transition-all outline-hidden shadow-2xs resize-none font-sans"
                      />
                    </div>

                    {submitError && (
                      <p role="alert" className="text-xs sm:text-sm font-medium text-[#9B2C2C] bg-[#9B2C2C]/5 border border-[#9B2C2C]/20 rounded-md px-4 py-3">
                        {submitError}
                      </p>
                    )}

                    {/* Submit Button & Subtext */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#4A202A] hover:bg-[#34141D] active:scale-[0.99] text-[#FAF8F5] text-xs sm:text-[13px] font-extrabold tracking-[0.22em] uppercase py-3.5 px-9 rounded-[4px] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-block"
                      >
                        {isSubmitting ? "TRANSMITTING..." : "SEND ENQUIRY"}
                      </button>

                      <p className="text-[11.5px] sm:text-xs text-[#7A6B5D] font-sans">
                        By appointment · Monday – Saturday · We reply within one business day.
                      </p>
                    </div>

                  </form>
                )}

              </div>

              {/* RIGHT COLUMN: "Get in Touch" Information Card (lg:col-span-5) */}
              <div className="lg:col-span-5">
                <div 
                  style={{ borderRadius: "12px" }}
                  className="bg-white border border-[#DDD2D8] rounded-[12px] p-8 sm:p-10 lg:p-12 shadow-[0_14px_40px_rgba(74,32,42,0.06)] space-y-7 sm:space-y-8"
                >
                  
                  {/* Card Title */}
                  <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#14110E] tracking-tight font-normal">
                    Get in Touch
                  </h2>

                  {/* 1. EMAIL */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#9E774C] uppercase font-bold block">
                      EMAIL
                    </span>
                    <a
                      href="mailto:support@suitoholic.com"
                      className="text-base sm:text-[17px] text-[#14110E] hover:text-[#4A202A] transition-colors font-medium block font-sans"
                    >
                      support@suitoholic.com
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#DDD2D8]" />

                  {/* 2. TELEPHONE */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#9E774C] uppercase font-bold block">
                      TELEPHONE
                    </span>
                    <a
                      href="tel:+919591444298"
                      className="text-base sm:text-[17px] text-[#14110E] hover:text-[#4A202A] transition-colors font-medium block font-sans"
                    >
                      +91 95914 44298
                    </a>
                    <span className="text-xs sm:text-sm text-[#7A6B5D] block">
                      +91 (0) 129 415 8890
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#DDD2D8]" />

                  {/* 3. HOURS */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#9E774C] uppercase font-bold block">
                      HOURS
                    </span>
                    <div className="text-base sm:text-[17px] text-[#14110E] font-medium font-sans">
                      Monday — Saturday
                    </div>
                    <div className="text-xs sm:text-sm text-[#7A6B5D] font-sans">
                      10:00 — 18:00 · By appointment
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#DDD2D8]" />

                  {/* 4. PRIVATE CONSULTATIONS */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#9E774C] uppercase font-bold block">
                      PRIVATE CONSULTATIONS
                    </span>
                    <p className="text-xs sm:text-sm text-[#55473A] leading-relaxed font-sans">
                      Evening and at-residence appointments available on request.
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. Feature Highlights Bar */}
        <div className="mt-16 sm:mt-24">
          <FeatureHighlightsBar />
        </div>

      </main>

      {/* 6. Footer */}
      <Footer />

    </div>
  );
}

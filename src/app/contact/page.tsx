"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-[#ECEAE5] text-black font-sans antialiased flex flex-col justify-between selection:bg-black selection:text-white">
      
      {/* 1. Header Navigation with active 'contact' tab */}
      <Header activeTab="contact" />

      <main className="flex-1 pb-16 sm:pb-24">
        
        {/* ========================================================================= */}
        {/* 2. HERO SECTION: Light Luxury Editorial Split Layout                      */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#ECEAE5] border-b border-[#E5E3DD] text-black pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Left Column: Typography & Heading (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E3DD] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-black uppercase font-bold">
                    GET IN TOUCH
                  </span>
                </div>

                {/* Main Luxury Heading */}
                <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-normal leading-[1.08] tracking-tight text-black">
                  Let&apos;s Create Your <br className="hidden sm:inline" />
                  <span className="italic font-serif">Perfect Fit</span>
                </h1>

                {/* Narrative Subtitle */}
                <p className="text-sm sm:text-base md:text-[17px] text-[#666666] font-sans leading-relaxed max-w-xl font-normal">
                  Book a consultation, ask a question, or start your tailoring journey with our team today. We craft custom garments that reflect your personal style, with attention to every detail from start to finish.
                </p>

                {/* Atelier Feature Bullets / Micro-highlights */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-black font-sans max-w-xl">
                  <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-[#E5E3DD] shadow-2xs">
                    <Scissors size={15} className="text-black shrink-0" />
                    <span className="font-medium">Master Cutter Appointments</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-[#E5E3DD] shadow-2xs">
                    <Clock size={15} className="text-black shrink-0" />
                    <span className="font-medium">Replies Within 1 Business Day</span>
                  </div>
                </div>

              </div>

              {/* Right Column: High-End Framed Bespoke Fitting Image (lg:col-span-5) */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#E5E3DD] shadow-sm bg-white group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/contact_hero_fitting.jpg"
                    alt="Master Tailor Bespoke Fitting and Craftsmanship"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle ambient lighting vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Caption Badge */}
                  <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-10 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-[#E5E3DD] shadow-xs">
                    <span className="text-[10px] sm:text-[10.5px] font-mono tracking-widest uppercase text-black font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      BESPOKE ATELIER · PERSONAL CONSULTATION
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. COMMISSION ENQUIRY & GET IN TOUCH (BLUORNG MINIMALIST PALETTE)         */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#ECEAE5] py-16 sm:py-24 border-b border-[#E5E3DD] text-black">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* LEFT COLUMN: Commission Inquiry Form (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-sm">
                
                {submitted ? (
                  <div className="text-center space-y-5 py-6 animate-fadeIn">
                    <div className="w-14 h-14 bg-black/5 text-black rounded-full flex items-center justify-center mx-auto border border-black/10">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#666666]">
                        ENQUIRY TRANSMITTED
                      </span>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-black">
                        Thank You, {fullName || "Esteemed Client"}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-md mx-auto">
                        Your bespoke commission inquiry has been sent to our master tailors. We reply within one business day.
                      </p>
                    </div>

                    <div className="bg-[#F5F4F0] border border-[#E5E3DD] p-3.5 rounded-xl inline-block text-xs text-black font-mono">
                      Reference ID: <strong className="text-black">{ticketId}</strong>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="bg-black hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-[0.22em] px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer inline-block"
                      >
                        SEND ANOTHER ENQUIRY
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-[#666666] block mb-1">
                        ONLINE ENQUIRY
                      </span>
                      <h2 className="font-serif-luxury text-2xl sm:text-3xl text-black font-normal">
                        Bespoke Consultation
                      </h2>
                    </div>
                    
                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] font-bold block">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="James Whitfield"
                          className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-3.5 text-xs sm:text-sm text-black placeholder:text-[#999999] transition-all outline-hidden font-sans"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] font-bold block">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="james@example.com"
                          className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-3.5 text-xs sm:text-sm text-black placeholder:text-[#999999] transition-all outline-hidden font-sans"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Service */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] font-bold block">
                          PHONE
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+44 7000 000000"
                          className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-3.5 text-xs sm:text-sm text-black placeholder:text-[#999999] transition-all outline-hidden font-sans"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] font-bold block">
                          SERVICE
                        </label>
                        <div className="relative">
                          <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl pl-4 pr-10 py-3.5 text-xs sm:text-sm text-black transition-all outline-hidden appearance-none font-sans cursor-pointer"
                          >
                            <option value="">Select a service...</option>
                            <option value="Bespoke Suits & Tuxedos">Bespoke Suits & Tuxedos</option>
                            <option value="Custom Tailored Dress Shirts">Custom Tailored Dress Shirts</option>
                            <option value="Sartorial Trousers & Gurkhas">Sartorial Trousers & Gurkhas</option>
                            <option value="Ceremonial & Evening Wear">Ceremonial & Evening Wear</option>
                            <option value="Private Studio Fitting Appointment">Private Studio Fitting Appointment</option>
                            <option value="Fabric Swatch Archive Request">Fabric Swatch Archive Request</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Preferred Date */}
                    <div className="space-y-2">
                      <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] font-bold block">
                        PREFERRED DATE
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-3.5 text-xs sm:text-sm text-black placeholder:text-[#999999] transition-all outline-hidden font-sans cursor-pointer scheme-light"
                      />
                    </div>

                    {/* Row 4: Your Commission */}
                    <div className="space-y-2">
                      <label className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] font-bold block">
                        YOUR COMMISSION
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about the occasion, your preferences, or any questions you have..."
                        className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl p-4 text-xs sm:text-sm text-black placeholder:text-[#999999] transition-all outline-hidden resize-none font-sans"
                      />
                    </div>

                    {submitError && (
                      <p role="alert" className="text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        {submitError}
                      </p>
                    )}

                    {/* Submit Button & Subtext */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black hover:bg-neutral-800 active:scale-[0.99] text-white text-xs sm:text-[13px] font-bold tracking-[0.22em] uppercase py-4 px-9 rounded-full transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-block"
                      >
                        {isSubmitting ? "TRANSMITTING..." : "SEND ENQUIRY"}
                      </button>

                      <p className="text-[11.5px] sm:text-xs text-[#666666] font-sans">
                        By appointment · Monday – Saturday · We reply within one business day.
                      </p>
                    </div>

                  </form>
                )}

              </div>

              {/* RIGHT COLUMN: "Get in Touch" Information Card (lg:col-span-5) */}
              <div className="lg:col-span-5">
                <div 
                  className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-8 sm:p-10 lg:p-12 shadow-sm space-y-7 sm:space-y-8"
                >
                  
                  {/* Card Title */}
                  <h2 className="font-serif-luxury text-3xl sm:text-4xl text-black tracking-tight font-normal">
                    Get in Touch
                  </h2>

                  {/* 1. EMAIL */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      EMAIL
                    </span>
                    <a
                      href="mailto:support@suitoholic.com"
                      className="text-base sm:text-[17px] text-black hover:text-[#666666] transition-colors font-medium block font-sans"
                    >
                      support@suitoholic.com
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E5E3DD]" />

                  {/* 2. TELEPHONE */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      TELEPHONE
                    </span>
                    <a
                      href="tel:+919591444298"
                      className="text-base sm:text-[17px] text-black hover:text-[#666666] transition-colors font-medium block font-sans"
                    >
                      +91 95914 44298
                    </a>
                    <span className="text-xs sm:text-sm text-[#666666] block">
                      +91 (0) 129 415 8890
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E5E3DD]" />

                  {/* 3. HOURS */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      HOURS
                    </span>
                    <div className="text-base sm:text-[17px] text-black font-medium font-sans">
                      Monday — Saturday
                    </div>
                    <div className="text-xs sm:text-sm text-[#666666] font-sans">
                      10:00 — 18:00 · By appointment
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E5E3DD]" />

                  {/* 4. PRIVATE CONSULTATIONS */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] sm:text-[11px] font-mono tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      PRIVATE CONSULTATIONS
                    </span>
                    <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-sans">
                      Evening and at-residence appointments available on request.
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* 6. Footer */}
      <Footer />

    </div>
  );
}

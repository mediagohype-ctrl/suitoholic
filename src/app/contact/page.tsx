"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { shopCollections } from "@/data/shopCollections";
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
        
        <section aria-labelledby="contact-hero-heading" className="relative h-svh w-full overflow-hidden bg-[#ECEAE5]">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-[url('/banners/contact-tailoring-with-care-and-precision.png')] bg-cover bg-center opacity-50 blur-2xl landscape:hidden"
          />
          <Image
            src="/banners/contact-tailoring-with-care-and-precision.png"
            alt="Tailoring with Care and Precision. A master tailor cuts blue striped fabric at his worktable."
            fill
            unoptimized
            loading="eager"
            fetchPriority="high"
            className="object-contain landscape:object-cover landscape:object-[55%_42%]"
          />
          <h1 id="contact-hero-heading" className="sr-only">Let&apos;s Create Your Perfect Fit</h1>
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
                      <span className="text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-[#666666]">
                        ENQUIRY TRANSMITTED
                      </span>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-black">
                        Thank You, {fullName || "Esteemed Client"}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-md mx-auto font-sans">
                        Your bespoke commission inquiry has been sent to our master tailors. We reply within one business day.
                      </p>
                    </div>

                    <div className="bg-[#F5F4F0] border border-[#E5E3DD] p-3.5 rounded-xl inline-block text-xs text-black font-sans font-medium">
                      Reference ID: <strong className="text-black font-bold">{ticketId}</strong>
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
                    <div className="mb-4">
                      <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                        Bespoke Consultation
                      </h2>
                    </div>
                    
                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 font-sans">
                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#666666] font-bold block">
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
                        <label className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#666666] font-bold block">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 font-sans">
                      <div className="space-y-2">
                        <label className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#666666] font-bold block">
                          PHONE
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 99799 38022"
                          className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-3.5 text-xs sm:text-sm text-black placeholder:text-[#999999] transition-all outline-hidden font-sans"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="consultation-service" className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#666666] font-bold block">
                          SERVICE
                        </label>
                        <div className="relative">
                          <select
                            id="consultation-service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full bg-[#F5F4F0] border border-[#E5E3DD] hover:border-black/40 focus:border-black focus:ring-1 focus:ring-black rounded-xl pl-4 pr-10 py-3.5 text-xs sm:text-sm text-black transition-all outline-hidden appearance-none font-sans cursor-pointer"
                          >
                            <option value="">Select a service...</option>
                            {shopCollections.map(({ id, title }) => (
                              <option key={id} value={title}>{title}</option>
                            ))}
                            <option value="Private Studio Fitting Appointment">Private Studio Fitting Appointment</option>
                            <option value="Fabric Swatch Archive Request">Fabric Swatch Archive Request</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Preferred Date */}
                    <div className="space-y-2 font-sans">
                      <label className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#666666] font-bold block">
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
                    <div className="space-y-2 font-sans">
                      <label className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-[#666666] font-bold block">
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

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black hover:bg-neutral-800 active:scale-[0.99] text-white text-xs sm:text-[13px] font-bold tracking-[0.22em] uppercase py-4 px-9 rounded-full transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-block"
                      >
                        {isSubmitting ? "TRANSMITTING..." : "SEND ENQUIRY"}
                      </button>
                    </div>

                  </form>
                )}

              </div>

              <section aria-labelledby="studio-visit-heading" className="lg:col-span-5">
                <div 
                  className="@container bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-8 sm:p-10 lg:p-12 shadow-sm space-y-7 sm:space-y-8"
                >
                  <h2 id="studio-visit-heading" className="font-serif-luxury whitespace-nowrap text-[min(2.375rem,7cqi)] font-bold uppercase leading-tight">
                    Visit Our Vapi Studio
                  </h2>

                  <div className="space-y-1.5 font-sans">
                    <span className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      Studio Address
                    </span>
                    <address className="space-y-1.5 not-italic">
                      <div className="text-base sm:text-[17px] text-black font-semibold">
                        Suitoholic Atelier
                      </div>
                      <div className="text-xs sm:text-sm text-[#14110E] font-medium leading-relaxed">
                        Near Upasana School, Behind Gunjan Cinema,<br />
                        GIDC, Vapi, Gujarat - 396195
                      </div>
                    </address>
                  </div>

                  <div className="border-t border-[#E5E3DD]" />

                  <div className="space-y-1.5 font-sans">
                    <span className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      Visiting Hours
                    </span>
                    <div className="text-base sm:text-[17px] text-black font-medium">
                      Monday — Saturday
                    </div>
                    <div className="text-xs sm:text-sm text-[#666666]">
                      10:00 — 20:30 · By appointment
                    </div>
                  </div>

                  <div className="border-t border-[#E5E3DD]" />

                  <div className="space-y-1.5 font-sans">
                    <span className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      Call for an Appointment
                    </span>
                    <a
                      href="tel:+919979938022"
                      className="text-base sm:text-[17px] text-black hover:text-[#666666] transition-colors font-medium block"
                    >
                      +91 99799 38022
                    </a>
                  </div>

                  <div className="border-t border-[#E5E3DD]" />

                  <div className="space-y-1.5 font-sans">
                    <span className="text-[10.5px] sm:text-[11px] font-sans tracking-[0.24em] text-[#666666] uppercase font-bold block">
                      Studio Email
                    </span>
                    <a
                      href="mailto:infosuitoholic@gmail.com"
                      className="text-base sm:text-[17px] text-black hover:text-[#666666] transition-colors font-medium block break-words"
                    >
                      infosuitoholic@gmail.com
                    </a>
                  </div>
                </div>
              </section>

            </div>

          </div>
        </section>

      </main>

      {/* 6. Footer */}
      <Footer />

    </div>
  );
}

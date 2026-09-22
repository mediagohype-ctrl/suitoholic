"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
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

// =========================================================================
// FAQ Data for Bespoke Concierge
// =========================================================================
const contactFaqs = [
  {
    question: "How do I schedule a Private Fitting & Pattern Consultation?",
    answer:
      "You can book a fitting directly through this contact form by selecting 'Private Fitting / Appointment', or by calling our direct studio hotline (+91 129 415 8890). We offer in-studio fittings at our Sartorial Salon as well as VIP Home Fitting Concierge visits.",
  },
  {
    question: "What is the typical turnaround time for custom shirts and suits?",
    answer:
      "Custom dress shirts are completed in 7 to 10 business days. Full canvas suits and tuxedo ceremonial wear take 14 to 21 days, including individual paper pattern drafting and initial fitting checks. Express 5-day rush service is available upon request.",
  },
  {
    question: "Can I request physical fabric swatches before placing an order?",
    answer:
      "Yes! Select 'Fabric Archive & Sample Request' in the form below with your desired mill (e.g., Loro Piana, Thomas Mason, Albini) and color palette. We will dispatch a curated swatch booklet directly to your residence.",
  },
  {
    question: "What is the Suitoholic 100% Fit Guarantee & Alteration Policy?",
    answer:
      "Every single garment engineered by Suitoholic is covered by our 100% Fit Guarantee. If your garment requires minor adjustments within 30 days of delivery, our master tailors perform alterations completely free of charge.",
  },
  {
    question: "Do you offer international consultations and global shipping?",
    answer:
      "Absolutely. We ship worldwide via express courier with full customs clearance and door-to-door tracking. We also conduct virtual 3D anatomical measurement sessions for overseas clients.",
  },
];

export default function ContactPage() {
  // Form State
  const [inquiryType, setInquiryType] = useState("fitting");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tailorConsult, setTailorConsult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  // FAQ Accordion Toggle
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;

    setIsSubmitting(true);
    // Simulate high-end concierge submission
    setTimeout(() => {
      const generatedId = `SUI-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    setTailorConsult(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#14110E] font-sans antialiased flex flex-col justify-between selection:bg-[#8C5A28] selection:text-white">
      
      {/* 1. Header Navigation */}
      <Header />

      <main className="flex-1 pb-16 sm:pb-24">
        
        {/* ========================================================================= */}
        {/* 2. HERO HEADER BANNER: Light & Elegant Ivory Palette                      */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-gradient-to-b from-[#FAF5EF] via-[#F5EBE0] to-[#EAE0D5] text-[#14110E] pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-14 overflow-hidden border-b border-[#D8C5B3]">
          
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center select-none overflow-hidden">
            <span className="font-serif-luxury text-[14vw] font-black tracking-widest text-[#14110E] uppercase whitespace-nowrap">
              CONCIERGE
            </span>
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto text-center space-y-4 sm:space-y-6">
            
            {/* Main Title */}
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal uppercase leading-[1.08] tracking-tight text-[#14110E]">
              Connect With Our <span className="italic font-light text-[#8C5A28]">Atelier</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-xs sm:text-base text-[#5C4A3E] leading-relaxed font-normal">
              Whether you wish to schedule a private fitting appointment, inquire about artisanal fabric weaves, or discuss a custom commission — our master tailors and private client team are at your service.
            </p>

            {/* 3 Quick Info Cards Row */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto text-left">
              
              {/* Card 1: Direct Hotline */}
              <div className="bg-white/95 backdrop-blur-md border border-[#E3D4C4] p-5 sm:p-6 rounded-2xl space-y-3 hover:border-[#8C5A28] transition-all duration-300 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] flex items-center justify-center text-[#8C5A28] border border-[#E8D9CB]">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C5A28] font-bold block">
                    Direct Hotline
                  </span>
                  <a href="tel:+911294158890" className="text-base sm:text-lg font-bold text-[#14110E] hover:text-[#8C5A28] transition-colors block mt-0.5">
                    +91 (0) 129 415 8890
                  </a>
                  <span className="text-xs text-[#665449] block mt-1">10:00 AM – 8:30 PM (Mon – Sat)</span>
                </div>
              </div>

              {/* Card 2: Private Client Email */}
              <div className="bg-white/95 backdrop-blur-md border border-[#E3D4C4] p-5 sm:p-6 rounded-2xl space-y-3 hover:border-[#8C5A28] transition-all duration-300 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] flex items-center justify-center text-[#8C5A28] border border-[#E8D9CB]">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C5A28] font-bold block">
                    Private Appointments & Desk
                  </span>
                  <a href="mailto:support@suitoholic.com" className="text-base sm:text-lg font-bold text-[#14110E] hover:text-[#8C5A28] transition-colors block mt-0.5">
                    support@suitoholic.com
                  </a>
                  <span className="text-xs text-[#665449] block mt-1">Under 2-Hour Response Guaranteed</span>
                </div>
              </div>

              {/* Card 3: Flagship Atelier */}
              <div className="bg-white/95 backdrop-blur-md border border-[#E3D4C4] p-5 sm:p-6 rounded-2xl space-y-3 hover:border-[#8C5A28] transition-all duration-300 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-[#FAF5EF] flex items-center justify-center text-[#8C5A28] border border-[#E8D9CB]">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C5A28] font-bold block">
                    Flagship Sartorial Salon
                  </span>
                  <span className="text-sm font-semibold text-[#14110E] block mt-0.5 leading-snug">
                    Suitoholic Atelier, Bespoke Wing, NCR Sector 15, New Delhi
                  </span>
                  <span className="text-xs text-[#665449] block mt-1">VIP Private Lounge & Valet Parking</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MAIN DUAL-COLUMN SECTION: Form + Salon Experience                     */}
        {/* ========================================================================= */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-14 -mt-8 sm:-mt-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN (lg:col-span-7): Interactive Bespoke Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E3D4C4] shadow-[0_20px_50px_rgba(20,17,14,0.06)] space-y-6">
              
              <div>
                <span className="text-xs font-bold text-[#8C5A28] uppercase tracking-[0.2em] block mb-1">
                  Private Inquiry Form
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#14110E] tracking-tight">
                  Send a Bespoke Message
                </h2>
                <p className="text-xs sm:text-sm text-[#665449] mt-1 font-normal">
                  Fill out your details below and our senior tailoring concierge will assist you promptly.
                </p>
              </div>

              {/* Inquiry Type Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4A3B33] block">
                  Select Inquiry Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "fitting", label: "Private Fitting" },
                    { id: "custom", label: "Custom Shirt/Suit" },
                    { id: "fabric", label: "Fabric Swatches" },
                    { id: "order", label: "Order Status" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInquiryType(tab.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-center border cursor-pointer ${
                        inquiryType === tab.id
                          ? "bg-[#14110E] text-white border-[#14110E] shadow-sm"
                          : "bg-[#FAF6F0] text-[#524137] border-[#E3D4C4] hover:bg-[#14110E] hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Submission Success Screen */}
              {submitted ? (
                <div className="bg-[#FAF5EF] border border-[#D8C5B3] rounded-2xl p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 bg-[#2D6A4F]/15 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto border border-[#2D6A4F]/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#8C5A28]">
                      Inquiry Received
                    </span>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#14110E]">
                      Thank You, {fullName || "Esteemed Client"}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C4A3E] leading-relaxed max-w-md mx-auto">
                      Your inquiry has been assigned to our master sartorial concierge team.
                    </p>
                  </div>

                  <div className="bg-white border border-[#E3D4C4] p-3.5 rounded-xl inline-block text-xs text-[#3D3028] font-mono">
                    Reference ID: <strong className="text-[#8C5A28]">{ticketId}</strong>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleResetForm}
                      className="bg-[#14110E] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all cursor-pointer shadow-md"
                    >
                      Submit Another Query
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  
                  {/* Full Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#4A3B33] flex items-center justify-between">
                        <span>Full Name <span className="text-[#8C5A28]">*</span></span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6D]" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Lord Alexander Wright"
                          className="w-full bg-[#FAF8F5] border border-[#D9C8B8] focus:border-[#14110E] focus:ring-1 focus:ring-[#14110E] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#A39285] transition-all outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#4A3B33] flex items-center justify-between">
                        <span>Email Address <span className="text-[#8C5A28]">*</span></span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6D]" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. alexander@domain.com"
                          className="w-full bg-[#FAF8F5] border border-[#D9C8B8] focus:border-[#14110E] focus:ring-1 focus:ring-[#14110E] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#A39285] transition-all outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Contact Preference Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#4A3B33]">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6D]" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#FAF8F5] border border-[#D9C8B8] focus:border-[#14110E] focus:ring-1 focus:ring-[#14110E] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#A39285] transition-all outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#4A3B33]">
                        Preferred Response Channel
                      </label>
                      <select
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D9C8B8] focus:border-[#14110E] focus:ring-1 focus:ring-[#14110E] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#14110E] transition-all outline-hidden"
                      >
                        <option value="email">Email Concierge</option>
                        <option value="phone">Direct Phone Call</option>
                        <option value="whatsapp">WhatsApp Business</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4A3B33]">
                      Subject / Order Reference
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Schedule Private Fitting for Double-Breasted Linen Suit"
                      className="w-full bg-[#FAF8F5] border border-[#D9C8B8] focus:border-[#14110E] focus:ring-1 focus:ring-[#14110E] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#14110E] placeholder:text-[#A39285] transition-all outline-hidden"
                    />
                  </div>

                  {/* Detailed Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4A3B33] flex items-center justify-between">
                      <span>Detailed Request / Fitting Requirements <span className="text-[#8C5A28]">*</span></span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please specify your measurements, preferred fabrics, event timeline, or fitting locations..."
                      className="w-full bg-[#FAF8F5] border border-[#D9C8B8] focus:border-[#14110E] focus:ring-1 focus:ring-[#14110E] rounded-xl p-4 text-xs sm:text-sm text-[#14110E] placeholder:text-[#A39285] transition-all outline-hidden resize-none"
                    />
                  </div>

                  {/* Special Tailor Consultation Checkbox */}
                  <label className="flex items-start space-x-3 p-3.5 bg-[#FAF5EF] border border-[#E3D4C4] rounded-xl cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={tailorConsult}
                      onChange={(e) => setTailorConsult(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded-xs border-[#A39285] text-[#14110E] focus:ring-[#14110E] accent-[#14110E]"
                    />
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold text-[#14110E] block group-hover:text-[#8C5A28] transition-colors">
                        Request 1-on-1 Master Tailor Pattern Review
                      </span>
                      <span className="text-[#665449] font-normal block leading-tight">
                        Check this box to have our Head Bespoke Cutter personally inspect your physique requirements prior to pattern drafting.
                      </span>
                    </div>
                  </label>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#14110E] hover:bg-black text-white text-xs sm:text-sm font-bold tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-lg cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>Transmitting to Atelier...</span>
                      ) : (
                        <>
                          <span>Transmit Private Inquiry</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* RIGHT COLUMN (lg:col-span-5): Atelier Studio Experience & Salon Showcase */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Studio Visual Showcase Card */}
              <div className="bg-white text-[#14110E] rounded-3xl p-6 sm:p-8 border border-[#E3D4C4] shadow-xl space-y-5 relative overflow-hidden group">
                {/* Background Tailoring Photo */}
                <div className="relative h-52 sm:h-60 w-full rounded-2xl overflow-hidden border border-[#E3D4C4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/tailoring_tools.jpg"
                    alt="Suitoholic Bespoke Sartorial Salon"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                </div>

                <div className="space-y-3">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#14110E]">
                    The Private Fitting Lounge
                  </h3>
                  <p className="text-xs text-[#5C4A3E] leading-relaxed font-normal">
                    Step inside our private fitting suite for an unhurried, luxury consultation. Sample over 1,200 fine natural fabrics with a complimentary single-malt or espresso while master cutters draft your custom pattern.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE0D5] space-y-2.5 text-xs text-[#4A3B33]">
                  <div className="flex items-center space-x-2.5">
                    <Clock size={15} className="text-[#8C5A28] shrink-0" />
                    <span>Studio Hours: 10:00 AM – 8:30 PM (Mon – Sat)</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Building2 size={15} className="text-[#8C5A28] shrink-0" />
                    <span>Private Valet &amp; VIP Entry Available</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Globe2 size={15} className="text-[#8C5A28] shrink-0" />
                    <span>In-Studio &amp; Worldwide Doorstep Fitting</span>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#14110E] hover:bg-black text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xl transition-all duration-300 shadow-md group/map"
                  >
                    <span>Get Directions via Google Maps</span>
                    <ExternalLink size={14} className="group-hover/map:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* 3 Bespoke Promises Card */}
              <div className="bg-[#FAF5EF] rounded-3xl p-6 border border-[#E3D4C4] space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C5A28] block">
                  The Suitoholic Standard
                </span>

                <div className="space-y-3.5 text-xs text-[#4A3B33]">
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EAE0D5] flex items-center justify-center text-[#8C5A28] shrink-0 mt-0.5">
                      <Scissors size={15} />
                    </div>
                    <div>
                      <strong className="text-[#14110E] font-bold block">1-on-1 Pattern Drafting</strong>
                      <span className="text-[#665449]">Every garment begins from a fresh paper pattern cut specifically to your shoulder slope and torso.</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EAE0D5] flex items-center justify-center text-[#8C5A28] shrink-0 mt-0.5">
                      <ShieldCheck size={15} />
                    </div>
                    <div>
                      <strong className="text-[#14110E] font-bold block">100% Fit Guarantee</strong>
                      <span className="text-[#665449]">Complimentary minor re-alterations within 30 days of delivery until your garment is flawless.</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EAE0D5] flex items-center justify-center text-[#8C5A28] shrink-0 mt-0.5">
                      <Headphones size={15} />
                    </div>
                    <div>
                      <strong className="text-[#14110E] font-bold block">Dedicated Concierge</strong>
                      <span className="text-[#665449]">A personal tailoring advisor handles your fabric selection, measurements, and order tracking.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. FAQ ACCORDION SECTION: Bespoke Inquiry Guidance                       */}
        {/* ========================================================================= */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-14 mt-16 sm:mt-24">
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E3D4C4] shadow-[0_10px_30px_rgba(20,17,14,0.04)] space-y-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C5A28] uppercase tracking-[0.2em]">
                <HelpCircle size={15} />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#14110E] tracking-tight uppercase">
                Bespoke Fitting &amp; Service FAQ
              </h2>
              <p className="text-xs sm:text-sm text-[#665449] leading-relaxed">
                Everything you need to know about scheduling consultations, custom sizing, fabric samples, and our fit policies.
              </p>
            </div>

            <div className="max-w-4xl mx-auto divide-y divide-[#EADCCF]">
              {contactFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="py-4 sm:py-5">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left gap-4 focus:outline-hidden group cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-bold text-[#14110E] group-hover:text-[#8C5A28] transition-colors">
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full border border-[#D9C8B8] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#14110E] text-white border-[#14110E]" : "bg-[#FAF5EF] text-[#665449]"}`}>
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="pt-3 pr-8 text-xs sm:text-sm text-[#5C4A3E] leading-relaxed font-normal animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
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

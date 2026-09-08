"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Phone, Mail, MapPin, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Ruler, Scissors, Award } from "lucide-react";

export default function Footer() {
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
    <footer className="w-full min-h-[88vh] lg:min-h-[90vh] bg-gradient-to-b from-[#FAF5EE] via-[#EFE5D8] to-[#D5C2AF] text-[#14110E] rounded-t-[36px] sm:rounded-t-[52px] lg:rounded-t-[64px] border-t border-[#DECDBF] font-sans antialiased relative z-20 shadow-[0_-15px_45px_rgba(20,17,14,0.06)] overflow-hidden mt-8 sm:mt-14 flex flex-col justify-between">
      
      {/* Top Section: VIP Atelier Newsletter & Private Invitation Bar */}
      <div className="w-full border-b border-[#D8C7B5]/80 bg-white/35 backdrop-blur-md px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-12">
        <div className="max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#7A5428] uppercase">
              <Sparkles size={14} className="text-[#9E774C]" />
              <span>THE SARTORIAL PRIVILEGE CLUB</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#14110E] tracking-tight leading-tight uppercase">
              JOIN THE SARTORIAL CIRCLE.
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-[#4A3D31] max-w-xl font-normal leading-relaxed">
              Receive private runway previews, rare Egyptian Giza fabric allocations, and invitations to private bespoke trunk shows.
            </p>
          </div>

          <div className="lg:col-span-6 w-full flex flex-col justify-center">
            {subscribed ? (
              <div className="bg-[#2D6A4F]/10 border border-[#2D6A4F]/40 p-4 sm:p-5 rounded-2xl flex items-center space-x-3 text-[#2D6A4F]">
                <CheckCircle2 size={22} className="shrink-0" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  Welcome to the Atelier Circle. Check your inbox for your private concierge invitation.
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
                    className="w-full bg-white/90 border border-[#C5B3A0] focus:border-[#14110E] text-xs sm:text-sm lg:text-base px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-full text-[#14110E] placeholder:text-[#8C7A6B] focus:outline-hidden transition-all shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#14110E] hover:bg-[#9E774C] text-white text-xs sm:text-sm font-bold tracking-[0.2em] px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full transition-all duration-300 uppercase shadow-md flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer group"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
            <span className="text-[10px] sm:text-xs text-[#6B5A4B] mt-2 lg:ml-auto block">
              We respect your privacy. Unsubscribe at any time with one click.
            </span>
          </div>

        </div>
      </div>

      {/* Main Full-Width Footer Content Grid */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-16 flex-1 flex flex-col justify-center">
        <div className="max-w-[1720px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">
          
          {/* Column 1: BRAND STORY & ATELIER IDENTITY (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6">
            <Link href="/" className="inline-block group">
              <span className="font-brand-logo text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#14110E] lowercase inline-flex items-center">
                suitoholic<span className="text-xs sm:text-sm font-sans font-bold text-[#14110E] -mt-4 ml-0.5 select-none">™</span>
              </span>
              <span className="block text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-[#7A5428] uppercase mt-1">
                ESTD. 2003 • SAVILE ROW BESPOKE ATELIER
              </span>
            </Link>

            <p className="text-sm sm:text-base lg:text-[17px] text-[#3A2F25] leading-relaxed font-normal">
              Master artisans crafting world-class bespoke suiting, precision dress shirts, and sartorial menswear from Egyptian Giza 140s twill, Sea Island cotton, and pure Italian Super 150s wool.
            </p>

            {/* Atelier Key Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#2C2117]">
                <Ruler size={17} className="text-[#9E774C] shrink-0" />
                <span>40+ Body Data Points</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#2C2117]">
                <Scissors size={17} className="text-[#9E774C] shrink-0" />
                <span>Hand-Draped Canvas</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#2C2117]">
                <ShieldCheck size={17} className="text-[#9E774C] shrink-0" />
                <span>100% Fit Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#2C2117]">
                <Award size={17} className="text-[#9E774C] shrink-0" />
                <span>Global Express Air</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#7A5428] uppercase block">
                FOLLOW OUR ATELIER
              </span>
              <div className="flex items-center space-x-3">
                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#14110E] hover:text-[#FAF8F5] border border-[#D5C5B5] flex items-center justify-center transition-all text-[#14110E] shadow-sm hover:scale-105"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#14110E] hover:text-[#FAF8F5] border border-[#D5C5B5] flex items-center justify-center transition-all text-[#14110E] shadow-sm hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#14110E] hover:text-[#FAF8F5] border border-[#D5C5B5] flex items-center justify-center transition-all text-[#14110E] shadow-sm hover:scale-105"
                  aria-label="Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#14110E] hover:text-[#FAF8F5] border border-[#D5C5B5] flex items-center justify-center transition-all text-[#14110E] shadow-sm hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: BESPOKE COLLECTIONS (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#7A5428] uppercase border-b border-[#D8C7B5] pb-2">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 sm:space-y-3.5 text-sm sm:text-[15px] font-medium text-[#221B15]">
              <li>
                <Link href="/shop?category=formal_shirts" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Exclusive Formal Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=formal_stripes" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Executive Banker Stripes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=formal_bespoke" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Sea Island Twill Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=trousers" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Tailored Trousers &amp; Gurkhas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tshirts" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Luxury Knit Polos &amp; Tees
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Handcrafted Tuxedos &amp; Suits
                </Link>
              </li>
              <li>
                <Link href="/custom-shirt" className="text-[#7A5428] font-bold hover:underline inline-flex items-center gap-1.5 pt-1">
                  <span>Custom Fit Atelier</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CLIENT CONCIERGE & CARE (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#7A5428] uppercase border-b border-[#D8C7B5] pb-2">
              CLIENT CARE
            </h4>
            <ul className="space-y-3 sm:space-y-3.5 text-sm sm:text-[15px] font-medium text-[#221B15]">
              <li>
                <Link href="/#track" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Track Your Bespoke Order
                </Link>
              </li>
              <li>
                <Link href="/#alterations" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Complimentary Alterations
                </Link>
              </li>
              <li>
                <Link href="/#shipping" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Worldwide Air Shipping
                </Link>
              </li>
              <li>
                <Link href="/#guarantee" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  100% Fit Guarantee
                </Link>
              </li>
              <li>
                <Link href="/#swatches" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Order Fabric Swatches
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Privacy &amp; Data Security
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#7A5428] hover:translate-x-1 transition-all inline-block">
                  Terms of Haute Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ATELIER CONCIERGE & FLAGSHIP SALONS (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5 bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border border-white/80 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#D0BDA9]/70">
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#7A5428] uppercase">
                DIRECT CONCIERGE
              </span>
              <span className="inline-flex items-center text-[#2D6A4F] text-xs font-semibold gap-1.5 bg-[#2D6A4F]/10 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                Live Reception
              </span>
            </div>

            {/* Direct Contact Details with larger text */}
            <div className="space-y-3.5 text-sm sm:text-base text-[#2E241C] font-medium">
              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-[#7A5428] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#705E4F] uppercase tracking-wider font-semibold">Phone Inquiries</span>
                  <strong className="text-[#14110E] text-sm sm:text-base">+91 (0) 22 4590 8800</strong>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-[#7A5428] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#705E4F] uppercase tracking-wider font-semibold">Client Relations</span>
                  <a href="mailto:concierge@suitoholic.com" className="text-[#14110E] hover:text-[#7A5428] font-bold text-sm sm:text-base">
                    concierge@suitoholic.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#7A5428] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#705E4F] uppercase tracking-wider font-semibold">Flagship Salons</span>
                  <strong className="text-[#14110E] text-sm sm:text-base block">Bespoke Quarter, Mumbai &amp; New Delhi</strong>
                </div>
              </div>
            </div>

            {/* Operating Schedule */}
            <div className="pt-3 border-t border-[#D0BDA9]/70 flex items-center justify-between text-xs sm:text-sm text-[#4E4033]">
              <span>Salon Hours: <strong>10:00 AM – 8:30 PM IST</strong></span>
              <span className="text-[#7A5428] font-bold">Mon – Sat</span>
            </div>

            <Link
              href="/custom-shirt"
              className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs sm:text-sm font-bold tracking-[0.2em] py-3.5 sm:py-4 rounded-xl transition-all duration-300 text-center uppercase flex items-center justify-center gap-2 shadow-md group"
            >
              <span>BOOK 3D SARTORIAL FITTING</span>
              <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom Full-Width Polished Copyright & Verified Payment Badges Strip */}
      <div className="w-full bg-[#C7B39E]/90 border-t border-[#BAA48F] py-5 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1720px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Copyright with larger readable typography */}
          <div className="text-[#2B2117] text-xs sm:text-sm text-center lg:text-left font-medium flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span>© 2003–2026</span>
            <span className="font-brand-logo text-[#14110E] tracking-tight font-bold lowercase inline-flex items-center text-sm sm:text-base">
              suitoholic<span className="text-[9px] font-sans font-bold -mt-1 ml-0.5">™</span>
            </span>
            <span>Bespoke Sartorial Atelier. All rights reserved.</span>
            <span className="hidden sm:inline text-[#7A5428]">•</span>
            <span className="hidden sm:inline text-xs text-[#524436]">Handcrafted with Savile Row precision.</span>
          </div>

          {/* Official Payment Badges & SSL Security */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 justify-center lg:justify-end">
            
            {/* Visa */}
            <div className="h-7 px-2.5 bg-white rounded-md border border-[#C5B3A0] flex items-center justify-center shadow-xs" title="Visa">
              <svg className="h-4 w-auto" viewBox="0 0 48 16" fill="none">
                <path d="M19.14 0.68L12.55 15.32H8.22L5.03 3.86C4.83 3.08 4.67 2.8 4.07 2.47C3.1 1.95 1.45 1.47 0 1.15L0.1 0.68H7.13C8.03 0.68 8.84 1.28 9.03 2.31L10.77 11.5L14.99 0.68H19.14ZM36.03 10.45C36.05 6.47 30.5 6.25 30.54 4.47C30.55 3.93 31.07 3.35 32.22 3.2C32.79 3.12 34.36 3.07 36.08 3.86L36.77 0.67C35.83 0.33 34.62 0 33.1 0C29.06 0 26.22 2.15 26.2 5.22C26.17 7.5 28.21 8.78 29.77 9.54C31.37 10.32 31.91 10.82 31.9 11.51C31.89 12.57 30.63 13.04 29.46 13.06C27.4 13.09 26.2 12.5 25.26 12.06L24.54 15.42C25.5 15.86 27.27 16.24 29.1 16.27C33.39 16.27 36.01 14.15 36.03 10.45ZM46.66 15.32H50.33L47.14 0.68H43.76C42.99 0.68 42.34 1.12 42.06 1.79L35.92 15.32H40.26L41.12 12.94H46.42L46.66 15.32ZM42.32 9.62L44.5 3.65L45.75 9.62H42.32ZM25.04 0.68L21.68 15.32H17.56L20.92 0.68H25.04Z" fill="#1A1F71"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="h-7 px-2 bg-white rounded-md border border-[#C5B3A0] flex items-center justify-center shadow-xs" title="Mastercard">
              <svg className="h-4.5 w-auto" viewBox="0 0 32 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#EB001B"/>
                <circle cx="22" cy="10" r="10" fill="#F79E1B"/>
                <path d="M16 3.12C18.15 4.87 19.5 7.49 19.5 10.45C19.5 13.41 18.15 16.03 16 17.78C13.85 16.03 12.5 13.41 12.5 10.45C12.5 7.49 13.85 4.87 16 3.12Z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* RuPay */}
            <div className="h-7 px-2.5 bg-white rounded-md border border-[#C5B3A0] flex items-center justify-center shadow-xs" title="RuPay">
              <svg className="h-4 w-auto" viewBox="0 0 46 16" fill="none">
                <path d="M0 0.5H5.8C8.5 0.5 10.2 1.9 10.2 4.3C10.2 6.5 8.7 7.8 6.4 8.1L10.8 15.5H6.5L2.8 9.1H2.4V15.5H0V0.5ZM2.4 2.5V7.1H5.4C6.9 7.1 7.7 6.3 7.7 4.8C7.7 3.3 6.9 2.5 5.4 2.5H2.4Z" fill="#0C2340"/>
                <path d="M11.6 5.8H14V11.2C14 12.8 14.9 13.7 16.5 13.7C18.1 13.7 19 12.8 19 11.2V5.8H21.4V11.1C21.4 14.1 19.7 15.7 16.5 15.7C13.3 15.7 11.6 14.1 11.6 11.1V5.8Z" fill="#0C2340"/>
                <path d="M23 0.5H28.6C31.5 0.5 33.3 2.1 33.3 5C33.3 7.9 31.5 9.5 28.6 9.5H25.4V15.5H23V0.5ZM25.4 2.5V7.5H28.4C30 7.5 30.9 6.6 30.9 5C30.9 3.4 30 2.5 28.4 2.5H25.4Z" fill="#0C2340"/>
                <path d="M37.5 1.5L42.5 8L37.5 14.5H34L39 8L34 1.5H37.5Z" fill="#097938"/>
                <path d="M41 1.5L46 8L41 14.5H37.5L42.5 8L37.5 1.5H41Z" fill="#EF7D00"/>
              </svg>
            </div>

            {/* UPI */}
            <div className="h-7 px-2.5 bg-white rounded-md border border-[#C5B3A0] flex items-center justify-center shadow-xs" title="UPI">
              <svg className="h-4 w-auto" viewBox="0 0 36 16" fill="none">
                <path d="M3.5 1.5L9.5 8L3.5 14.5L0 8L3.5 1.5Z" fill="#097938"/>
                <path d="M7 1.5L13 8L7 14.5L3.5 8L7 1.5Z" fill="#F47920"/>
                <text x="14.5" y="12.5" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#0C2340" letterSpacing="0.5">UPI</text>
              </svg>
            </div>

            {/* American Express */}
            <div className="h-7 px-2 bg-white rounded-md border border-[#C5B3A0] flex items-center justify-center shadow-xs" title="American Express">
              <svg className="h-4 w-auto" viewBox="0 0 32 16" fill="none">
                <rect width="32" height="16" rx="2" fill="#006FCF"/>
                <text x="2" y="11.5" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.5">AMEX</text>
              </svg>
            </div>

            {/* 100% Secure SSL Badge */}
            <div className="flex items-center space-x-1.5 bg-white/95 border border-[#B5A08B] rounded-md px-3 py-1.5 text-[11px] font-bold text-[#2C2117] shadow-xs">
              <Lock size={13} className="text-[#7A5428] stroke-[2.5]" />
              <span className="tracking-wider">256-BIT ENCRYPTED</span>
            </div>

          </div>

        </div>
      </div>

    </footer>
  );
}


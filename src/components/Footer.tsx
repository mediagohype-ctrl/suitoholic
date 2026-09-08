"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Scissors,
  Ruler,
  Truck,
  ArrowUp,
  ArrowRight,
  Lock,
  Globe,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#FAF5EF] via-[#F2E7DC] to-[#E3D4C4] text-[#36212B] rounded-t-[36px] sm:rounded-t-[54px] lg:rounded-t-[68px] border-t-2 border-[#D8C5B3] font-sans antialiased relative z-20 shadow-[0_-25px_60px_rgba(20,17,14,0.08)] overflow-hidden mt-10 sm:mt-16 select-none flex flex-col justify-between">
      
      {/* Background Architectural Subtle Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none overflow-hidden">
        <span className="font-serif-luxury text-[18vw] font-black tracking-widest text-[#14110E] uppercase whitespace-nowrap">
          SUITOHOLIC
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP TIER: ATELIER CRAFTSMANSHIP & CLIENT PROMISE PILLARS               */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full border-b border-[#D6C5B5]/80 bg-white/40 backdrop-blur-xs py-8 sm:py-10 px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="max-w-[1680px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Pillar 1 */}
          <div className="flex items-start space-x-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-[#3B222E] text-[#FAF5EF] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Ruler size={20} className="text-[#E7C7A2]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#2C1822] tracking-tight uppercase">
                40+ Body Data Fit
              </h4>
              <p className="text-xs sm:text-[13px] text-[#5A434F] font-normal leading-relaxed mt-0.5">
                Precision custom crafted to your exact posture, shoulder slope, and silhouette.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start space-x-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-[#3B222E] text-[#FAF5EF] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Scissors size={20} className="text-[#E7C7A2]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#2C1822] tracking-tight uppercase">
                Master Draped Canvas
              </h4>
              <p className="text-xs sm:text-[13px] text-[#5A434F] font-normal leading-relaxed mt-0.5">
                Authentic floating canvas construction for unmatched drape, structure, and breathability.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start space-x-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-[#3B222E] text-[#FAF5EF] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck size={20} className="text-[#E7C7A2]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#2C1822] tracking-tight uppercase">
                100% Fit Guarantee
              </h4>
              <p className="text-xs sm:text-[13px] text-[#5A434F] font-normal leading-relaxed mt-0.5">
                Complimentary alterations within 30 days to ensure a flawless bespoke fit.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start space-x-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-[#3B222E] text-[#FAF5EF] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Truck size={20} className="text-[#E7C7A2]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#2C1822] tracking-tight uppercase">
                Express Insured Air
              </h4>
              <p className="text-xs sm:text-[13px] text-[#5A434F] font-normal leading-relaxed mt-0.5">
                Worldwide white-glove door delivery in bespoke breathable garment bags.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN TIER: EXPANSIVE MULTI-COLUMN EDITORIAL DIRECTORY                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-14 sm:py-20 lg:py-24 flex-1">
        <div className="max-w-[1680px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 xl:gap-20 items-start">
          
          {/* Column 1: BRAND LEGACY & DIRECT CONCIERGE (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-7">
            <div>
              <Link href="/" className="inline-block group">
                <span className="font-brand-logo text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#2C1822] lowercase inline-flex items-center">
                  suitoholic<span className="text-xs sm:text-sm font-sans font-bold text-[#8C5A28] -mt-4 ml-1 select-none">™</span>
                </span>
                <span className="block text-[11px] sm:text-xs font-semibold tracking-[0.3em] text-[#8C5A28] uppercase mt-1">
                  BESPOKE SARTORIAL ATELIER • ESTD. 2003
                </span>
              </Link>
            </div>

            <p className="text-sm sm:text-base text-[#46303D] leading-relaxed font-normal">
              Dedicated to the timeless art of bespoke tailoring. Every garment is handcrafted with master precision from pure Egyptian Giza 140s twill, Sea Island cotton, and Super 150s Merino wool.
            </p>

            {/* Direct Studio Concierge Box */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D6C5B5]/60">
                <span className="text-xs font-bold tracking-[0.2em] text-[#8C5A28] uppercase flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#8C5A28]" />
                  <span>Direct Concierge</span>
                </span>
                <span className="inline-flex items-center text-[#1B4332] text-[11px] font-bold gap-1.5 bg-[#2D6A4F]/15 px-2.5 py-0.5 rounded-full border border-[#2D6A4F]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse" />
                  Live Reception
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#38222E]">
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-[#8C5A28] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-[#6C5562] font-bold block">Hotline</span>
                    <strong className="text-sm sm:text-base text-[#2C1822]">+91 (0) 129 415 8890</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-[#8C5A28] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-[#6C5562] font-bold block">Private Appointments</span>
                    <a href="mailto:support@suitoholic.com" className="text-sm text-[#2C1822] font-bold hover:text-[#8C5A28] transition-colors">
                      support@suitoholic.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock size={16} className="text-[#8C5A28] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-[#6C5562] font-bold block">Studio Hours</span>
                    <span className="text-xs font-medium text-[#46303D]">10:00 AM – 8:30 PM (Mon – Sat)</span>
                  </div>
                </div>
              </div>

              <Link
                href="/custom-shirt"
                className="w-full bg-[#2C1822] hover:bg-[#8C5A28] text-white text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl transition-all duration-300 text-center uppercase flex items-center justify-center gap-2 shadow-sm group"
              >
                <span>BOOK 3D SARTORIAL FITTING</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Column 2: Customer Service (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <h3 className="text-xl sm:text-2xl font-bold text-[#3B222E] tracking-tight pb-2 border-b border-[#D6C5B5]">
              Customer Service
            </h3>
            <ul className="space-y-3 sm:space-y-3.5 text-[15px] sm:text-[16px] text-[#422B36] font-medium">
              <li>
                <Link href="/contact" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                  <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                  <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Return/Exchange</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                  <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                  <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Shipping Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/fabric-care" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                  <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Fabric Care</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                  <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                  <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Secure Payment (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-8 sm:space-y-10">
            {/* Company Links */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#3B222E] tracking-tight pb-2 border-b border-[#D6C5B5]">
                Company
              </h3>
              <ul className="space-y-3 sm:space-y-3.5 text-[15px] sm:text-[16px] text-[#422B36] font-medium">
                <li>
                  <Link href="/about" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                    <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>Why Suitoholic</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                    <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                    <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>Affiliate Marketing</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#8C5A28] hover:translate-x-1 transition-all flex items-center gap-1 group">
                    <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>Blog</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Secure Payment */}
            <div className="space-y-3.5 sm:space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-lg sm:text-xl font-bold text-[#3B222E] tracking-tight">
                  Secure Payment
                </h4>
                <div className="flex items-center space-x-1 text-[11px] font-bold text-[#2D6A4F]">
                  <Lock size={12} className="shrink-0" />
                  <span>256-Bit SSL</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Visa */}
                <div className="h-8.5 px-3 bg-white rounded-lg border border-[#D0BFB0] flex items-center justify-center shadow-xs hover:border-[#8C5A28] transition-colors" title="Visa">
                  <svg className="h-4 w-auto" viewBox="0 0 48 16" fill="none">
                    <path d="M19.14 0.68L12.55 15.32H8.22L5.03 3.86C4.83 3.08 4.67 2.8 4.07 2.47C3.1 1.95 1.45 1.47 0 1.15L0.1 0.68H7.13C8.03 0.68 8.84 1.28 9.03 2.31L10.77 11.5L14.99 0.68H19.14ZM36.03 10.45C36.05 6.47 30.5 6.25 30.54 4.47C30.55 3.93 31.07 3.35 32.22 3.2C32.79 3.12 34.36 3.07 36.08 3.86L36.77 0.67C35.83 0.33 34.62 0 33.1 0C29.06 0 26.22 2.15 26.2 5.22C26.17 7.5 28.21 8.78 29.77 9.54C31.37 10.32 31.91 10.82 31.9 11.51C31.89 12.57 30.63 13.04 29.46 13.06C27.4 13.09 26.2 12.5 25.26 12.06L24.54 15.42C25.5 15.86 27.27 16.24 29.1 16.27C33.39 16.27 36.01 14.15 36.03 10.45ZM46.66 15.32H50.33L47.14 0.68H43.76C42.99 0.68 42.34 1.12 42.06 1.79L35.92 15.32H40.26L41.12 12.94H46.42L46.66 15.32ZM42.32 9.62L44.5 3.65L45.75 9.62H42.32ZM25.04 0.68L21.68 15.32H17.56L20.92 0.68H25.04Z" fill="#1A1F71"/>
                  </svg>
                </div>

                {/* Paytm */}
                <div className="h-8.5 px-3 bg-white rounded-lg border border-[#D0BFB0] flex items-center justify-center shadow-xs hover:border-[#8C5A28] transition-colors" title="Paytm">
                  <span className="font-black text-[13px] tracking-tight leading-none flex items-center">
                    <span className="text-[#002970]">pay</span>
                    <span className="text-[#00BAF2]">tm</span>
                  </span>
                </div>

                {/* Mastercard */}
                <div className="h-8.5 px-3 bg-white rounded-lg border border-[#D0BFB0] flex items-center justify-center shadow-xs hover:border-[#8C5A28] transition-colors" title="Mastercard">
                  <svg className="h-5 w-auto" viewBox="0 0 32 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#EB001B"/>
                    <circle cx="22" cy="10" r="10" fill="#F79E1B"/>
                    <path d="M16 3.12C18.15 4.87 19.5 7.49 19.5 10.45C19.5 13.41 18.15 16.03 16 17.78C13.85 16.03 12.5 13.41 12.5 10.45C12.5 7.49 13.85 4.87 16 3.12Z" fill="#FF5F00"/>
                  </svg>
                </div>

                {/* American Express */}
                <div className="h-8.5 px-2.5 bg-white rounded-lg border border-[#D0BFB0] flex items-center justify-center shadow-xs hover:border-[#8C5A28] transition-colors" title="American Express">
                  <svg className="h-4.5 w-auto" viewBox="0 0 32 16" fill="none">
                    <rect width="32" height="16" rx="2" fill="#006FCF"/>
                    <text x="2" y="11.5" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.5">AMEX</text>
                  </svg>
                </div>

                {/* UPI */}
                <div className="h-8.5 px-3 bg-white rounded-lg border border-[#D0BFB0] flex items-center justify-center shadow-xs hover:border-[#8C5A28] transition-colors" title="UPI">
                  <svg className="h-4.5 w-auto" viewBox="0 0 36 16" fill="none">
                    <path d="M3.5 1.5L9.5 8L3.5 14.5L0 8L3.5 1.5Z" fill="#097938"/>
                    <path d="M7 1.5L13 8L7 14.5L3.5 8L7 1.5Z" fill="#F47920"/>
                    <text x="14.5" y="12.5" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#0C2340" letterSpacing="0.5">UPI</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Follow Us & Office Address (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-8 sm:space-y-10">
            {/* Follow Us */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#3B222E] tracking-tight pb-2 border-b border-[#D6C5B5]">
                Follow Us
              </h3>
              <div className="flex items-center space-x-3.5">
                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[#523340]/30 hover:border-[#3B222E] bg-white/80 hover:bg-[#3B222E] flex items-center justify-center text-[#3B222E] hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[#523340]/30 hover:border-[#3B222E] bg-white/80 hover:bg-[#3B222E] flex items-center justify-center text-[#3B222E] hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                  </svg>
                </a>

                {/* Pinterest */}
                <a 
                  href="https://pinterest.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[#523340]/30 hover:border-[#3B222E] bg-white/80 hover:bg-[#3B222E] flex items-center justify-center text-[#3B222E] hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.747-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[#523340]/30 hover:border-[#3B222E] bg-white/80 hover:bg-[#3B222E] flex items-center justify-center text-[#3B222E] hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Office Address Card */}
            <div className="space-y-3.5 pt-1">
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-[#8C5A28]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#3B222E] tracking-tight">
                  Office Address
                </h3>
              </div>
              
              <div className="bg-white/65 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-[#D6C5B5] shadow-xs space-y-2.5">
                <address className="not-italic text-[14px] sm:text-[15px] text-[#422B36] font-medium leading-relaxed">
                  <strong className="text-[#2C1822] block font-semibold">Suitoholic Bespoke Flagship Studio</strong>
                  Shop No. 3, Sco-17,<br />
                  HUDA Staff Colony, Sector 16,<br />
                  Faridabad, Haryana 121002, India
                </address>

                <div className="pt-2 border-t border-[#D6C5B5]/60 flex items-center justify-between text-xs font-bold text-[#8C5A28]">
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Get Directions</span>
                    <ExternalLink size={12} />
                  </a>
                  <span className="text-[#5A434F] font-normal">Sector 16 Metro Station Nearby</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ATELIER SALON REGIONAL NETWORK BAR                                     */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full bg-[#DDCFC0]/60 border-t border-b border-[#D0BFB0] py-4 px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[13px] font-medium text-[#46303D]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-6">
            <span className="font-bold text-[#2C1822] uppercase tracking-wider text-[11px] sm:text-xs">
              Atelier Regional Network:
            </span>
            <span className="flex items-center gap-1.5 text-[#38222E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C5A28]" />
              <strong>Faridabad</strong> (Flagship Atelier)
            </span>
            <span className="hidden md:inline text-[#B59C86]">•</span>
            <span className="flex items-center gap-1.5 text-[#38222E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C5A28]" />
              <strong>New Delhi</strong> (Private Salon)
            </span>
            <span className="hidden md:inline text-[#B59C86]">•</span>
            <span className="flex items-center gap-1.5 text-[#38222E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C5A28]" />
              <strong>Mumbai</strong> (Trunk Show Suite)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-[#2C1822]">
            <Globe size={14} className="text-[#8C5A28]" />
            <span>Shipping Across 48+ Countries</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM COPYRIGHT, REGION & BACK TO TOP STRIP                          */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full bg-[#D4C4B3] border-t border-[#C7B5A3] py-6 px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="max-w-[1680px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#3E2833] font-medium">
          
          {/* Copyright & Estd Note */}
          <div className="text-center md:text-left flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>© 2003–{new Date().getFullYear()}</span>
            <span className="font-bold text-[#2C1822] tracking-wide uppercase">SUITOHOLIC ATELIER.</span>
            <span>All rights reserved.</span>
            <span className="hidden sm:inline text-[#8C5A28]">•</span>
            <span className="hidden sm:inline text-xs text-[#5C4553]">Handcrafted with Savile Row precision.</span>
          </div>

          {/* Quick Legal Links & Smooth Back to Top */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/privacy" className="hover:text-[#8C5A28] transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#8C5A28] transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-[#8C5A28] transition-colors">Shipping</Link>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 bg-[#2C1822] hover:bg-[#8C5A28] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer group"
            >
              <span>TOP</span>
              <ArrowUp size={12} className="transform group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}

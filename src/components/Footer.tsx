"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Clock, MapPin, ArrowUp, ExternalLink } from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";

const SOCIAL_ICON_PATHS: Record<string, string> = {
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  facebook: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z",
  pinterest: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.747-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z",
  youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
};

function renderSocialIcon(platform: string) {
  const d = SOCIAL_ICON_PATHS[(platform || "").toLowerCase()];
  if (!d) return <ExternalLink size={16} />;
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}

const PAYMENT_BADGE_CLASS = "h-7 px-2.5 bg-white rounded-md border border-[#D0BFB0] flex items-center justify-center shadow-xs";

function renderPaymentBadge(brand: string, title: string) {
  switch ((brand || "").toLowerCase()) {
    case "visa":
      return (
        <div className={PAYMENT_BADGE_CLASS} title={title}>
          <svg className="h-3.5 w-auto" viewBox="0 0 48 16" fill="none">
            <path d="M19.14 0.68L12.55 15.32H8.22L5.03 3.86C4.83 3.08 4.67 2.8 4.07 2.47C3.1 1.95 1.45 1.47 0 1.15L0.1 0.68H7.13C8.03 0.68 8.84 1.28 9.03 2.31L10.77 11.5L14.99 0.68H19.14ZM36.03 10.45C36.05 6.47 30.5 6.25 30.54 4.47C30.55 3.93 31.07 3.35 32.22 3.2C32.79 3.12 34.36 3.07 36.08 3.86L36.77 0.67C35.83 0.33 34.62 0 33.1 0C29.06 0 26.22 2.15 26.2 5.22C26.17 7.5 28.21 8.78 29.77 9.54C31.37 10.32 31.91 10.82 31.9 11.51C31.89 12.57 30.63 13.04 29.46 13.06C27.4 13.09 26.2 12.5 25.26 12.06L24.54 15.42C25.5 15.86 27.27 16.24 29.1 16.27C33.39 16.27 36.01 14.15 36.03 10.45ZM46.66 15.32H50.33L47.14 0.68H43.76C42.99 0.68 42.34 1.12 42.06 1.79L35.92 15.32H40.26L41.12 12.94H46.42L46.66 15.32ZM42.32 9.62L44.5 3.65L45.75 9.62H42.32ZM25.04 0.68L21.68 15.32H17.56L20.92 0.68H25.04Z" fill="#1A1F71" />
          </svg>
        </div>
      );
    case "paytm":
      return (
        <div className={PAYMENT_BADGE_CLASS} title={title}>
          <span className="font-extrabold text-[12px] tracking-tight leading-none flex items-center">
            <span className="text-[#002970]">pay</span>
            <span className="text-[#00BAF2]">tm</span>
          </span>
        </div>
      );
    case "mastercard":
      return (
        <div className={PAYMENT_BADGE_CLASS} title={title}>
          <svg className="h-4.5 w-auto" viewBox="0 0 32 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#EB001B" />
            <circle cx="22" cy="10" r="10" fill="#F79E1B" />
            <path d="M16 3.12C18.15 4.87 19.5 7.49 19.5 10.45C19.5 13.41 18.15 16.03 16 17.78C13.85 16.03 12.5 13.41 12.5 10.45C12.5 7.49 13.85 4.87 16 3.12Z" fill="#FF5F00" />
          </svg>
        </div>
      );
    case "amex":
      return (
        <div className="h-7 px-2 bg-white rounded-md border border-[#D0BFB0] flex items-center justify-center shadow-xs" title={title}>
          <svg className="h-4 w-auto" viewBox="0 0 32 16" fill="none">
            <rect width="32" height="16" rx="2" fill="#006FCF" />
            <text x="2" y="11.5" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.5">AMEX</text>
          </svg>
        </div>
      );
    case "upi":
      return (
        <div className={PAYMENT_BADGE_CLASS} title={title}>
          <svg className="h-4 w-auto" viewBox="0 0 36 16" fill="none">
            <path d="M3.5 1.5L9.5 8L3.5 14.5L0 8L3.5 1.5Z" fill="#097938" />
            <path d="M7 1.5L13 8L7 14.5L3.5 8L7 1.5Z" fill="#F47920" />
            <text x="14.5" y="12.5" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#0C2340" letterSpacing="0.5">UPI</text>
          </svg>
        </div>
      );
    default:
      return (
        <div className={PAYMENT_BADGE_CLASS} title={title}>
          <span className="font-bold text-[11px] tracking-tight leading-none text-[#2C1822]">{title}</span>
        </div>
      );
  }
}

export default function Footer() {
  const c = useContent("footer");
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#FAF5EF] via-[#F2E7DC] to-[#E3D4C4] text-[#36212B] rounded-t-[28px] sm:rounded-t-[42px] lg:rounded-t-[52px] border-t border-[#D8C5B3] font-sans antialiased relative z-20 shadow-[0_-20px_50px_rgba(20,17,14,0.06)] overflow-hidden mt-8 sm:mt-12 select-none flex flex-col justify-between">

      {/* Background Architectural Subtle Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.045] flex items-center justify-center select-none overflow-hidden px-4">
        <span className="font-serif-luxury text-[10vw] sm:text-[11vw] lg:text-[11.5vw] xl:text-[150px] 2xl:text-[180px] font-black tracking-[0.08em] sm:tracking-[0.1em] text-[#14110E] uppercase whitespace-nowrap leading-none text-center select-none">
          {c.watermarkText}
        </span>
      </div>



      {/* ========================================================================= */}
      {/* 2. MAIN TIER: REFINED 4-COLUMN EDITORIAL DIRECTORY                        */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-16 flex-1">
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-start">

          {/* Column 1: BRAND LEGACY & DIRECT CONCIERGE (Placed First on Far Left) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            <div>
              <Link href={c.logoHref || "/"} className="inline-block group">
                <Image
                  src={c.logo}
                  alt={c.logoAlt}
                  width={280}
                  height={250}
                  className="h-16 sm:h-20 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
                />
              </Link>
            </div>

            {/* Direct Studio Concierge */}
            <div className="space-y-3 pt-2 border-t border-[#D6C5B5]/60">
              <div className="pb-1 border-b border-[#D6C5B5]/40">
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#8C5A28] uppercase block">
                  {c.conciergeHeading}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#38222E]">
                <div className="flex items-center space-x-2.5">
                  <Phone size={14} className="text-[#8C5A28] shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase text-[#7D6874] font-medium block">{c.phoneLabel}</span>
                    <span className="text-xs sm:text-[13px] text-[#2C1822] font-medium">{c.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Mail size={14} className="text-[#8C5A28] shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase text-[#7D6874] font-medium block">{c.emailLabel}</span>
                    <a href={"mailto:" + c.email} className="text-xs sm:text-[13px] text-[#2C1822] font-medium hover:text-[#8C5A28] transition-colors">
                      {c.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Clock size={14} className="text-[#8C5A28] shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase text-[#7D6874] font-medium block">{c.hoursLabel}</span>
                    <span className="text-[11px] sm:text-xs font-normal text-[#5A4552]">{c.hours}</span>
                  </div>
                </div>

                {c.address && (
                  <div className="flex items-center space-x-2.5">
                    <MapPin size={14} className="text-[#8C5A28] shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase text-[#7D6874] font-medium block">{c.addressLabel}</span>
                      <span className="text-[11px] sm:text-xs font-normal text-[#5A4552] whitespace-pre-line">{c.address}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Column 2: Customer Service (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-[#3B222E] tracking-tight pb-1.5 border-b border-[#D6C5B5]">
              {c.customerServiceHeading}
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-[13px] text-[#4A3842] font-normal">
              {(c.customerServiceLinks ?? []).map((link, i) => (
                <li key={i}>
                  <Link href={link.href || "/"} className="hover:text-[#8C5A28] hover:translate-x-0.5 transition-all flex items-center gap-1 group">
                    <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-[#3B222E] tracking-tight pb-1.5 border-b border-[#D6C5B5]">
              {c.companyHeading}
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-[13px] text-[#4A3842] font-normal">
              {(c.companyLinks ?? []).map((link, i) => (
                <li key={i}>
                  <Link href={link.href || "/"} className="hover:text-[#8C5A28] hover:translate-x-0.5 transition-all flex items-center gap-1 group">
                    <span className="text-[#8C5A28] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: FOLLOW US (Rightmost Column) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-[#3B222E] tracking-tight pb-1.5 border-b border-[#D6C5B5]">
              {c.followHeading}
            </h3>
            <p className="text-xs text-[#5A4552] leading-relaxed">
              {c.followText}
            </p>
            <div className="flex items-center space-x-2.5 pt-1">
              {(c.socialLinks ?? []).map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#523340]/30 hover:border-[#3B222E] bg-white/80 hover:bg-[#3B222E] flex items-center justify-center text-[#3B222E] hover:text-white transition-all duration-300 shadow-xs hover:scale-105"
                  aria-label={social.label}
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM TIER: HORIZONTAL SECURE PAYMENT STRIP & COPYRIGHT / LEGAL LINKS */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full bg-[#D4C4B3] border-t border-[#C7B5A3] py-5 px-5 sm:px-8 lg:px-12 xl:px-16 space-y-4">

        {/* Horizontal Secure Payment Strip */}
        <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-3 pb-4 border-b border-[#C7B5A3]/80">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#2C1822] tracking-wide uppercase">
              {c.securePaymentLabel}
            </span>

          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 justify-center md:justify-end">
            {(c.paymentMethods ?? []).map((method, i) => (
              <React.Fragment key={i}>{renderPaymentBadge(method.brand, method.title)}</React.Fragment>
            ))}
          </div>
        </div>

        {/* Copyright & Estd Note & Legal Links */}
        <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-[#4E3A47] font-normal">

          {/* Copyright */}
          <div className="text-center md:text-left flex flex-wrap items-center justify-center md:justify-start gap-1.5">
            <span suppressHydrationWarning>{(c.copyrightText || "").replace("{year}", String(new Date().getFullYear()))}</span>
            <span className="font-semibold text-[#2C1822] tracking-wide uppercase">{c.copyrightBrand}</span>
            <span>{c.rightsText}</span>
            <span className="hidden sm:inline text-[#8C5A28]">•</span>
            <span className="hidden sm:inline text-[11px] text-[#6B5663]">{c.craftNote}</span>
          </div>

          {/* Quick Legal Links & Smooth Back to Top */}
          <div className="flex items-center space-x-3.5 sm:space-x-5">
            {(c.legalLinks ?? []).map((link, i) => (
              <React.Fragment key={i}>
                <Link href={link.href || "/"} className="hover:text-[#8C5A28] transition-colors">{link.label}</Link>
                <span>•</span>
              </React.Fragment>
            ))}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 bg-[#2C1822] hover:bg-[#8C5A28] text-white px-3 py-1 rounded-full text-[11px] font-semibold transition-all shadow-xs cursor-pointer group"
            >
              <span>{c.backToTopLabel}</span>
              <ArrowUp size={11} className="transform group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>

    </footer>
  );
}

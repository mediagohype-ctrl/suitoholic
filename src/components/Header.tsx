"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";

interface HeaderProps {
  activeTab?: string;
  cartCount?: number;
}

export default function Header({ activeTab, cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Highlight tab only if explicitly specified or matching the current route
  const currentTab = activeTab !== undefined 
    ? activeTab 
    : pathname === "/shop" || pathname?.startsWith("/shop/") 
      ? "shop" 
      : pathname === "/custom-shirt" 
        ? "custom-fit" 
        : "";

  return (
    <header className="w-full sticky top-0 z-50 transition-all">
      {/* Top Announcement Bar matching Master Reference */}
      <div className="hidden sm:block bg-[#120F0D] text-[#D8C7B5] border-b border-[#2A231D] py-1.5 px-4 sm:px-8 text-[10px] tracking-[0.18em] uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Welcome to Suitoholic</span>
            <span className="text-[#8C6D47]">|</span>
            <span className="text-[#AFA293]">Tailored for You.</span>
          </div>
          <div className="flex items-center space-x-4 text-[#AFA293]">
            <Link href="/#store" className="hover:text-white transition-colors">Store Locator</Link>
            <span className="text-[#8C6D47]">|</span>
            <Link href="/#help" className="hover:text-white transition-colors">Help</Link>
            <span className="text-[#8C6D47]">|</span>
            <Link href="/#track" className="hover:text-white transition-colors">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#D7C2AD]/95 backdrop-blur-md border-b border-[#C5AF9A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between relative">

          {/* Mobile: Hamburger Button (Left) */}
          <div className="flex items-center lg:hidden z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#1F1C18] hover:text-[#9E774C] transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={23} strokeWidth={1.75} /> : <Menu size={23} strokeWidth={1.75} />}
            </button>
          </div>

          {/* Brand Logo & Tagline (Perfect Center on Mobile, Left on Desktop) */}
          <div className="flex items-center lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0 z-0">
            <Link href="/" className="flex flex-col items-center group">
              <span className="font-brand-logo text-xl sm:text-2xl font-bold tracking-tight text-[#14110E] group-hover:text-[#9E774C] transition-colors leading-none lowercase inline-flex items-center">
                suitoholic<span className="text-[9px] sm:text-[10px] font-sans font-bold text-[#14110E] group-hover:text-[#9E774C] -mt-2 ml-0.5 select-none">™</span>
              </span>
              <div className="flex items-center gap-2 mt-1.5 w-full justify-center">
                <div className="h-[1px] w-6 sm:w-8 bg-[#9E774C]" />
                <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-[#9E774C] font-semibold uppercase whitespace-nowrap">
                  ESTD. 2003
                </span>
                <div className="h-[1px] w-6 sm:w-8 bg-[#9E774C]" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center space-x-9 text-[11px] font-semibold tracking-[0.2em] uppercase">
            <Link
              href="/shop"
              className={`transition-colors duration-200 pb-1 relative ${currentTab === "shop"
                ? "text-[#14110E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E774C]"
                : "text-[#554A3F] hover:text-[#14110E]"
                }`}
            >
              SHOP
            </Link>
            <Link
              href="/custom-shirt"
              className={`transition-colors duration-200 pb-1 relative ${currentTab === "custom-fit"
                ? "text-[#14110E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E774C]"
                : "text-[#554A3F] hover:text-[#14110E]"
                }`}
            >
              CUSTOM FIT
            </Link>
            <Link
              href="/#fabrics"
              className="text-[#554A3F] hover:text-[#14110E] transition-colors pb-1"
            >
              FABRICS
            </Link>
            <Link
              href="/#about"
              className="text-[#554A3F] hover:text-[#14110E] transition-colors pb-1"
            >
              ABOUT US
            </Link>
            <Link
              href="/#contact"
              className="text-[#554A3F] hover:text-[#14110E] transition-colors pb-1"
            >
              CONTACT
            </Link>
          </nav>

          {/* Header Right Icons */}
          <div className="flex items-center space-x-3.5 sm:space-x-5 text-[#14110E]">
            <button className="p-1 hover:text-[#9E774C] transition-colors" aria-label="Search">
              <Search size={19} strokeWidth={1.75} />
            </button>
            <button className="p-1 hover:text-[#9E774C] transition-colors" aria-label="Account">
              <User size={19} strokeWidth={1.75} />
            </button>
            <Link href="/custom-shirt" className="relative p-1 hover:text-[#9E774C] transition-colors" aria-label="Shopping Cart">
              <ShoppingBag size={19} strokeWidth={1.75} />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#9E774C] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#EAD3BD] border-b border-[#DAC2AB] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#1F1C18] py-2 border-b border-[#DAC2AB]/60"
          >
            SHOP
          </Link>
          <Link
            href="/custom-shirt"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#8A6E48] py-2 border-b border-[#DAC2AB]/60"
          >
            CUSTOM FIT CONFIGURATOR
          </Link>
          <Link
            href="/#fabrics"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#1F1C18] py-2 border-b border-[#DAC2AB]/60"
          >
            FABRICS
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#1F1C18] py-2 border-b border-[#DAC2AB]/60"
          >
            ABOUT US
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#1F1C18] py-2"
          >
            CONTACT
          </Link>

          <div className="pt-2 border-t border-[#DAC2AB]/60 flex justify-between text-[10px] tracking-wider text-[#5C5247] uppercase">
            <Link href="/#store" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1F1C18] transition-colors">
              Store Locator
            </Link>
            <Link href="/#help" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1F1C18] transition-colors">
              Help
            </Link>
            <Link href="/#track" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1F1C18] transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";

interface HeaderProps {
  activeTab?: string;
  cartCount?: number;
}

export default function Header({ activeTab, cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Highlight tab only if explicitly specified or matching the current route
  const currentTab = activeTab !== undefined 
    ? activeTab 
    : pathname === "/shop" || pathname?.startsWith("/shop/") 
      ? "shop" 
      : pathname === "/custom-shirt" 
        ? "custom-fit" 
        : pathname === "/fabrics" || pathname?.startsWith("/fabrics")
          ? "fabrics"
          : pathname === "/about" || pathname?.startsWith("/about")
            ? "about"
            : "";

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        scrolled
          ? "fixed top-0 left-0 right-0 shadow-md bg-white/95 backdrop-blur-md"
          : "absolute top-0 left-0 right-0 bg-transparent"
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="hidden sm:block bg-[#14110E] text-[#EFE5D8] border-b border-[#2A231D] py-1.5 px-4 sm:px-8 text-[10px] font-medium tracking-[0.18em] uppercase z-50 relative shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Welcome to Suitoholic</span>
            <span className="text-[#C5A069]">|</span>
            <span className="text-[#D8C6B3]">Tailored for You.</span>
          </div>
          <div className="flex items-center space-x-4 text-[#D8C6B3]">
            <Link href="/#store" className="hover:text-white transition-colors">Store Locator</Link>
            <span className="text-[#C5A069]">|</span>
            <Link href="/#help" className="hover:text-white transition-colors">Help</Link>
            <span className="text-[#C5A069]">|</span>
            <Link href="/#track" className="hover:text-white transition-colors">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between relative">

          {/* Mobile: Hamburger Button (Left) */}
          <div className="flex items-center lg:hidden z-10 w-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#1F1C18] hover:text-[#9E774C] transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </button>
          </div>

          {/* Brand Logo & Tagline (Centered on Mobile, Left-aligned on Desktop) */}
          <div className="flex items-center justify-center lg:justify-start flex-1 lg:flex-none z-10">
            <Link href="/" className="flex items-center group py-0.5 select-none">
              <Image
                src="/logo/suitoholic-logo-dark.png"
                alt="Suitoholic"
                width={280}
                height={220}
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
                priority
              />
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
              href="/fabrics"
              className={`transition-colors duration-200 pb-1 relative ${currentTab === "fabrics"
                ? "text-[#14110E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E774C]"
                : "text-[#554A3F] hover:text-[#14110E]"
                }`}
            >
              FABRICS
            </Link>
            <Link
              href="/about"
              className={`transition-colors duration-200 pb-1 relative ${currentTab === "about"
                ? "text-[#14110E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E774C]"
                : "text-[#554A3F] hover:text-[#14110E]"
                }`}
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
          <div className="flex items-center space-x-2.5 sm:space-x-4 text-[#14110E] z-10">
            <button className="p-1 hover:text-[#9E774C] transition-colors" aria-label="Search">
              <Search size={18} strokeWidth={1.75} />
            </button>
            <button className="p-1 hover:text-[#9E774C] transition-colors" aria-label="Account">
              <User size={18} strokeWidth={1.75} />
            </button>
            <Link href="/custom-shirt" className="relative p-1 hover:text-[#9E774C] transition-colors" aria-label="Shopping Cart">
              <ShoppingBag size={18} strokeWidth={1.75} />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#9E774C] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
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
            href="/fabrics"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#1F1C18] py-2 border-b border-[#DAC2AB]/60"
          >
            FABRICS
          </Link>
          <Link
            href="/about"
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

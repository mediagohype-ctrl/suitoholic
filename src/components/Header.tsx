"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";

interface HeaderProps {
  activeTab?: string;
  cartCount?: number;
}

export default function Header({ activeTab = "home", cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-[#EAE3D2]/95 backdrop-blur-md border-b border-[#D3C9B4]/60 transition-all">
      {/* Top Notice Bar */}
      <div className="bg-[#1F1C18] text-[#EAE3D2] text-[11px] font-medium py-1.5 px-4 tracking-widest uppercase flex justify-between items-center">
        <div className="container mx-auto flex justify-between items-center px-4">
          <p>Welcome to Suitoholic &nbsp;|&nbsp; Tailored for You.</p>
          <div className="hidden sm:flex space-x-6 text-[10px] tracking-wider text-[#C5A069]">
            <span className="hover:underline cursor-pointer">Store Locator</span>
            <span className="hover:underline cursor-pointer">Help</span>
            <span className="hover:underline cursor-pointer">Track Order</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#1F1C18] hover:text-[#9E7D52] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full border border-[#9E7D52]/40 shadow-sm bg-white">
            <Image 
              src="/logo.jpg" 
              alt="Suitoholic Logo" 
              fill 
              className="object-cover"
              priority 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-[#1F1C18] uppercase leading-none">
              SUITOHOLIC<span className="text-xs align-top font-sans font-normal text-[#9E7D52]">™</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#9E7D52] font-semibold uppercase mt-0.5">
              ESTD. 2003
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest">
          <Link 
            href="/#shop-categories" 
            className={`transition-colors duration-200 pb-1 border-b-2 ${
              activeTab === "shop" 
                ? "text-[#1F1C18] border-[#9E7D52]" 
                : "text-[#5C554C] border-transparent hover:text-[#9E7D52]"
            }`}
          >
            SHOP
          </Link>
          <Link 
            href="/custom-shirt" 
            className={`transition-colors duration-200 pb-1 border-b-2 ${
              activeTab === "custom-fit" 
                ? "text-[#1F1C18] border-[#9E7D52]" 
                : "text-[#5C554C] border-transparent hover:text-[#9E7D52]"
            }`}
          >
            CUSTOM FIT
          </Link>
          <Link 
            href="/#fabrics" 
            className="text-[#5C554C] hover:text-[#9E7D52] transition-colors pb-1 border-b-2 border-transparent"
          >
            FABRICS
          </Link>
          <Link 
            href="/#about" 
            className="text-[#5C554C] hover:text-[#9E7D52] transition-colors pb-1 border-b-2 border-transparent"
          >
            ABOUT US
          </Link>
          <Link 
            href="/#contact" 
            className="text-[#5C554C] hover:text-[#9E7D52] transition-colors pb-1 border-b-2 border-transparent"
          >
            CONTACT
          </Link>
        </nav>

        {/* Header Right Icons */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          <button className="p-2 text-[#1F1C18] hover:text-[#9E7D52] transition-colors" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="hidden sm:block p-2 text-[#1F1C18] hover:text-[#9E7D52] transition-colors" aria-label="Account">
            <User size={20} />
          </button>
          <Link href="/custom-shirt" className="relative p-2 text-[#1F1C18] hover:text-[#9E7D52] transition-colors" aria-label="Shopping Cart">
            <ShoppingBag size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-[#9E7D52] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#EAE3D2] border-b border-[#D3C9B4] px-6 py-4 space-y-3 animate-in slide-in-from-top duration-300">
          <Link 
            href="/#shop-categories" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold tracking-wider text-[#1F1C18] py-2 border-b border-[#D3C9B4]/40"
          >
            SHOP SHIRTS
          </Link>
          <Link 
            href="/custom-shirt" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold tracking-wider text-[#9E7D52] py-2 border-b border-[#D3C9B4]/40"
          >
            CUSTOM FIT CONFIGURATOR
          </Link>
          <Link 
            href="/#fabrics" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold tracking-wider text-[#1F1C18] py-2 border-b border-[#D3C9B4]/40"
          >
            FABRICS
          </Link>
          <Link 
            href="/#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold tracking-wider text-[#1F1C18] py-2 border-b border-[#D3C9B4]/40"
          >
            ABOUT US
          </Link>
          <Link 
            href="/#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold tracking-wider text-[#1F1C18] py-2"
          >
            CONTACT
          </Link>
        </div>
      )}
    </header>
  );
}

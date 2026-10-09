"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";
import { useCart } from "@/context/CartProvider";

interface HeaderProps {
  /** Legacy tab id ("shop", "custom-fit", "fabrics", "about") forcing the highlighted link. */
  activeTab?: string;
  /** Overrides the live bag count (normally read from the bag). */
  cartCount?: number;
}

const TAB_PATHS: Record<string, string> = {
  shop: "/shop",
  "custom-fit": "/custom-shirt",
  fabrics: "/fabrics",
  about: "/about",
  contact: "/contact",
};

export default function Header({ activeTab, cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const c = useContent("header");
  const { itemCount } = useCart();
  const bagCount = cartCount ?? itemCount;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update background style state
      setScrolled(currentScrollY > 20);

      // Hide navbar on scroll down, reveal on scroll up
      if (currentScrollY > 80 && currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Highlight the link for the explicit tab, or the one whose path matches the current route
  const activePath = activeTab !== undefined ? TAB_PATHS[activeTab] ?? "" : pathname ?? "";
  const isActive = (href: string) =>
    !href.includes("#") && href !== "/" && (activePath === href || activePath.startsWith(`${href}/`));

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled
          ? "shadow-md bg-white/95 backdrop-blur-md"
          : "bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none"
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="hidden sm:block bg-[#14110E] text-[#EFE5D8] border-b border-[#2A231D] py-1.5 px-4 sm:px-8 text-[10px] font-medium tracking-[0.18em] uppercase z-50 relative shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{c.announcementWelcome}</span>
            <span className="text-[#C5A069]">|</span>
            <span className="text-[#D8C6B3]">{c.announcementTagline}</span>
          </div>
          <div className="flex items-center space-x-4 text-[#D8C6B3]">
            {c.topLinks.map((link, i) => (
              <React.Fragment key={`${link.href}-${i}`}>
                {i > 0 && <span className="text-[#C5A069]">|</span>}
                <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
              </React.Fragment>
            ))}
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
                src={c.logo}
                alt={c.logoAlt}
                unoptimized={/^https?:/.test(c.logo)}
                width={280}
                height={220}
                priority
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center space-x-9 text-[11px] font-semibold tracking-[0.2em] uppercase">
            {c.navLinks.map((link, i) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                className={`transition-colors duration-200 pb-1 relative ${isActive(link.href)
                  ? "text-[#14110E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E774C]"
                  : "text-[#554A3F] hover:text-[#14110E]"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Header Right Icons */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 text-[#14110E] z-10">
            <button className="p-1 hover:text-[#9E774C] transition-colors" aria-label="Search">
              <Search size={18} strokeWidth={1.75} />
            </button>
            <button className="p-1 hover:text-[#9E774C] transition-colors" aria-label="Account">
              <User size={18} strokeWidth={1.75} />
            </button>
            <Link href="/cart" className="relative p-1 hover:text-[#9E774C] transition-colors" aria-label={`Shopping bag, ${bagCount} items`}>
              <ShoppingBag size={18} strokeWidth={1.75} />
              <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-0.5 bg-[#9E774C] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {bagCount > 99 ? "99+" : bagCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {c.navLinks.map((link, i) => (
            <Link
              key={`${link.href}-${i}`}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs font-bold tracking-[0.2em] uppercase py-2 ${i < c.navLinks.length - 1 ? "border-b border-[#DAC2AB]/60" : ""} ${link.highlight ? "text-[#8A6E48]" : "text-[#1F1C18]"}`}
            >
              {link.mobileLabel || link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-[#DAC2AB]/60 flex justify-between text-[10px] tracking-wider text-[#5C5247] uppercase">
            {c.topLinks.map((link, i) => (
              <Link key={`${link.href}-${i}`} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1F1C18] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

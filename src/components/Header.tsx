"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import { useCart } from "@/context/CartProvider";

interface HeaderProps {
  /** Legacy tab id ("shop", "custom-fit", "fabrics", "about") forcing the highlighted link. */
  activeTab?: string;
  /** Overrides the live bag count (normally read from the bag). */
  cartCount?: number;
  /** Force solid opaque background (essential when pages have dark hero banners) */
  forceSolid?: boolean;
}

const TAB_PATHS: Record<string, string> = {
  shop: "/shop",
  "custom-fit": "/custom-shirt",
  fabrics: "/fabrics",
  about: "/about",
  contact: "/contact",
};

export default function Header({ activeTab, cartCount, forceSolid = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const c = useContent("header");
  const { categories } = useCatalog();
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
        scrolled || forceSolid
          ? "shadow-sm bg-white/95 backdrop-blur-md"
          : "bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none"
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="hidden sm:block bg-[#000000] text-[#FFFFFF] border-b border-[#222222] py-1.5 px-4 sm:px-8 text-[10px] font-medium tracking-[0.18em] uppercase z-50 relative shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{c.announcementWelcome}</span>
            <span className="text-[#666666]">|</span>
            <span className="text-[#CCCCCC]">{c.announcementTagline}</span>
          </div>
          <div className="flex items-center space-x-4 text-[#CCCCCC]">
            {c.topLinks.map((link, i) => (
              <React.Fragment key={`${link.href}-${i}`}>
                {i > 0 && <span className="text-[#666666]">|</span>}
                <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${
        scrolled || forceSolid
          ? "bg-white/95 backdrop-blur-md border-b border-[#E5E3DD]"
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between relative">

          {/* Mobile: Hamburger Button (Left) */}
          <div className="flex items-center lg:hidden z-10 w-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#1F1C18] hover:text-[#9E774C] transition-colors focus:outline-none cursor-pointer"
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
            {c.navLinks.map((link, i) => {
              const isShop = link.href === "/shop" || link.label.toLowerCase() === "shop";
              const active = isActive(link.href);

              if (isShop) {
                return (
                  <div key={`${link.href}-${i}`} className="relative group py-2">
                    <Link
                      href={link.href}
                      className={`transition-colors duration-200 pb-1 flex items-center gap-1.5 relative ${
                        active
                          ? "text-[#000000] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#000000]"
                          : "text-[#666666] hover:text-[#000000]"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={12}
                        className="transition-transform duration-200 group-hover:rotate-180 text-[#666666]"
                      />
                    </Link>

                    {/* Shop Category Hover Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                      <div className="w-[340px] bg-white border border-[#E5E3DD] rounded-2xl shadow-2xl p-4 space-y-1.5 backdrop-blur-md">
                        <div className="px-3 py-1.5 border-b border-[#E5E3DD] flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-[0.22em] text-[#000000] uppercase">
                            SHOP CATEGORIES
                          </span>
                          <span className="text-[9px] text-[#666666] tracking-wider uppercase font-semibold">
                            SUITOHOLIC
                          </span>
                        </div>

                        <div className="pt-1.5 space-y-1">
                          <Link
                            href="/shop"
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-[0.16em] uppercase text-[#000000] hover:bg-[#000000] hover:text-white transition-all group/item"
                          >
                            <span>ALL SHIRTS &amp; PRODUCTS</span>
                            <span className="text-xs text-[#666666] group-hover/item:text-white transition-colors">→</span>
                          </Link>

                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/shop?category=${cat.id}`}
                              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#444444] hover:text-[#000000] hover:bg-[#F5F4F0] transition-all group/item"
                            >
                              <span className="truncate pr-2">{cat.title}</span>
                              <span className="text-xs text-[#666666] opacity-0 group-hover/item:opacity-100 transition-opacity">→</span>
                            </Link>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#E5E3DD] mt-2 px-3 flex items-center justify-between text-[9.5px] font-bold tracking-[0.18em] uppercase text-[#666666]">
                          <span>BESPOKE ATELIER</span>
                          <Link href="/custom-shirt" className="text-[#000000] hover:underline transition-colors">
                            CUSTOM CONFIGURATOR →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href}
                  className={`transition-colors duration-200 pb-1 relative ${
                    active
                      ? "text-[#000000] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#000000]"
                      : "text-[#666666] hover:text-[#000000]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Right Icons */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 text-[#000000] z-10">
            <button className="p-1 hover:text-[#555555] transition-colors cursor-pointer" aria-label="Search">
              <Search size={18} strokeWidth={1.75} />
            </button>
            <button className="p-1 hover:text-[#555555] transition-colors cursor-pointer" aria-label="Account">
              <User size={18} strokeWidth={1.75} />
            </button>
            <Link href="/cart" className="relative p-1 hover:text-[#555555] transition-colors" aria-label={`Shopping bag, ${bagCount} items`}>
              <ShoppingBag size={18} strokeWidth={1.75} />
              <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-0.5 bg-[#000000] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {bagCount > 99 ? "99+" : bagCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {c.navLinks.map((link, i) => {
            const isShop = link.href === "/shop" || link.label.toLowerCase() === "shop";
            if (isShop) {
              return (
                <div key={`${link.href}-${i}`} className="border-b border-[#DAC2AB]/60 pb-2">
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-bold tracking-[0.2em] uppercase py-2 text-[#1F1C18]"
                  >
                    {link.mobileLabel || link.label}
                  </Link>
                  <div className="pl-3 space-y-1 pt-1">
                    <Link
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[11px] font-bold tracking-wider uppercase text-[#14110E] py-1"
                    >
                      • ALL PRODUCTS
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-[11px] font-semibold tracking-wider uppercase text-[#6E5D4F] hover:text-[#14110E] py-1"
                      >
                        • {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-xs font-bold tracking-[0.2em] uppercase py-2 ${
                  i < c.navLinks.length - 1 ? "border-b border-[#DAC2AB]/60" : ""
                } ${link.highlight ? "text-[#8A6E48]" : "text-[#1F1C18]"}`}
              >
                {link.mobileLabel || link.label}
              </Link>
            );
          })}

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

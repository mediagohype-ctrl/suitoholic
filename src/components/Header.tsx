"use client";

import React, { useState, useEffect, useSyncExternalStore } from"react";
import Link from"next/link";
import Image from"next/image";
import { usePathname } from"next/navigation";
import { Search, User, ShoppingBag, Menu, X, ChevronDown, Heart, Package, MapPin, LogOut, LogIn } from"lucide-react";
import { useCatalog, useContent } from"@/context/SiteDataProvider";
import { useCart } from"@/context/CartProvider";
import { useWishlist } from"@/context/WishlistProvider";
import CartDrawer from"@/components/CartDrawer";
import SearchModal from"@/components/SearchModal";

interface HeaderProps {
  /** Legacy tab id ("shop","custom-fit","fabrics","about") forcing the highlighted link. */
  activeTab?: string;
  /** Overrides the live bag count (normally read from the bag). */
  cartCount?: number;
  /** Force solid opaque background (essential when pages have dark hero banners) */
  forceSolid?: boolean;
}

const TAB_PATHS: Record<string, string> = {
  shop:"/shop","custom-fit":"/custom-shirt",
  fabrics:"/fabrics",
  about:"/about",
  contact:"/contact",
};

const emptySubscribe = () => () => {};

export default function Header({ activeTab, cartCount, forceSolid = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const pathname = usePathname();
  const c = useContent("header");
  const { categories } = useCatalog();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const bagCount = isClient ? (cartCount ?? itemCount) : (cartCount ?? 0);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("suitoholic_client_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.isLoggedIn) {
            setCurrentUser(parsed);
            return;
          }
        }
        setCurrentUser(null);
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("suitoholic_auth_change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("suitoholic_auth_change", syncUser);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("suitoholic_client_user");
      window.dispatchEvent(new Event("suitoholic_auth_change"));
    } catch {}
    setCurrentUser(null);
    window.location.href ="/account";
  };

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
  const activePath = activeTab !== undefined ? TAB_PATHS[activeTab] ??"" : pathname ??"";
  const isActive = (href: string) =>
    !href.includes("#") && href !=="/" && (activePath === href || activePath.startsWith(`${href}/`));

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-transform duration-300 ease-in-out ${
          visible ?"translate-y-0" :"-translate-y-full"
        } ${
          scrolled || forceSolid
            ?"shadow-sm bg-white/95 backdrop-blur-md border-b border-[#E5E3DD]"
            :"bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none"
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
          ?"bg-white/95 backdrop-blur-md border-b border-[#E5E3DD]"
          :"bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-1.5 sm:py-2 flex items-center justify-between relative">

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
            <Link href="/" className="flex items-center group py-0.5">
              <Image
                src={c.logo}
                alt={c.logoAlt}
                unoptimized={/^https?:/.test(c.logo)}
                width={280}
                height={220}
                priority
                className="h-10 sm:h-12 lg:h-[52px] w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center space-x-9 text-[11px] font-semibold tracking-[0.2em] uppercase">
            {c.navLinks.map((link, i) => {
              const isShop = link.href ==="/shop" || link.label.toLowerCase() ==="shop";
              const active = isActive(link.href);

              if (isShop) {
                return (
                  <div key={`${link.href}-${i}`} className="relative group py-2">
                    <Link
                      href={link.href}
                      className={`transition-colors duration-200 pb-1 flex items-center gap-1.5 relative ${
                        active
                          ?"text-[#000000] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#000000]"
                          :"text-[#666666] hover:text-[#000000]"
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
                      ?"text-[#000000] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#000000]"
                      :"text-[#666666] hover:text-[#000000]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3.5 text-[#000000] z-10">
            {/* Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-1 hover:text-[#726254] transition-colors cursor-pointer"
              aria-label="Search Collection"
            >
              <Search size={18} strokeWidth={1.75} />
            </button>

            {/* Wishlist Link (Opens Full Page) */}
            <Link
              href="/wishlist"
              className="relative p-1 hover:text-[#726254] transition-colors cursor-pointer"
              aria-label={`Wishlist, ${wishlistCount} saved items`}
            >
              <Heart size={18} strokeWidth={1.75} className={wishlistCount > 0 ?"fill-black text-black" :""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-0.5 bg-[#8C7355] text-white text-[8.5px] font-sans font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Client Concierge / Account Dropdown (Flipkart style) */}
            <div className="relative group py-1.5">
              <Link
                href="/account"
                className="p-1 hover:text-[#726254] transition-colors cursor-pointer flex items-center"
                aria-label="Client Concierge Account"
              >
                <User size={18} strokeWidth={1.75} />
              </Link>

              {/* Floating Dropdown Menu (Centered right underneath Account icon) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                <div className="w-[280px] bg-white border border-[#E5E3DD] rounded-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.14)] py-2.5 backdrop-blur-md overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
                  {/* Header Title */}
                  <div className="px-5 py-3.5 border-b border-[#F0EFEB]">
                    <h4 className="text-[15px] font-bold text-black tracking-tight font-sans">
                      Your Account
                    </h4>
                    {currentUser ? (
                      <p className="text-xs text-[#666666] font-sans truncate mt-0.5">
                        {currentUser.name}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#888888] mt-0.5 leading-tight font-sans">
                        Sign in for bespoke atelier access
                      </p>
                    )}
                  </div>

                  {/* Marked Sections: My Profile, Orders, Saved Addresses, Wishlist */}
                  <div className="py-1.5 font-sans">
                    <Link
                      href="/account"
                      className="flex items-center gap-3.5 px-5 py-3 text-[14px] font-medium text-[#222222] hover:bg-[#F7F6F3] hover:text-black transition-colors group/item"
                    >
                      <User size={18} strokeWidth={1.75} className="text-[#555555] group-hover/item:text-black shrink-0" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/orders"
                      className="flex items-center gap-3.5 px-5 py-3 text-[14px] font-medium text-[#222222] hover:bg-[#F7F6F3] hover:text-black transition-colors group/item"
                    >
                      <Package size={18} strokeWidth={1.75} className="text-[#555555] group-hover/item:text-black shrink-0" />
                      <span>Orders</span>
                    </Link>

                    <Link
                      href="/saved-addresses"
                      className="flex items-center gap-3.5 px-5 py-3 text-[14px] font-medium text-[#222222] hover:bg-[#F7F6F3] hover:text-black transition-colors group/item"
                    >
                      <MapPin size={18} strokeWidth={1.75} className="text-[#555555] group-hover/item:text-black shrink-0" />
                      <span>Saved Addresses</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between px-5 py-3 text-[14px] font-medium text-[#222222] hover:bg-[#F7F6F3] hover:text-black transition-colors group/item"
                    >
                      <div className="flex items-center gap-3.5">
                        <Heart size={18} strokeWidth={1.75} className="text-[#555555] group-hover/item:text-black shrink-0" />
                        <span>Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="min-w-[20px] h-[20px] px-1.5 text-[11px] font-sans font-bold rounded-full bg-[#8C7355] text-white flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#F0EFEB] my-1.5" />

                  {/* Marked Section: Logout (or Sign In if guest) */}
                  {currentUser ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3.5 px-5 py-3 text-[14px] font-medium text-[#D32F2F] hover:bg-red-50/70 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link
                      href="/account"
                      className="flex items-center gap-3.5 px-5 py-3 text-[14px] font-semibold text-[#14110E] hover:bg-[#F7F6F3] transition-colors"
                    >
                      <LogIn size={18} strokeWidth={1.75} className="shrink-0" />
                      <span>Log In / Sign Up</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Shopping Bag Link (Opens Full Page) */}
            <Link
              href="/cart"
              className="relative p-1 hover:text-[#726254] transition-colors cursor-pointer"
              aria-label={`Shopping bag, ${bagCount} items`}
              suppressHydrationWarning
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              <span
                className="absolute -top-1 -right-1.5 min-w-4 h-4 px-0.5 bg-[#000000] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs"
                suppressHydrationWarning
              >
                {bagCount > 99 ?"99+" : bagCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {c.navLinks.map((link, i) => {
            const isShop = link.href ==="/shop" || link.label.toLowerCase() ==="shop";
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
                  i < c.navLinks.length - 1 ?"border-b border-[#DAC2AB]/60" :""
                } ${link.highlight ?"text-[#8A6E48]" :"text-[#1F1C18]"}`}
              >
                {link.mobileLabel || link.label}
              </Link>
            );
          })}

          {/* Mobile: Your Account (Flipkart Style Marked Options) */}
          <div className="pt-3 border-t border-[#DAC2AB]/60">
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#8C7355] uppercase mb-2">
              Your Account {currentUser ? `• ${currentUser.name}` :""}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E3DD] text-[#1F1C18]"
              >
                <User size={14} className="shrink-0" />
                <span className="truncate">My Profile</span>
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E3DD] text-[#1F1C18]"
              >
                <Package size={14} className="shrink-0" />
                <span className="truncate">Orders</span>
              </Link>
              <Link
                href="/saved-addresses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E3DD] text-[#1F1C18]"
              >
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">Addresses</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E3DD] text-[#1F1C18]"
              >
                <Heart size={14} className="shrink-0" />
                <span className="truncate">Wishlist {wishlistCount > 0 ? `(${wishlistCount})` :""}</span>
              </Link>
            </div>
            {currentUser ? (
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLogout(e);
                }}
                className="mt-2 w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-black text-white text-xs font-semibold uppercase tracking-wider"
              >
                <LogIn size={14} />
                <span>Log In / Sign Up</span>
              </Link>
            )}
          </div>

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

    {/* Slide-over Mini Cart Drawer */}
    <CartDrawer />

    {/* Global Live Search Overlay */}
    <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
  </>
  );
}

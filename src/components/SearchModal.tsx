"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useCatalog } from "@/context/SiteDataProvider";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { products, categories } = useCatalog();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // Curated collections list matching user reference screenshot
  const curatedCollections = [
    {
      id: "winter_2026",
      title: "Winter Collection 2026",
      href: "/shop?category=formal_shirts",
      image: "/new_shirts/shirt_21.jpg",
    },
    {
      id: "formal_stripes",
      title: "Bengal Stripe Collection",
      href: "/shop?category=formal_stripes",
      image: "/new_shirts/shirt_20.jpg",
    },
    {
      id: "formal_bespoke",
      title: "Bespoke Cutaway & Twill Shirts",
      href: "/shop?category=formal_bespoke",
      image: "/new_shirts/shirt_14.jpg",
    },
    {
      id: "fabrics",
      title: "Pure Bespoke Fabrics & Linens",
      href: "/fabrics",
      image: "/fabric_cat_suits_sets.jpg",
    },
    {
      id: "trousers",
      title: "Handcrafted Luxury Trousers",
      href: "/shop?category=trousers",
      image: "/pant_charcoal_dress.jpg",
    },
  ];

  const trimmed = query.trim().toLowerCase();

  const matchingProducts = trimmed
    ? products
        .filter((p) => {
          const name = p.name?.toLowerCase() ?? "";
          const desc = p.description?.toLowerCase() ?? "";
          const fabric = p.fabric?.toLowerCase() ?? "";
          const cat = p.category?.toLowerCase() ?? "";
          return (
            name.includes(trimmed) ||
            desc.includes(trimmed) ||
            fabric.includes(trimmed) ||
            cat.includes(trimmed)
          );
        })
        .slice(0, 10)
    : [];

  const matchingCollections = trimmed
    ? curatedCollections.filter((c) => c.title.toLowerCase().includes(trimmed))
    : [];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex flex-col justify-start select-none animate-in fade-in duration-200"
    >
      {/* Dark semi-transparent backdrop below header panel */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Top Slide-Down White Search Panel matching reference design */}
      <div
        className="relative z-10 w-full bg-white shadow-2xl border-b border-[#E5E3DD] animate-in slide-in-from-top duration-300 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-6">
          {/* Top Search Input Row with wide pill and close button */}
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search here...."
                className="w-full bg-[#EFEFEF] hover:bg-[#EAEAEA] focus:bg-[#F3F3F3] text-black text-sm sm:text-base px-5 py-3 sm:py-3.5 rounded-full outline-none pr-12 placeholder:text-[#999999] transition-colors"
              />
              <Search
                size={18}
                className="absolute right-4.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-black hover:text-[#8C7355] transition-colors cursor-pointer shrink-0"
              aria-label="Close Search"
            >
              <X size={24} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Content Body: Collections list (default) OR Live Search Results */}
          <div className="mt-6 overflow-y-auto max-h-[62vh] pr-1">
            {trimmed === "" ? (
              /* Default State: Collections list as in user reference screenshot */
              <div className="max-w-2xl">
                <h3 className="text-base sm:text-lg font-bold text-black tracking-tight mb-3">
                  Collections
                </h3>
                <div className="flex flex-col">
                  {curatedCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={col.href}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 border-b border-[#ECEAE5] hover:bg-[#FAF9F6] px-2 rounded-xl transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#ECEAE5] shrink-0 border border-[#E5E3DD]">
                        <img
                          src={col.image}
                          alt={col.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-sm sm:text-[15px] font-medium text-black group-hover:text-[#8C7355] transition-colors">
                        {col.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              /* Search Results State */
              <div className="space-y-6">
                {matchingCollections.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
                      Matching Collections
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {matchingCollections.map((col) => (
                        <Link
                          key={col.id}
                          href={col.href}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E5E3DD] hover:border-black hover:bg-[#FAF9F6] transition-all group"
                        >
                          <img
                            src={col.image}
                            alt={col.title}
                            className="w-10 h-10 rounded-md object-cover shrink-0"
                          />
                          <span className="text-xs font-semibold text-black group-hover:text-[#8C7355]">
                            {col.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#888888]">
                      Products ({matchingProducts.length})
                    </h4>
                    {matchingProducts.length > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          router.push(`/shop`);
                        }}
                        className="text-xs text-[#8C7355] hover:text-black font-semibold underline cursor-pointer"
                      >
                        View all in Shop
                      </button>
                    )}
                  </div>

                  {matchingProducts.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <p className="text-sm text-[#666666]">
                        No tailored shirts found matching &ldquo;<span className="font-semibold text-black">{query}</span>&rdquo;
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push("/shop");
                        }}
                        className="inline-flex items-center gap-2 mt-2 px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <span>Browse Entire Catalog</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {matchingProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E3DD] hover:border-black hover:bg-[#FAF9F6] transition-all group cursor-pointer shadow-2xs"
                        >
                          <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#ECEAE5] shrink-0 border border-[#E5E3DD]">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-xs sm:text-sm text-black truncate group-hover:text-[#8C7355] transition-colors">
                              {p.name}
                            </h5>
                            <span className="text-[10px] text-[#666666] block truncate">
                              {p.fabric}
                            </span>
                            <span className="text-xs font-bold text-black mt-1 block">
                              {p.price}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles, Tag } from "lucide-react";
import { useCatalog } from "@/context/SiteDataProvider";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_TAGS = [
  "Sky Blue",
  "Bengal Stripe",
  "Crisp White",
  "Espresso",
  "Normandy Linen",
  "French Cuff",
  "Egyptian Giza",
  "Royal Oxford",
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { products } = useCatalog();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
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

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredProducts = trimmed
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
        .slice(0, 8)
    : [];

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  };

  const handleSearchTag = (tag: string) => {
    setQuery(tag);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-10 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden mt-6 sm:mt-12 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E5E3DD] bg-[#FAF8F5]">
          <Search size={22} className="text-[#666666] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bespoke shirts, luxury fabrics, weaves..."
            className="flex-1 bg-transparent text-base sm:text-lg text-black outline-none placeholder:text-[#999999] font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 hover:bg-neutral-200 rounded-full text-[#666666] cursor-pointer"
              aria-label="Clear query"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-200 rounded-full text-black transition-colors cursor-pointer shrink-0"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Body Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Trending Searches */}
          {!trimmed && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#726254]">
                <Sparkles size={13} />
                <span>POPULAR SEARCHES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSearchTag(tag)}
                    className="px-4 py-2 bg-[#F5F4F0] hover:bg-black hover:text-white border border-[#E5E3DD] rounded-full text-xs font-medium text-black transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {trimmed && filteredProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#666666]">
                <span className="font-semibold text-black uppercase tracking-wider">
                  MATCHING BESPOKE SHIRTS ({filteredProducts.length})
                </span>
                <span className="text-[11px]">Click to view details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p.slug)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-[#E5E3DD] hover:border-black/50 hover:bg-[#FAF8F5] transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#ECEAE5] shrink-0 border border-[#E5E3DD]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#726254] block truncate">
                        {p.category.replace("_", " ")}
                      </span>
                      <h4 className="font-serif-luxury text-sm font-bold uppercase text-black group-hover:text-neutral-800 truncate leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-xs font-bold text-black">{p.price}</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-[#999999] group-hover:text-black group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Fallback */}
          {trimmed && filteredProducts.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <p className="font-serif-luxury text-xl text-black">
                No bespoke shirts found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#666666] max-w-sm mx-auto">
                Try searching for fabric weaves like &ldquo;Oxford&rdquo;, &ldquo;Linen&rdquo;, &ldquo;Stripes&rdquo; or explore all shirts in our collection.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/shop");
                }}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <span>VIEW FULL SHOP</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

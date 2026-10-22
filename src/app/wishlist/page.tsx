"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import ModernProductCard from "@/components/ModernProductCard";
import { useWishlist } from "@/context/WishlistProvider";
import { useCatalog } from "@/context/SiteDataProvider";

export default function WishlistPage() {
  const { wishlistIds, clearWishlist } = useWishlist();
  const { products } = useCatalog();

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <PageShell eyebrow="PERSONAL COLLECTION" title="SAVED PIECES">
      {savedProducts.length === 0 ? (
        <div className="max-w-md mx-auto text-center bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center mx-auto text-[#8C7355]">
            <Heart size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl uppercase text-black font-bold">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              Explore our bespoke atelier shirts, heritage Italian weaves, and tailored fits to save your personal favourites.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-sm hover:shadow active:scale-98"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white border border-[#E5E3DD] rounded-2xl md:rounded-full px-5 sm:px-6 py-3.5 flex flex-wrap gap-3 items-center justify-between text-[11px] text-[#666666] font-medium shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-black uppercase tracking-wider">
                {savedProducts.length} {savedProducts.length === 1 ? "PIECE SAVED" : "PIECES SAVED"}
              </span>
              <span className="text-black/30">•</span>
              <span className="text-[#666666]">Saved to your private atelier browser storage</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C7355] hover:text-black font-semibold uppercase tracking-wider underline cursor-pointer transition-colors"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>

              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F5F4F0] hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Full-Page Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full items-stretch">
            {savedProducts.map((product) => (
              <div key={product.id} className="w-full">
                <ModernProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

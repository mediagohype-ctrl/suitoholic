"use client";

import React from "react";
import Link from "next/link";
import { X, Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistProvider";
import { useCatalog } from "@/context/SiteDataProvider";

export default function WishlistDrawer() {
  const { wishlistIds, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { products } = useCatalog();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#ECEAE5] border-l border-[#E5E3DD] shadow-2xl flex flex-col text-black">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 bg-white border-b border-[#E5E3DD]">
            <div className="flex items-center gap-2.5">
              <Heart size={18} className="fill-black text-black" />
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold uppercase tracking-wider text-black">
                SAVED PIECES ({savedProducts.length})
              </h2>
            </div>
            <button
              onClick={closeWishlist}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-[#666666] hover:text-black transition-colors cursor-pointer"
              aria-label="Close Wishlist"
            >
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
            {savedProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E5E3DD] flex items-center justify-center mx-auto shadow-xs">
                  <Heart size={26} className="text-[#888888]" />
                </div>
                <h3 className="font-serif-luxury text-xl text-black uppercase">No saved garments</h3>
                <p className="text-xs text-[#666666] max-w-xs mx-auto">
                  Click the heart icon on any bespoke dress shirt to save it for your next fitting.
                </p>
                <Link
                  href="/shop"
                  onClick={closeWishlist}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-[0.16em] rounded-full hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>BROWSE COLLECTION</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              savedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#E5E3DD] rounded-2xl p-4 shadow-2xs flex gap-3.5 relative group"
                >
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={closeWishlist}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#F5F4F0] border border-[#E5E3DD] shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={closeWishlist}
                          className="font-serif-luxury text-sm font-bold uppercase text-black hover:text-[#726254] transition-colors truncate block"
                        >
                          {p.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(p.id)}
                          className="text-[#999999] hover:text-red-600 transition-colors cursor-pointer p-0.5"
                          title="Remove from saved"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <span className="text-[10px] text-[#666666] block mt-0.5 truncate">{p.fabric}</span>
                      <p className="font-bold text-sm text-black mt-2">{p.price}</p>
                    </div>

                    <Link
                      href={`/product/${p.slug}`}
                      onClick={closeWishlist}
                      className="mt-2 w-full py-2 bg-black hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ShoppingBag size={12} />
                      <span>VIEW & CUSTOMIZE</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

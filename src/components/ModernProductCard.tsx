"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { ProductItem } from "@/data/products";
import { useWishlist } from "@/context/WishlistProvider";
import { useCustomizer } from "@/context/CustomizerModalProvider";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";

interface ModernProductCardProps {
  product: ProductItem;
  isWideSpan?: boolean;
}

export default function ModernProductCard({ product, isWideSpan }: ModernProductCardProps) {
  const { openCustomizer } = useCustomizer();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  // Resolved 100% color-matched full ghost mannequin shirt revealed on hover
  const hoverFullShirt = getMatchingFullShirtImage(product);

  // Use gallery if available, or fallback to main image (clean any localhost URLs)
  const rawImages = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];
  const cleanImages = rawImages.map(img => img ? img.replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\/?/i, "/") : "");

  // Hover image: Full shirt ghost mannequin view or secondary gallery angle
  const hoverImage = hoverFullShirt || (cleanImages.length > 1 ? cleanImages[1] : null);

  // When isWideSpan is true, prefer the secondary lookbook image if available for dramatic editorial width
  const wideMainImage = isWideSpan && (hoverImage || (cleanImages.length > 1 ? cleanImages[1] : null));
  const activeMainImage = wideMainImage || cleanImages[0];
  const activeHoverImage = wideMainImage ? cleanImages[0] : hoverImage;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group flex flex-col w-full">
      {/* Upper Rectangular Image Container - Full Column Width with 254:350 Aspect Ratio (or 508:350 for Wide Span) */}
      <div className={`relative w-full ${isWideSpan ? "aspect-[508/350]" : "aspect-[254/350]"} rounded-none overflow-hidden bg-[#ECEAE5] transition-all duration-300`}>
        {/* Main Product Image Container */}
        <Link href={`/product/${product.slug}`} className="block relative w-full h-full overflow-hidden">
          {/* Default Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeMainImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-102"
            loading="lazy"
          />

          {/* Hover Image */}
          {activeHoverImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={activeHoverImage}
              alt={`${product.name} Full Look`}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-102"
              loading="lazy"
            />
          )}


        </Link>

        {/* Top Right: Floating Outline Heart Wishlist Icon */}
        <button
          onClick={handleToggleSave}
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 p-1 transition-transform duration-200 hover:scale-115 active:scale-90 cursor-pointer"
        >
          <Heart
            size={19}
            strokeWidth={1.5}
            className={`drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-colors ${
              isSaved
                ? "text-red-500 fill-red-500"
                : "text-white fill-transparent stroke-white"
            }`}
          />
        </button>
      </div>

      {/* Lower Details Strip: Product Name & Price on Left, Plus Icon on Right */}
      <div className="mt-2.5 sm:mt-3 flex items-start justify-between gap-2 px-1 pb-2">
        {/* Left: Product Name & Price */}
        <div className="min-w-0 flex-1 space-y-1">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 
              title={product.name}
              className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.16em] text-black hover:opacity-75 uppercase transition-opacity truncate leading-snug"
            >
              {product.name}
            </h3>
          </Link>
          <div className="font-sans text-[10px] sm:text-[11px] font-medium text-[#666666] tracking-[0.08em] uppercase">
            RS. {product.rawPrice ? product.rawPrice.toLocaleString("en-IN") : product.price.replace("₹", "").trim()}
          </div>
        </div>

        {/* Right: Plus Button -> Opens Customizer Modal */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openCustomizer(product);
          }}
          aria-label={`Customise ${product.name}`}
          title="Customise Shirt (6 Steps)"
          className="shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5"
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

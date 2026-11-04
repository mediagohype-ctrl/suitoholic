"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { ProductItem } from "@/data/products";
import { useWishlist } from "@/context/WishlistProvider";
import { useCustomizer } from "@/context/CustomizerModalProvider";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";

interface ModernProductCardProps {
  product: ProductItem;
}

export default function ModernProductCard({ product }: ModernProductCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const { openCustomizer } = useCustomizer();
  const [isAdded, setIsAdded] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  // Resolved 100% color-matched full ghost mannequin shirt revealed on hover
  const hoverFullShirt = getMatchingFullShirtImage(product);

  // Use gallery if available, or fallback to main image (clean any localhost URLs)
  const rawImages = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];
  const images = rawImages.map(img => img ? img.replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\/?/i, "/") : "");

  const totalDots = Math.min(images.length, 3);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group flex flex-col w-full">
      {/* Upper Rounded Image Container - Matching Home Page Aspect Ratio & Style */}
      <div className="relative w-full aspect-[3/4.2] rounded-[9px] overflow-hidden bg-white border border-[#E5E3DD] shadow-2xs transition-all duration-300 group-hover:shadow-md">
        
        {/* Main Product Image Container */}
        <Link href={`/product/${product.slug}`} className="block relative w-full h-full overflow-hidden">
          {/* Default Product Image (Collar & Fabric Close-Up) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[currentImgIndex % images.length]}
            alt={product.name}
            className={`w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
              hoverFullShirt ? "group-hover:opacity-0" : ""
            }`}
            loading="lazy"
          />

          {/* Matching Tailored Full Shirt Revealed on Hover (Exact Same Color & Fabric) */}
          {hoverFullShirt && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hoverFullShirt}
              alt={`${product.name} Full Tailored Shirt`}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </Link>


        {/* Top Right Heart Wishlist Icon - Only Visible On Hover */}
        <button
          onClick={handleToggleSave}
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-xs transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-md cursor-pointer flex items-center justify-center opacity-100"
        >
          <Heart
            size={16}
            className={
              isSaved
                ? "text-red-500 fill-red-500"
                : "text-white fill-white/10 stroke-white stroke-[2]"
            }
          />
        </button>

        {/* Navigation Arrows (visible on hover / touch) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              type="button"
              aria-label="Previous image"
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handleNextImage}
              type="button"
              aria-label="Next image"
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Bottom Center 3 Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-1.5 pointer-events-none">
          {Array.from({ length: totalDots }).map((_, i) => {
            const isActive = (currentImgIndex % totalDots) === i;
            return (
              <span
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-1.5 h-1.5 bg-white shadow-xs"
                    : "w-1 h-1 bg-white/45"
                }`}
              />
            );
          })}
        </div>

        {/* Subtle Gradient Overlay at bottom for contrast */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Lower Details Strip: Product Name & Price on Left, Plus Icon on Right */}
      <div className="mt-2.5 sm:mt-3 flex items-start justify-between gap-2 px-0.5">
        
        {/* Left: Product Name & Price matching reference layout */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 
              title={product.name}
              className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.18em] text-black hover:opacity-75 uppercase transition-opacity truncate leading-snug"
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

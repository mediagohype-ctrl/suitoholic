"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { ProductItem } from "@/data/products";

interface ModernProductCardProps {
  product: ProductItem;
}

export default function ModernProductCard({ product }: ModernProductCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Use gallery if available, or fallback to main image
  const images = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];

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
    setIsSaved((prev) => !prev);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group flex flex-col w-full">
      {/* Upper Tall Rounded Image Container */}
      <div className="relative w-full aspect-[3/4.2] min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] xl:min-h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1E1914] shadow-sm transition-all duration-300 group-hover:shadow-md">
        
        {/* Main Product Image */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[currentImgIndex % images.length]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top Right Bookmark Ribbon Icon */}
        <button
          onClick={handleToggleSave}
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 drop-shadow-md"
        >
          <Bookmark
            size={18}
            className={
              isSaved
                ? "text-[#C5A069] fill-[#C5A069]"
                : "text-white fill-white/90 stroke-white/90"
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
      <div className="mt-2 sm:mt-2.5 flex items-start justify-between gap-2 px-0.5">
        
        {/* Left: Product Name & Price */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-[11.5px] sm:text-[13px] font-medium text-[#14110E] hover:text-[#7A5428] transition-colors truncate tracking-tight uppercase">
              {product.name}
            </h3>
          </Link>
          <div className="text-[11px] sm:text-[12px] font-medium text-[#4A3E33] tracking-normal">
            {product.price.replace("₹", "RS.")}
          </div>
        </div>

        {/* Right: Plus Button -> Redirects to Product Details Page */}
        <Link
          href={`/product/${product.slug}`}
          aria-label={`View details and customize ${product.name}`}
          title="Customize Fit & Product Details"
          className="shrink-0 p-1 text-[#14110E] hover:text-[#9E774C] transition-all hover:scale-125 active:scale-95 cursor-pointer mt-0.5"
        >
          <Plus size={16} className="stroke-[2]" />
        </Link>

      </div>
    </div>
  );
}

"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionCategory, ProductItem } from "@/data/products";
import ModernProductCard from "./ModernProductCard";

interface ModernCollectionSectionProps {
  collection: CollectionCategory;
  products: ProductItem[];
  headerTitle?: string;
  cardsPerView?: number;
}

const FALLBACK_FABRIC_ITEMS: ProductItem[] = [
  {
    id: 10,
    slug: "magenta-wine-royal-stripe",
    name: "MAGENTA WINE ROYAL STRIPE",
    category: "formal_shirts",
    price: "₹ 3,099",
    rawPrice: 3099,
    subtitle: "Deep Magenta & Wine Executive Pinstripe.",
    description: "Opulent wine pinstripes with high-sheen satin finish. Finished with Australian mother-of-pearl buttons.",
    fabric: "100% Egyptian Giza Sateen",
    threadCount: "140s / 2-Ply Royal Twill",
    image: "/new_shirts/shirt_16.jpg",
    gallery: ["/new_shirts/shirt_16.jpg", "/customizer/full_shirt_16.jpg"],
    rating: 5.0,
    reviewsCount: 68,
  },
  {
    id: 11,
    slug: "shadow-monochrome-stripe-formal",
    name: "SHADOW MONOCHROME STRIPE FORMAL",
    category: "formal_shirts",
    price: "₹ 2,799",
    rawPrice: 2799,
    subtitle: "Architectural Shadow Monochrome Pinstripe Weave.",
    description: "Subtle black and charcoal shadow pinstripes offering sharp authority under bespoke tailored jackets.",
    fabric: "100% Long-Staple Combed Cotton",
    threadCount: "130s / 2-Ply Poplin",
    image: "/new_shirts/shirt_23.jpg",
    gallery: ["/new_shirts/shirt_23.jpg", "/customizer/full_shirt_23.jpg"],
    rating: 4.9,
    reviewsCount: 94,
  },
  {
    id: 12,
    slug: "espresso-chocolate-bengal-stripe",
    name: "ESPRESSO CHOCOLATE BENGAL STRIPE",
    category: "formal_shirts",
    price: "₹ 2,899",
    rawPrice: 2899,
    subtitle: "Warm Espresso Chocolate & Ivory Bengal Stripe.",
    description: "Rich dark chocolate Bengal stripe weave offering exceptional drape and structured silhouette.",
    fabric: "100% Compact Supima Cotton",
    threadCount: "130s Luxury Weave",
    image: "/new_shirts/shirt_24.jpg",
    gallery: ["/new_shirts/shirt_24.jpg", "/customizer/full_shirt_24.jpg"],
    rating: 4.8,
    reviewsCount: 71,
  },
  {
    id: 13,
    slug: "steel-grey-royal-stripe-formal",
    name: "STEEL GREY ROYAL STRIPE FORMAL",
    category: "formal_shirts",
    price: "₹ 3,199",
    rawPrice: 3199,
    subtitle: "High-Contrast Steel Grey & Crisp White Banker Stripe.",
    description: "Masterwork banker stripe weave featuring crisp steel grey stripes on pure white ground.",
    fabric: "100% Egyptian Giza 140s Cotton",
    threadCount: "140s / 2-Ply Dobby Weave",
    image: "/new_shirts/shirt_25.jpg",
    gallery: ["/new_shirts/shirt_25.jpg", "/customizer/full_shirt_25.jpg"],
    rating: 5.0,
    reviewsCount: 156,
  },
];

export default function ModernCollectionSection({
  collection,
  products,
  headerTitle,
  cardsPerView,
}: ModernCollectionSectionProps) {
  const colId = collection.id || (collection as unknown as { key?: string })?.key;
  const isThreeCardMode =
    cardsPerView === 3 ||
    colId === "formal_bespoke" ||
    (headerTitle && headerTitle.toLowerCase().includes("fabric"));

  const displayProducts =
    products && products.length >= 3 ? products : FALLBACK_FABRIC_ITEMS;

  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    if (scrollLeft <= 10) {
      scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
    } else {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const step = (card?.offsetWidth ?? 340) + 20;
      scrollRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 15) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const step = (card?.offsetWidth ?? 340) + 20;
      scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  return (
    <section
      id={collection.id}
      className={`py-10 sm:py-14 lg:py-18 w-full max-w-[1720px] mx-auto relative z-10 flex flex-col justify-center select-none ${
        isThreeCardMode
          ? "px-6 sm:px-10 lg:px-16 xl:px-20"
          : "px-4 sm:px-6 lg:px-10 xl:px-14"
      }`}
    >
      {/* Centered Heading & Subtitle matching luxury scale */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold tracking-[0.14em] text-black uppercase leading-tight">
          {headerTitle || collection.title}
        </h2>
        {(collection.subtitle || (collection as unknown as { description?: string })?.description) && (
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-[17px] text-[#666666] font-normal leading-relaxed tracking-normal max-w-2xl">
            {collection.subtitle || (collection as unknown as { description?: string })?.description}
          </p>
        )}
      </div>

      {isThreeCardMode ? (
        /* ========================================================================= */
        /* EXACT SCREENSHOT FORMAT: 3 SQUARE CARDS WITH LABEL UNDERNEATH & SIDE NAV  */
        /* ========================================================================= */
        <div className="relative w-full">
          {/* Circular Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous fabric"
            className="absolute -left-4 sm:-left-7 lg:-left-11 xl:-left-13 top-[calc(50%-18px)] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} className="transform -translate-x-0.5" />
          </button>

          {/* Circular Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next fabric"
            className="absolute -right-4 sm:-right-7 lg:-right-11 xl:-right-13 top-[calc(50%-18px)] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={20} className="transform translate-x-0.5" />
          </button>

          {/* 3-Cards Row */}
          <div
            ref={scrollRef}
            className="flex items-start gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 px-0.5"
          >
            {displayProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group flex flex-col items-center cursor-pointer w-[82%] sm:w-[calc(50%-10px)] lg:w-[calc((100%-40px)/3)] shrink-0"
              >
                {/* Square Rounded Card Image Container with 9px border radius */}
                <div className="relative w-full aspect-square rounded-[9px] overflow-hidden bg-white border border-[#E5E3DD] shadow-xs group-hover:shadow-md transition-all duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                </div>

                {/* Sub-label placed directly UNDER card */}
                <span className="text-center font-bold text-[11px] sm:text-xs lg:text-[13px] tracking-[0.2em] text-black group-hover:opacity-75 uppercase transition-opacity pt-3.5 sm:pt-4 px-1 block leading-snug">
                  {product.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* STANDARD 4-COLUMN PRODUCT CARDS GRID                     */
        /* ======================================================== */
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full items-stretch">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="w-full">
                <ModernProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Centered VIEW ALL Button (Only for standard collections) */}
          <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12">
            <Link
              href={colId === "all" ? "/shop" : `/shop?category=${colId || "formal_bespoke"}`}
              className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white text-xs sm:text-[13px] font-bold tracking-[0.22em] px-10 sm:px-14 py-3 sm:py-3.5 rounded-full transition-all duration-300 uppercase shadow-sm hover:shadow-md active:scale-98"
            >
              VIEW ALL
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

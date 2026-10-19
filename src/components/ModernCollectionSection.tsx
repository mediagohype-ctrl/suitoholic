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
    id: 31,
    slug: "royal-dobby-weave-crisp-formal",
    name: "ROYAL DOBBY WEAVE",
    category: "formal_bespoke",
    price: "₹ 2,999",
    rawPrice: 2999,
    subtitle: "Micro Geometric Dobby Texture in Pure White.",
    description: "Intricate micro-geometric dobby structure with multidimensional depth.",
    fabric: "100% Egyptian Giza 140s Cotton",
    threadCount: "140s / 2-Ply Dobby Weave",
    image: "/new_shirts/shirt_4.jpg",
    gallery: ["/new_shirts/shirt_4.jpg"],
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    id: 32,
    slug: "french-cuff-noble-charcoal-formal",
    name: "NOBLE CHARCOAL TWILL",
    category: "formal_bespoke",
    price: "₹ 2,899",
    rawPrice: 2899,
    subtitle: "Rich Anthracite Charcoal Twill with French Cuffs.",
    description: "Dark, commanding, and impeccably sharp deep anthracite twill.",
    fabric: "100% Long-Staple Combed Cotton",
    threadCount: "130s / 2-Ply Heavy Twill",
    image: "/new_shirts/shirt_1.jpg",
    gallery: ["/new_shirts/shirt_1.jpg"],
    rating: 4.9,
    reviewsCount: 88,
  },
  {
    id: 33,
    slug: "milano-cutaway-sea-island-white",
    name: "SEA ISLAND WHITE",
    category: "formal_bespoke",
    price: "₹ 3,199",
    rawPrice: 3199,
    subtitle: "Rare West Indian Sea Island Cotton.",
    description: "The gold standard of luxury dress shirts. Silken touch and natural lustre.",
    fabric: "100% West Indian Sea Island Cotton",
    threadCount: "160s Ultra-Fine Poplin",
    image: "/new_shirts/shirt_2.jpg",
    gallery: ["/new_shirts/shirt_2.jpg"],
    rating: 5.0,
    reviewsCount: 164,
  },
  {
    id: 34,
    slug: "austrian-herringbone-sky-formal",
    name: "AUSTRIAN HERRINGBONE",
    category: "formal_bespoke",
    price: "₹ 2,899",
    rawPrice: 2899,
    subtitle: "Textured V-Weave Herringbone in Sky Blue.",
    description: "Subtle chevron herringbone weave offering exceptional drape.",
    fabric: "100% Austrian Alpine Cotton",
    threadCount: "120s / 2-Ply Herringbone",
    image: "/new_shirts/shirt_3.jpg",
    gallery: ["/new_shirts/shirt_3.jpg"],
    rating: 4.8,
    reviewsCount: 74,
  },
  {
    id: 35,
    slug: "monogrammed-satin-twill-dress-shirt",
    name: "SATIN TWILL MONOGRAM",
    category: "formal_bespoke",
    price: "₹ 3,299",
    rawPrice: 3299,
    subtitle: "High-Lustre Formal Satin Twill.",
    description: "Signature dress shirt featuring high-lustre satin twill weave.",
    fabric: "100% Extra-Long Staple Cotton",
    threadCount: "150s / 2-Ply Satin Twill",
    image: "/new_shirts/shirt_4.jpg",
    gallery: ["/new_shirts/shirt_4.jpg"],
    rating: 4.9,
    reviewsCount: 120,
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

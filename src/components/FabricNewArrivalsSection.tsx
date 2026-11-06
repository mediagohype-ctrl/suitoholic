"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import { useCustomizer } from "@/context/CustomizerModalProvider";
import { useWishlist } from "@/context/WishlistProvider";
import { useCatalog } from "@/context/SiteDataProvider";

export interface NewArrivalShirt {
  id: string;
  code: string;
  title: string;
  price: string;
  rawPrice: number;
  image: string;
  slug?: string;
  category?: string;
}

export const NEW_ARRIVALS_ITEMS: NewArrivalShirt[] = [
  {
    id: "na-sage-green",
    code: "SH-57",
    title: "SUITOHOLIC SAGE GREEN BENGAL STRIPED TWILL SHIRT",
    price: "RS. 2,800",
    rawPrice: 2800,
    image: "/api/media/23/whatsapp-image-2026-10-31-at-8-50-12-pm.jpeg",
    slug: "sage-green-bengal-striped-twill-shirt",
  },
  {
    id: "na-french-blue",
    code: "SH-77",
    title: "FRENCH BLUE BENGAL STRIPED TWILL SHIRT",
    price: "RS. 3,000",
    rawPrice: 3000,
    image: "/api/media/43/suitoholic-26-done-jpg.jpeg",
    slug: "french-blue-bengal-striped-twill-shirt",
  },
  {
    id: "na-mustard-ochre",
    code: "SH-78",
    title: "MUSTARD OCHRE BENGAL STRIPED TWILL SHIRT",
    price: "RS. 2,800",
    rawPrice: 2800,
    image: "/api/media/49/suitoholic-mustard-ochre-bengal-stripe.jpg",
    slug: "mustard-ochre-bengal-striped-twill-shirt",
  },
  {
    id: "na-berry-pink",
    code: "SH-59",
    title: "SUITOHOLIC BERRY PINK BENGAL STRIPED TWILL SHIRT",
    price: "RS. 2,800",
    rawPrice: 2800,
    image: "/api/media/25/whatsapp-image-2026-10-31-at-10-25-46-pm.jpeg",
    slug: "suitoholic-berry-pink-bengal-striped-twill-shirt",
  },
  {
    id: "na-navy-blue",
    code: "SH-65",
    title: "NAVY BLUE BENGAL STRIPED TWILL SHIRT",
    price: "RS. 3,000",
    rawPrice: 3000,
    image: "/api/media/31/whatsapp-image-2026-10-31-at-10-40-00-pm-1.jpeg",
    slug: "navy-blue-bengal-striped-twill-shirt",
  },
  {
    id: "na-charcoal-grey",
    code: "SH-66",
    title: "CHARCOAL GREY BENGAL STRIPED TWILL SHIRT",
    price: "RS. 3,000",
    rawPrice: 3000,
    image: "/api/media/32/whatsapp-image-2026-10-31-at-10-40-00-pm-2.jpeg",
    slug: "charcoal-grey-bengal-striped-twill-shirt",
  },
  {
    id: "na-black-white",
    code: "SH-60",
    title: "SUITOHOLIC CLASSIC BLACK & WHITE BENGAL STRIPED TWILL SHIRT",
    price: "RS. 2,800",
    rawPrice: 2800,
    image: "/api/media/26/whatsapp-image-2026-10-31-at-10-25-47-pm.jpeg",
    slug: "classic-black-white-bengal-striped-twill-shirt",
  },
  {
    id: "na-sky-blue",
    code: "SH-73",
    title: "SKY BLUE BENGAL STRIPED TWILL SHIRT",
    price: "RS. 2,800",
    rawPrice: 2800,
    image: "/api/media/36/whatsapp-image-2026-11-01-at-12-49-05-am.jpeg",
    slug: "sky-blue-bengal-striped-twill-shirt",
  },
];

// Compatibility alias for existing references
export const NEW_ARRIVALS_FABRICS = NEW_ARRIVALS_ITEMS;

interface FabricNewArrivalsSectionProps {
  onSelectFabric?: (code: string) => void;
  onOpenCustomizer?: (item: any) => void;
}

export default function FabricNewArrivalsSection({
  onSelectFabric,
  onOpenCustomizer,
}: FabricNewArrivalsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { openCustomizer } = useCustomizer();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products } = useCatalog();

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 320;
      const scrollDistance = (cardWidth + 2) * (typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 4);
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollDistance : scrollDistance,
        behavior: "smooth",
      });
    }
  };

  const handleToggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleOpenCustomizer = (e: React.MouseEvent, item: NewArrivalShirt) => {
    e.preventDefault();
    e.stopPropagation();

    if (onOpenCustomizer) {
      onOpenCustomizer(item);
      return;
    }

    onSelectFabric?.(item.code);

    const baseProduct =
      products.find((p) => p.category === "formal_bespoke" || p.category === "fabrics") ||
      products[0];

    openCustomizer({
      id: baseProduct?.id || 1,
      name: item.title,
      image: item.image,
      gallery: [item.image],
      price: item.price,
      rawPrice: item.rawPrice,
      fabric: item.title,
      category: "fabrics",
      slug: item.slug || `fabric-${item.code.toLowerCase()}`,
    });
  };

  return (
    <section className="relative w-full bg-[#ECEAE5] py-12 sm:py-16 lg:py-20 border-b border-[#E5E3DD] overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          NEW ARRIVALS
        </h2>
      </div>

      {/* Cards Track with Left & Right Navigation Buttons */}
      <div className="relative group/carousel w-full">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Previous Items"
          className="absolute left-2 sm:left-4 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/85 hover:bg-black text-white shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>

        {/* 4-Cards Track - END TO END with Exact 2px Gap */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-[2px] overflow-x-auto scroll-smooth w-full px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {NEW_ARRIVALS_ITEMS.map((item) => {
            const isSaved = isInWishlist(item.id);
            return (
              <div
                key={item.id}
                className="shrink-0 w-[calc(50%-1px)] md:w-[calc(25%-1.5px)] flex flex-col group font-sans"
              >
                {/* Upper Rectangular Image Container - 254:350 Aspect Ratio */}
                <div className="relative w-full aspect-[254/350] rounded-none overflow-hidden bg-[#ECEAE5] transition-all duration-300">
                  <Link
                    href={`/custom-shirt?fabric=${encodeURIComponent(item.code)}`}
                    onClick={() => onSelectFabric?.(item.code)}
                    className="block relative w-full h-full overflow-hidden"
                  >
                    {/* Main Shirt Swatch Photo with Collar & Circular Weave Lens */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-102"
                      loading="lazy"
                    />
                  </Link>

                  {/* Top Right: Floating Outline Heart Wishlist Icon */}
                  <button
                    onClick={(e) => handleToggleSave(e, item.id)}
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
                    <Link
                      href={`/custom-shirt?fabric=${encodeURIComponent(item.code)}`}
                      onClick={() => onSelectFabric?.(item.code)}
                      className="block"
                    >
                      <h3
                        title={item.title}
                        className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.16em] text-black hover:opacity-75 uppercase transition-opacity truncate leading-snug"
                      >
                        {item.title}
                      </h3>
                    </Link>
                    <div className="font-sans text-[10px] sm:text-[11px] font-medium text-[#666666] tracking-[0.08em] uppercase">
                      {item.price}
                    </div>
                  </div>

                  {/* Right: Plus Button -> Opens Customizer Modal */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenCustomizer(e, item)}
                    aria-label={`Customise ${item.title}`}
                    title="Customise Shirt (6 Steps)"
                    className="shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Next Items"
          className="absolute right-2 sm:right-4 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/85 hover:bg-black text-white shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Centered VIEW ALL Button */}
      <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12 px-4">
        <Link
          href="/custom-outfit"
          className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white text-xs sm:text-[13px] font-bold tracking-[0.22em] px-10 sm:px-14 py-3 sm:py-3.5 rounded-full transition-all duration-300 uppercase shadow-sm hover:shadow-md active:scale-98"
        >
          VIEW ALL
        </Link>
      </div>
    </section>
  );
}

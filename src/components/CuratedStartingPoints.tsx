"use client";

import React from"react";
import { Plus, Heart } from"lucide-react";
import { ProductItem } from"@/data/products";
import { useWishlist } from"@/context/WishlistProvider";
import { useCustomizer } from"@/context/CustomizerModalProvider";

export interface CuratedLookItem {
  id: string | number;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  hoverImage?: string;
  tag?: string;
}

interface CuratedStartingPointsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: CuratedLookItem[];
  activeProductSlug?: string;
  onSelectLook: (item: CuratedLookItem) => void;
}

export const DEFAULT_LOOKS: CuratedLookItem[] = [
  {
    id:"look-1",
    slug:"dark-chocolate-brown-satin-twill-shirt",
    title:"Dark Espresso Brown Twill Shirt",
    subtitle:"Luxurious Silk-Touch Satin Twill",
    price:"₹ 2,600",
    image:"/new_shirts/shirt_19.jpg",
    hoverImage:"/customizer/full_shirt_19.jpg",
    tag:"SIGNATURE ESPRESSO",
  },
  {
    id:"look-2",
    slug:"beige-textured-linen-cotton-shirt",
    title:"Sand Beige Linen Cotton Shirt",
    subtitle:"Artisanal Breathable Linen Weave",
    price:"₹ 2,600",
    image:"/new_shirts/shirt_13.jpg",
    hoverImage:"/customizer/full_shirt_13.jpg",
    tag:"SUMMER LINEN",
  },
  {
    id:"look-3",
    slug:"royal-blue-classic-bengal-stripe-twill-shirt",
    title:"Royal Steel Blue Bengal Stripe",
    subtitle:"Italian 130s Pure Egyptian Cotton",
    price:"₹ 2,600",
    image:"/new_shirts/shirt_21.jpg",
    hoverImage:"/customizer/full_shirt_21.jpg",
    tag:"BESTSELLER",
  },
  {
    id:"look-4",
    slug:"coral-red-bold-bengal-stripe-twill-shirt",
    title:"Terracotta Rust Bengal Stripe",
    subtitle:"Warm Terracotta Brick and Ecru Weave",
    price:"₹ 2,633",
    image:"/new_shirts/shirt_14.jpg",
    hoverImage:"/customizer/full_shirt_14.jpg",
    tag:"HERITAGE STRIPE",
  },
];

export default function CuratedStartingPoints({
  title ="CURATED LOOKS",
  description,
  items = DEFAULT_LOOKS,
  activeProductSlug,
  onSelectLook,
}: CuratedStartingPointsProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openCustomizer } = useCustomizer();

  return (
    <section id="curated-starting-points" className="relative w-full pt-14 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 border-b border-[#E5E3DD] bg-[#ECEAE5] overflow-hidden px-0">
      {/* Section Header: Refined Modern Luxury Heading (Aligned Left) */}
      <div className="text-left mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          {title}
        </h2>
      </div>

      {/* 4-Card Responsive Grid - END TO END (Full-Width Edge-to-Edge) with Exact 2px Gap */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] w-full items-start px-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col w-full"
          >
            {/* Upper Rectangular Image Container - Full Column Width with 254:350 Aspect Ratio (End-to-End, Zero Radius) */}
            <div
              onClick={() => onSelectLook(item)}
              className="relative w-full aspect-[254/350] rounded-none overflow-hidden bg-[#ECEAE5] transition-all duration-300 cursor-pointer block"
            >
              {/* Top-Right Floating Outline Heart Wishlist Icon */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(item.id);
                }}
                type="button"
                aria-label={isInWishlist(item.id) ?"Remove from wishlist" :"Save to wishlist"}
                className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 p-1 transition-transform duration-200 hover:scale-115 active:scale-90 cursor-pointer"
              >
                <Heart
                  size={19}
                  strokeWidth={1.5}
                  className={`drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-colors ${
                    isInWishlist(item.id)
                      ?"text-red-500 fill-red-500"
                      :"text-white fill-transparent stroke-white"
                  }`}
                />
              </button>

              {/* Default Image: Collar & Fabric Macro View */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-102"
                loading="lazy"
              />

              {/* Hover Image */}
              {item.hoverImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.hoverImage}
                  alt={`${item.title} Full Shirt`}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-102"
                  loading="lazy"
                />
              )}
            </div>

            {/* Lower Details Strip: Title, Price & Plus Button */}
            <div className="mt-2 flex items-start justify-between gap-1.5 px-1 pb-1">
              <div
                onClick={() => onSelectLook(item)}
                className="min-w-0 flex-1 space-y-0.5 cursor-pointer"
              >
                <h3
                  title={item.title}
                  className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.16em] text-black hover:opacity-75 uppercase transition-opacity truncate leading-snug"
                >
                  {item.title}
                </h3>
                <div className="font-sans text-[10px] sm:text-[11px] font-medium text-[#666666] tracking-[0.08em] uppercase">
                  {item.price}
                </div>
              </div>

              {/* Right: Plus Button -> Opens Customizer Modal */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openCustomizer({
                    id: item.id,
                    name: item.title,
                    image: item.image,
                    slug: item.slug,
                    price: item.price,
                    fabric: item.subtitle,
                  });
                }}
                title="Customise Shirt (6 Steps)"
                aria-label={`Customise ${item.title}`}
                className="shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

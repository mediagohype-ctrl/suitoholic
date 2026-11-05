"use client";

import React from "react";
import Link from "next/link";
import { useCustomizer } from "@/context/CustomizerModalProvider";

export default function FreedomCollectionSection() {
  const { openCustomizer } = useCustomizer();

  const handleCustomise = (
    e: React.MouseEvent,
    shirt: { id: number; name: string; image: string; slug: string; price: string }
  ) => {
    e.preventDefault();
    openCustomizer({
      id: shirt.id,
      name: shirt.name,
      image: shirt.image,
      slug: shirt.slug,
      price: shirt.price,
      rawPrice: 2600,
    });
  };

  return (
    <section aria-labelledby="collection-freedom" className="w-full bg-[#ECEAE5] border-b border-[#E5E3DD]">
      {/* Section Header */}
      <h2
        id="collection-freedom"
        className="px-4 pb-4 pt-10 text-[14px] font-bold uppercase leading-[1.15] tracking-[0.16em] text-black sm:px-6 sm:pb-5 sm:pt-14 sm:text-[16px] lg:px-8 font-sans"
      >
        FREEDOM
      </h2>

      {/* Signature 5-Card Editorial Collage Grid (Matching suosindia.com/collections FREEDOM format) */}
      <div className="grid grid-cols-2 gap-0.5 sm:gap-[2px] lg:grid-cols-6 w-full bg-[#E5E3DD]">
        
        {/* Item 1: Large Featured Landscape Card (4 cols on lg, aspect 16/11) */}
        <Link
          href="/shop"
          aria-label="Shop the FREEDOM collection"
          className="group relative block overflow-hidden bg-[#E7E7E4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black col-span-2 aspect-[4/5] lg:col-span-4 lg:aspect-[16/11]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banners/shop_hero_banner_hd.jpg"
            alt="Suitoholic Bespoke Freedom Collection - Master Atelier Tailoring"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        </Link>

        {/* Item 2: Companion Tall Portrait Card (2 cols on lg, aspect auto) */}
        <Link
          href="/shop"
          tabIndex={-1}
          aria-hidden="true"
          className="group relative block overflow-hidden bg-[#E7E7E4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black col-span-1 aspect-[3/4] lg:col-span-2 lg:aspect-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about_principles_model.jpg"
            alt="Bespoke Tailored Look"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        </Link>

        {/* Item 3: Card 3 (2 cols on lg, aspect 3/4) */}
        <div
          onClick={(e) =>
            handleCustomise(e, {
              id: 21,
              name: "Royal Steel Blue Bengal Stripe Shirt",
              image: "/new_shirts/shirt_21.jpg",
              slug: "royal-steel-blue-bengal-stripe",
              price: "₹ 2,600",
            })
          }
          className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-1 aspect-[3/4] lg:col-span-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new_shirts/shirt_21.jpg"
            alt="Royal Steel Blue Bengal Stripe Shirt"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
        </div>

        {/* Item 4: Card 4 (2 cols on lg, aspect 3/4) */}
        <div
          onClick={(e) =>
            handleCustomise(e, {
              id: 14,
              name: "Terracotta Rust Bengal Stripe Shirt",
              image: "/new_shirts/shirt_14.jpg",
              slug: "terracotta-rust-bengal-stripe",
              price: "₹ 2,633",
            })
          }
          className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-1 aspect-[3/4] lg:col-span-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new_shirts/shirt_14.jpg"
            alt="Terracotta Rust Bengal Stripe Shirt"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
        </div>

        {/* Item 5: Card 5 (2 cols on lg, aspect 3/4) */}
        <div
          onClick={(e) =>
            handleCustomise(e, {
              id: 19,
              name: "Dark Espresso Brown Twill Shirt",
              image: "/new_shirts/shirt_19.jpg",
              slug: "dark-espresso-brown-twill",
              price: "₹ 2,600",
            })
          }
          className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-1 aspect-[3/4] lg:col-span-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new_shirts/shirt_19.jpg"
            alt="Dark Espresso Brown Twill Shirt"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
        </div>

      </div>

      {/* Bottom Editorial Callout Strip */}
      <div className="flex flex-col items-center bg-[#F7F5F0] px-4 py-12 text-center sm:px-6 sm:py-16 border-t border-[#E5E3DD]">
        <p className="font-serif-luxury text-[20px] font-bold uppercase leading-[1.15] tracking-[0.08em] text-black sm:text-[24px]">
          Shop FREEDOM Collection
        </p>
        <p className="mt-3 max-w-[560px] text-[13px] font-normal leading-relaxed text-black/75 sm:text-[14px] font-sans">
          This bespoke series is tailored using pure Egyptian Giza cotton, artisanal French seams, and master hand-drafted patterns — crafted to be worn with poise and cherished for years.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-9 min-w-[136px] items-center justify-center border border-black bg-transparent px-6 text-[12px] font-semibold uppercase leading-none tracking-[0.08em] text-black transition-all hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:h-10 sm:text-[13px]"
          aria-label="Shop the FREEDOM collection"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}


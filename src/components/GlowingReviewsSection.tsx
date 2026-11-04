"use client";

import React, { useMemo } from "react";
import { Star } from "lucide-react";
import { useCatalog } from "@/context/SiteDataProvider";

interface PatronStory {
  id: string;
  name: string;
  outfit: string;
  image: string;
  rating: number;
  quote: string;
  author: string;
  role: string;
  location: string;
}

export default function GlowingReviewsSection() {
  const { products } = useCatalog();

  // Dynamically resolve authentic patron looks with their corresponding individual reviews
  const testimonials: PatronStory[] = useMemo(() => {
    const list = products || [];

    const bandhgala = list.find(
      (p) =>
        p.image?.includes("bandhgala") ||
        p.name.toLowerCase().includes("bandhgala") ||
        p.category === "ceremonial"
    );
    const linen = list.find(
      (p) =>
        p.image?.includes("shirt_13") ||
        p.image?.includes("linen") ||
        p.name.toLowerCase().includes("linen") ||
        p.id === 50
    );
    const blazer = list.find(
      (p) =>
        p.image?.includes("double_breasted") ||
        p.image?.includes("blazer") ||
        p.name.toLowerCase().includes("blazer") ||
        p.id === 28
    );
    const stripe = list.find(
      (p) =>
        p.image?.includes("shirt_21") ||
        p.image?.includes("stripe") ||
        p.name.toLowerCase().includes("bengal") ||
        p.id === 52
    );

    return [
      {
        id: "story-1",
        name: "AARAV SINGHANIA",
        outfit: bandhgala?.name || "Bespoke Royal Navy Bandhgala",
        image: bandhgala?.image || "/ceremonial_bandhgala.jpg",
        rating: 5,
        quote:
          "“I walked in nervous about my wedding reception outfit. The master cutter understood my proportions, posture and fit, and we left with everything crafted to bespoke perfection.”",
        author: "Aarav",
        role: "groom",
        location: "Delhi",
      },
      {
        id: "story-2",
        name: "DEVENDRA KAPOOR",
        outfit: linen?.name || "Natural Linen Bespoke Luxury Shirt",
        image:
          (linen?.gallery && linen.gallery.length > 1 ? linen.gallery[1] : null) ||
          "/customizer/full_shirt_13.jpg",
        rating: 5,
        quote:
          "“They had every luxury Italian fabric and collar style I imagined, and the atelier staff were so patient helping me select and customize for my entire wedding party.”",
        author: "Devendra",
        role: "bespoke patron",
        location: "Mumbai",
      },
      {
        id: "story-3",
        name: "KABIR MALHOTRA",
        outfit: blazer?.name || "Camel Double-Breasted Tailored Blazer",
        image: blazer?.image || "/blazer_double_breasted.jpg",
        rating: 5,
        quote:
          "“I saw my fabric as a finished shirt on their preview before stitching. It came out exactly like the 3D preview — zero alteration needed, fitted on day one.”",
        author: "Kabir",
        role: "executive",
        location: "Gurgaon",
      },
      {
        id: "story-4",
        name: "ARJUN MEHTA",
        outfit: stripe?.name || "Italian Banker Stripe Twill Shirt",
        image:
          (stripe?.gallery && stripe.gallery.length > 1 ? stripe.gallery[1] : null) ||
          "/customizer/full_shirt_21.jpg",
        rating: 5,
        quote:
          "“The collar structure and sleeve drape are remarkable. From fabric feel to the exact cuff measurement, this is by far the finest custom shirt in my wardrobe.”",
        author: "Arjun",
        role: "director",
        location: "Bengaluru",
      },
    ];
  }, [products]);

  return (
    <section
      aria-label="Patron Reviews"
      className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-b border-[#E5E3DD] overflow-hidden font-sans"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-[0.03em] text-[#14110E] leading-tight">
            They came unsure, left glowing
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2.5">
            <div className="flex items-center gap-0.5 text-[#D4AF37]" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-[#D4AF37] text-[#D4AF37]"
                />
              ))}
            </div>
            <span className="text-xs sm:text-[13px] text-[#4A4238] font-normal tracking-wide">
              Loved by patrons across India
            </span>
          </div>
        </div>

        {/* 4-Column Aligned Grid: Each image paired with its individual review directly underneath */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col h-full group"
            >
              {/* Individual Image */}
              <div className="relative aspect-[3/3.9] sm:aspect-[3/4] w-full rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#ECEAE5] border border-[#E5E3DD] shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={`${item.name} in ${item.outfit}`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Bottom gradient overlay for contrast */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Patron Name Pill at Bottom Left */}
                <div className="absolute bottom-3 sm:bottom-3.5 left-3 sm:left-3.5 z-10">
                  <span className="inline-block bg-black/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
                    {item.name}
                  </span>
                </div>
              </div>

              {/* Individual Review Card - Perfectly Aligned With Above Image */}
              <div className="mt-3.5 sm:mt-4 flex-1 bg-white rounded-[18px] sm:rounded-[22px] p-5 sm:p-6 border border-[#E5E3DD] shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#D9D6CE]">
                <div>
                  {/* 5 Gold Stars */}
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-3" aria-hidden="true">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="fill-[#D4AF37] text-[#D4AF37]"
                      />
                    ))}
                  </div>

                  {/* Review Quote Text */}
                  <p className="text-xs sm:text-[12.5px] leading-relaxed text-[#2C2723] font-normal italic font-sans">
                    {item.quote}
                  </p>
                </div>

                {/* Author Attribution */}
                <div className="mt-4 pt-3.5 border-t border-[#F2EFE9]">
                  <p className="text-xs sm:text-[12.5px] text-[#14110E]">
                    <span className="font-bold">{item.author}</span>
                    <span className="font-normal text-[#7A7268]"> — {item.role}, {item.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

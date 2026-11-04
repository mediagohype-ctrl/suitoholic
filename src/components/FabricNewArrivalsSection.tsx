"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCustomizer } from "@/context/CustomizerModalProvider";
import { useCatalog } from "@/context/SiteDataProvider";

export interface NewArrivalFabric {
  id: string;
  code: string;
  title: string;
  category: "EMBROIDERED" | "JACQUARD" | "PRINTED";
  image: string;
  originalPrice: string;
  price: string;
  discount: string;
  unit: string;
}

export const NEW_ARRIVALS_FABRICS: NewArrivalFabric[] = [
  // --- EMBROIDERED (6 Items) ---
  {
    id: "arr-emb-1",
    code: "EMB-27069",
    title: "White Dyeable Velvet Fabric With All Over Zari And Sequins Work 27069",
    category: "EMBROIDERED",
    image: "/fabric_cat_embroidery.jpg",
    originalPrice: "₹1,460",
    price: "₹1,170",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-emb-2",
    code: "EMB-27087",
    title: "White Dyeable Georgette Fabric With All Over Thread And Sequins Work 27087",
    category: "EMBROIDERED",
    image: "/mens_fabric_embroidered.jpg",
    originalPrice: "₹1,460",
    price: "₹1,170",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-emb-3",
    code: "EMB-28014",
    title: "Imperial Gold Weave Embroidered Ceremony Suiting Fabric 28014",
    category: "EMBROIDERED",
    image: "/fabric_cat_season_special.jpg",
    originalPrice: "₹1,650",
    price: "₹1,320",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-emb-4",
    code: "EMB-29033",
    title: "Plush Emerald Velvet Embroidered Bandhgala Cloth 29033",
    category: "EMBROIDERED",
    image: "/fabric_cat_suits_sets.jpg",
    originalPrice: "₹1,950",
    price: "₹1,560",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-emb-5",
    code: "EMB-29045",
    title: "Royal Sherwani Zari Embroidered Silk Cloth 29045",
    category: "EMBROIDERED",
    image: "/fabric_cat_sherwani_fabric.jpg",
    originalPrice: "₹2,100",
    price: "₹1,680",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-emb-6",
    code: "EMB-27110",
    title: "Bordeaux Mulberry Silk Flora Embroidered Fabric 27110",
    category: "EMBROIDERED",
    image: "/fabric_cat_coord_sets.jpg",
    originalPrice: "₹1,580",
    price: "₹1,260",
    discount: "SAVE 20%",
    unit: "/meter",
  },

  // --- JACQUARD (6 Items) ---
  {
    id: "arr-jac-1",
    code: "JAC-18042",
    title: "Diamond Twill Luminous Jacquard Suiting Cloth 18042",
    category: "JACQUARD",
    image: "/fabric_cat_new_arrivals.jpg",
    originalPrice: "₹1,750",
    price: "₹1,399",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-jac-2",
    code: "JAC-18055",
    title: "Herringbone Master Weave Jacquard Pure Giza Cotton 18055",
    category: "JACQUARD",
    image: "/mens_fabric_unstitched_suit.jpg",
    originalPrice: "₹1,380",
    price: "₹1,100",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-jac-3",
    code: "JAC-19020",
    title: "Micro Houndstooth Dobby Jacquard Suiting 19020",
    category: "JACQUARD",
    image: "/mens_fabric_imported_plain.jpg",
    originalPrice: "₹1,620",
    price: "₹1,295",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-jac-4",
    code: "JAC-18077",
    title: "Ivory Classic Herringbone Textured Jacquard 18077",
    category: "JACQUARD",
    image: "/fabric_roll_herringbone_ivory.jpg",
    originalPrice: "₹1,450",
    price: "₹1,160",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-jac-5",
    code: "JAC-18090",
    title: "Sapphire Twill Luminous Jacquard Suiting 18090",
    category: "JACQUARD",
    image: "/fabric_roll_sapphire_twill.jpg",
    originalPrice: "₹1,680",
    price: "₹1,340",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-jac-6",
    code: "JAC-18105",
    title: "Emerald Forest Twill Master Jacquard 18105",
    category: "JACQUARD",
    image: "/fabric_roll_emerald_twill.jpg",
    originalPrice: "₹1,850",
    price: "₹1,480",
    discount: "SAVE 20%",
    unit: "/meter",
  },

  // --- PRINTED (6 Items) ---
  {
    id: "arr-prt-1",
    code: "PRT-31012",
    title: "Aegean Blue Striped Hand-Crafted Print Linen 31012",
    category: "PRINTED",
    image: "/fabric_cat_prints.jpg",
    originalPrice: "₹1,420",
    price: "₹1,135",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-prt-2",
    code: "PRT-31045",
    title: "Heritage Indigo Botanical Block Print Fabric 31045",
    category: "PRINTED",
    image: "/fabric_cat_indigo_prints.jpg",
    originalPrice: "₹1,250",
    price: "₹999",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-prt-3",
    code: "PRT-32018",
    title: "Modern Abstract Geometric Print Menswear Cloth 32018",
    category: "PRINTED",
    image: "/mens_fabric_printed.jpg",
    originalPrice: "₹1,390",
    price: "₹1,110",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-prt-4",
    code: "PRT-32066",
    title: "Terracotta Fine Pinstripe Printed Cotton 32066",
    category: "PRINTED",
    image: "/fabric_st16974_terracotta_stripe.jpg",
    originalPrice: "₹1,480",
    price: "₹1,180",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-prt-5",
    code: "PRT-31088",
    title: "Royal Bengal Sky Blue Printed Cotton 31088",
    category: "PRINTED",
    image: "/fabric_sh403_royal_stripe.jpg",
    originalPrice: "₹1,350",
    price: "₹1,080",
    discount: "SAVE 20%",
    unit: "/meter",
  },
  {
    id: "arr-prt-6",
    code: "PRT-31092",
    title: "Rose Mist Luxury Printed Shirting 31092",
    category: "PRINTED",
    image: "/fabric_sh403_rose_stripe.jpg",
    originalPrice: "₹1,420",
    price: "₹1,135",
    discount: "SAVE 20%",
    unit: "/meter",
  },
];

const CATEGORIES: Array<"EMBROIDERED" | "JACQUARD" | "PRINTED"> = [
  "EMBROIDERED",
  "JACQUARD",
  "PRINTED",
];

interface FabricNewArrivalsSectionProps {
  onSelectFabric?: (code: string) => void;
  onOpenCustomizer?: (fabric: NewArrivalFabric) => void;
}

export default function FabricNewArrivalsSection({
  onSelectFabric,
  onOpenCustomizer,
}: FabricNewArrivalsSectionProps) {
  const [activeTab, setActiveTab] = useState<"EMBROIDERED" | "JACQUARD" | "PRINTED">("EMBROIDERED");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { openCustomizer } = useCustomizer();
  const { products } = useCatalog();

  const filteredFabrics = NEW_ARRIVALS_FABRICS.filter(
    (item) => item.category === activeTab
  );

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 280;
      const scrollDistance = (cardWidth + 24) * (typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 2);
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollDistance : scrollDistance,
        behavior: "smooth",
      });
    }
  };

  const handleOpenCustomizer = (e: React.MouseEvent, item: NewArrivalFabric) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger parent callback if provided
    if (onOpenCustomizer) {
      onOpenCustomizer(item);
      return;
    }

    onSelectFabric?.(item.code);

    // Find a matching base shirt product from catalog or fallback
    const baseProduct =
      products.find((p) => p.category === "formal_bespoke" || p.category === "fabrics") ||
      products[0];

    // Open canonical 6-Step Bespoke Customization Modal
    openCustomizer({
      id: baseProduct?.id || 1,
      name: item.title,
      image: item.image,
      gallery: [item.image],
      price: item.price,
      rawPrice: parseInt(item.price.replace(/[^\d]/g, ""), 10) || 1170,
      fabric: item.title,
      category: "fabrics",
      slug: baseProduct?.slug || `fabric-${item.code.toLowerCase()}`,
    });
  };

  return (
    <section className="relative w-full bg-[#ECEAE5] py-14 sm:py-20 border-b border-[#E5E3DD] select-none overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header: Matching Website Luxury Typography */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
            NEW ARRIVALS
          </h2>

          {/* Interactive Category Tabs Matching Website Font */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-5 border-b border-[#D8D4CA] pb-2 max-w-md mx-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveTab(cat);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
                    }
                  }}
                  className={`font-sans text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] transition-all relative pb-2 cursor-pointer ${
                    isActive
                      ? "text-black font-bold"
                      : "text-[#666666] hover:text-black"
                  }`}
                >
                  {cat}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8C7355]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Container with Left/Right Buttons */}
        <div className="relative group/carousel px-1 sm:px-2">
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous Fabrics"
            className="absolute -left-2 sm:-left-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/90 hover:bg-black text-white shadow-xl border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          {/* Cards Track (Horizontally scrollable with smooth snap, showing 4 cards on desktop) */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredFabrics.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] flex flex-col"
              >
                <div className="h-full bg-white border border-[#E5E3DD] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group font-sans">
                  
                  {/* Upper Image Container with Red SAVE Badge */}
                  <Link
                    href={`/custom-shirt?fabric=${encodeURIComponent(item.code)}`}
                    onClick={() => onSelectFabric?.(item.code)}
                    className="relative aspect-[4/5] overflow-hidden bg-[#FAF8F5] block cursor-pointer"
                  >
                    {/* Red SAVE Discount Badge */}
                    <span className="absolute top-3 left-3 z-10 bg-[#E53935] text-white text-[10px] font-bold font-sans tracking-wider px-2 py-0.5 rounded-[2px] uppercase shadow-xs">
                      {item.discount}
                    </span>

                    {/* Fabric Swatch Photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Lower Details Strip (Image ke niche details + Plus Icon for 6-Step Customizer) */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-white font-sans">
                    <Link
                      href={`/custom-shirt?fabric=${encodeURIComponent(item.code)}`}
                      onClick={() => onSelectFabric?.(item.code)}
                      className="block group-hover:text-[#8C7355] transition-colors"
                    >
                      <h3 className="text-xs sm:text-[13px] font-medium text-[#14110E] line-clamp-2 leading-snug min-h-[38px] font-sans">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Pricing Row + Plus Button (6-Step Customizer Trigger) */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F2EFE9] font-sans">
                      <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0">
                        <span className="text-xs text-[#888888] line-through font-normal whitespace-nowrap">
                          {item.originalPrice}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-black whitespace-nowrap">
                          {item.price}
                        </span>
                        <span className="text-[11px] text-[#666666] font-normal whitespace-nowrap">
                          {item.unit}
                        </span>
                      </div>

                      {/* Right Plus Button -> Opens 6-Step Customizer */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenCustomizer(e, item)}
                        title="Customise Shirt (6 Steps)"
                        aria-label={`Customise ${item.title}`}
                        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black/25 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer ml-2"
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next Fabrics"
            className="absolute -right-2 sm:-right-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/90 hover:bg-black text-white shadow-xl border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>

        </div>

      </div>
    </section>
  );
}

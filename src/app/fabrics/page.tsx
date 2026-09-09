"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FabricCategoryQuickRow from "@/components/FabricCategoryQuickRow";
import MensFabricShowcaseGrid from "@/components/MensFabricShowcaseGrid";
import { 
  ArrowRight, 
  Check, 
  ZoomIn, 
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Plus,
  Scissors,
  Maximize2,
  X,
  CheckCircle2
} from "lucide-react";

export interface FabricItem {
  id: string;
  code: string;
  name: string;
  category: "all" | "stripes" | "linen" | "wool" | "velvet_silk" | "oxford_twill";
  categoryLabel: string;
  composition: string;
  yarnCount: string;
  weave: string;
  weight: string;
  gsm: string;
  origin: string;
  opacity: string;
  breathability: string;
  wrinkleResistance: string;
  image: string;
  description: string;
  shortInfo: string;
  price: string;
  bestFor: string;
  care: string;
  accentColor?: string;
}

// =========================================================================
// Complete Master Fabric Collection (14 High-End Luxury Weaves)
// =========================================================================
export const atelierFabricsList: FabricItem[] = [
  {
    id: "fabric-oxford-white",
    code: "OX-140-WH",
    name: "Optic White Royal Oxford",
    category: "oxford_twill",
    categoryLabel: "2-PLY ROYAL OXFORD",
    composition: "100% Long-Staple Egyptian Giza 140s Cotton",
    yarnCount: "140/2 Ne Compact Double-Twist",
    weave: "Distinctive 2x2 Micro-Basketweave",
    weight: "Year-Round Structured",
    gsm: "130 GSM",
    origin: "Nile Delta Harvest • Spun in Biella, Italy",
    opacity: "100% Solid Opaque",
    breathability: "High (4.8 / 5.0)",
    wrinkleResistance: "Natural Resilient Basketweave",
    image: "/fabric_roll_oxford_white.jpg",
    description:
      "Immaculate optic white 2-ply royal oxford with distinctive 2x2 micro-basketweave texture. Delivers exceptional drape, breathability, and timeless bespoke elegance.",
    shortInfo: "140/2 Ne Royal Oxford • 130 GSM",
    price: "Rs. 3,290 • BESPOKE FIT",
    bestFor: "Classic White Dress Shirts, Button-Down & Spread Collars, Business Formal",
    care: "Gentle Machine Wash at 30°C • Warm Steam Iron",
    accentColor: "#FAF8F5",
  },
  {
    id: "fabric-emerald-velvet",
    code: "VL-300-EM",
    name: "Royal Emerald Plush Velvet",
    category: "velvet_silk",
    categoryLabel: "ROYAL VELVET SUITING",
    composition: "100% Spun Micro-Velvet Silk Blend",
    yarnCount: "Plush High-Pile Filament Weave",
    weave: "Deep Pile Luminous Velvet Sheen",
    weight: "Winter Formal & Ceremonial",
    gsm: "300 GSM",
    origin: "Como Mills, Northern Italy",
    opacity: "100% Deep Opaque",
    breathability: "Medium (3.8 / 5.0)",
    wrinkleResistance: "Self-Recovering Plush Pile",
    image: "/fabric_roll_emerald_velvet.jpg",
    description:
      "Opulent royal emerald green velvet with deep multidimensional sheen and feather-soft hand feel. Engineered for evening statements, smoking jackets, and red-carpet ceremonial bandhgalas.",
    shortInfo: "300 GSM Silk-Touch Velvet • Plush Luster",
    price: "Rs. 4,490 • BESPOKE FIT",
    bestFor: "Ceremonial Bandhgalas, Evening Smoking Jackets, Red-Carpet Tuxedos",
    care: "Professional Dry Clean Only • Steam Only from Reverse",
    accentColor: "#0D382B",
  },
  {
    id: "fabric-waffle-sage",
    code: "PQ-120-SG",
    name: "Sage Botanical Waffle Piqué",
    category: "oxford_twill",
    categoryLabel: "3D HONEYCOMB PIQUÉ",
    composition: "100% Mercerized Egyptian Piqué Cotton",
    yarnCount: "120/2 Ne Double-Mercerized Piqué",
    weave: "3D Structured Honeycomb Micro-Knit",
    weight: "All-Season Breathable",
    gsm: "160 GSM",
    origin: "Giza Harvest • Mercerized in Biella",
    opacity: "100% Opaque",
    breathability: "Maximum Breathability (5.0 / 5.0)",
    wrinkleResistance: "Naturally Resilient Knit Stretch",
    image: "/fabric_roll_waffle_sage.jpg",
    description:
      "Earthy botanical sage green with a tactile 3D honeycomb waffle knit structure. Offers superior air circulation, subtle texture contrast, and refined smart-casual luxury.",
    shortInfo: "120/2 Ne 3D Honeycomb Knit • 160 GSM",
    price: "Rs. 3,390 • BESPOKE FIT",
    bestFor: "Luxury Polos, Mandarin Collar Overshirts, Weekend Resort Tailoring",
    care: "Machine Wash Cold 30°C • Flat Dry • Gentle Steam",
    accentColor: "#748574",
  },
  {
    id: "fabric-bordeaux-silk",
    code: "SJ-200-BX",
    name: "Bordeaux Ruby Silk Jacquard",
    category: "velvet_silk",
    categoryLabel: "CEREMONIAL SILK JACQUARD",
    composition: "100% Pure Mulberry Silk & Long-Staple Cotton",
    yarnCount: "200/2 Ne Filament Silk Weft",
    weave: "High-Luster Intricate Jacquard Luster",
    weight: "Evening Black-Tie Structured",
    gsm: "145 GSM",
    origin: "Lyon Historic Silk Ateliers, France",
    opacity: "100% Rich Opaque",
    breathability: "High (4.4 / 5.0)",
    wrinkleResistance: "Silken Memory Drape",
    image: "/fabric_roll_bordeaux_silk.jpg",
    description:
      "Deep bordeaux ruby jewel tone with luminous silk-touch luster. Woven on precision jacquard looms for black-tie dinner jackets, festive kurtas, and luxury bespoke vests.",
    shortInfo: "200/2 Ne High Luster Silk • 145 GSM",
    price: "Rs. 4,290 • BESPOKE FIT",
    bestFor: "Festive Silk Kurtas, Black-Tie Dinner Jackets, Contrast Waistcoats",
    care: "Professional Dry Clean Recommended • Cool Iron on Reverse",
    accentColor: "#581825",
  },
  {
    id: "fabric-charcoal-wool",
    code: "WL-140-CH",
    name: "Charcoal Super 140s Merino Wool",
    category: "wool",
    categoryLabel: "SUPER 140S MERINO WOOL",
    composition: "100% Australian Super 140s Worsted Merino Wool",
    yarnCount: "140s High-Twist 2-Ply Worsted",
    weave: "Fine Tailored Diagonal Micro-Twill",
    weight: "4-Season Suiting Classic",
    gsm: "260 GSM",
    origin: "Biella Wool Mills, Piedmont Italy",
    opacity: "100% Solid Opaque",
    breathability: "Excellent Thermal Regulation (4.9 / 5.0)",
    wrinkleResistance: "Ultra-High Natural Wool Creep Recovery",
    image: "/fabric_roll_charcoal_wool.jpg",
    description:
      "Sleek charcoal slate melange with superfine Australian merino wool fibers. Naturally fluid drape with impeccable crease recovery engineered for bespoke 2-piece and 3-piece suiting.",
    shortInfo: "Super 140s Australian Merino • 260 GSM",
    price: "Rs. 4,990 • BESPOKE FIT",
    bestFor: "Executive 2-Piece Suits, Gurkha Dress Trousers, Tailored Blazers",
    care: "Professional Dry Clean Only • Warm Press with Damp Cloth",
    accentColor: "#333333",
  },
  {
    id: "fabric-diamond-twill",
    code: "TW-904-BK",
    name: "Midnight Obsidian Diamond Twill",
    category: "oxford_twill",
    categoryLabel: "45° STEEP DIAMOND TWILL",
    composition: "100% Egyptian Giza 160s Combed Cotton",
    yarnCount: "160/2 Ne Ultra-Fine Spun",
    weave: "45° Steep Micro-Diamond Twill Weave",
    weight: "Lightweight Crisp Formal",
    gsm: "135 GSM",
    origin: "Alexandria Delta • Finished in Bergamo, Italy",
    opacity: "100% Jet Black Opaque",
    breathability: "High (4.7 / 5.0)",
    wrinkleResistance: "Crisp Resilient Twill Memory",
    image: "/fabric_roll_diamond_twill.jpg",
    description:
      "Intense midnight obsidian black with subtle diagonal micro-diamond luster. Soft yet structured, crafted for dramatic black formal dress shirts and tuxedo accents.",
    shortInfo: "160/2 Ne Egyptian Giza • 135 GSM",
    price: "Rs. 3,690 • BESPOKE FIT",
    bestFor: "Black Formal Dress Shirts, Mandarin Collars, Tuxedo Dinner Shirts",
    care: "Gentle Machine Wash Cold at 30°C • Steam Iron on Reverse",
    accentColor: "#111111",
  },
  {
    id: "fabric-iceblue-twill",
    code: "FT-120-BL",
    name: "Glacier Ice Blue French Twill",
    category: "oxford_twill",
    categoryLabel: "EXTRA-FINE FRENCH TWILL",
    composition: "100% Extra-Long Staple Combed Cotton",
    yarnCount: "120/2 Ne French Double-Spun",
    weave: "Subtle Diagonal French Micro-Twill",
    weight: "All-Season Sartorial",
    gsm: "125 GSM",
    origin: "Alsace Heritage Weaving Atelier, France",
    opacity: "100% Opaque",
    breathability: "Very High (4.8 / 5.0)",
    wrinkleResistance: "Smooth Silky Hand with Natural Drape",
    image: "/fabric_roll_iceblue_twill.jpg",
    description:
      "Serene glacier ice blue shade with smooth, micro-diagonal twill ribbing. Highly versatile luxury tone that pairs flawlessly with dark navy, charcoal, and beige suits.",
    shortInfo: "120/2 Ne French Twill • 125 GSM",
    price: "Rs. 3,490 • BESPOKE FIT",
    bestFor: "Boardroom Dress Shirts, Cutaway Collars, Double Cuff French Shirts",
    care: "Gentle Machine Wash at 30°C • Medium Steam Iron",
    accentColor: "#8FAEC6",
  },
  {
    id: "fabric-terracotta-slub",
    code: "LN-550-TC",
    name: "Tuscan Terracotta Heavy Slub Linen",
    category: "linen",
    categoryLabel: "PURE ARTISANAL SLUB LINEN",
    composition: "100% Pure Normandy Flax Linen",
    yarnCount: "55 Lea High-Texture Pure Flax",
    weave: "Tactile Cross-Slub Open Weave",
    weight: "Summer Breathable Heavy Slub",
    gsm: "165 GSM",
    origin: "Normandy Harvest • Woven in Tuscany, Italy",
    opacity: "Rich Semi-Opaque",
    breathability: "Maximum Breathability (5.0 / 5.0)",
    wrinkleResistance: "Distinguished Artisanal Linen Patina",
    image: "/fabric_roll_terracotta_linen.jpg",
    description:
      "Warm Tuscan terracotta clay tone with pronounced artisanal slub textures. Superior airflow and unmatched rustic elegance for resort tailoring and casual bespoke shirting.",
    shortInfo: "55 Lea Pure Normandy Flax • 165 GSM",
    price: "Rs. 3,890 • BESPOKE FIT",
    bestFor: "Relaxed Linen Shirts, Camp Collars, Safari Overshirts, Gurkha Pants",
    care: "Cold Hand Wash or Gentle Cycle • Line Dry • Steam Damp",
    accentColor: "#9E4732",
  },
  {
    id: "fabric-camel-flannel",
    code: "CS-180-CM",
    name: "Camel Tan Brushed Cashmere Flannel",
    category: "wool",
    categoryLabel: "BRUSHED CASHMERE & WOOL",
    composition: "90% Virgin Merino Wool, 10% Cashmere",
    yarnCount: "130s Superfine Brushed Worsted",
    weave: "Velvety Brushed Soft Flannel Weave",
    weight: "Autumn/Winter Sartorial",
    gsm: "280 GSM",
    origin: "Biella Luxury Mills, Italy",
    opacity: "100% Solid Opaque",
    breathability: "High Thermal Insulation (4.6 / 5.0)",
    wrinkleResistance: "Supreme Crease Recovery & Loft",
    image: "/fabric_roll_camel_flannel.jpg",
    description:
      "Warm sartorial camel tan with a velvety brushed cashmere-wool surface. Exquisite warmth and featherlight luxury tailored for autumn overshirts and unlined sport coats.",
    shortInfo: "Cashmere-Wool Blend • 280 GSM",
    price: "Rs. 5,290 • BESPOKE FIT",
    bestFor: "Winter Overshirts, Unstructured Sport Coats, Tailored Flannel Trousers",
    care: "Professional Dry Clean Only",
    accentColor: "#B88958",
  },
  {
    id: "fabric-cavalry-drill",
    code: "CD-280-OL",
    name: "Sartorial Olive Cavalry Drill",
    category: "oxford_twill",
    categoryLabel: "MILITARY CAVALRY DRILL",
    composition: "100% Heavy Structured Compact Drill Cotton",
    yarnCount: "Heavy-Twist 20/2 Drill Yarn",
    weave: "Steep Double-Drill Cavalry Weave",
    weight: "Heavyweight Structured",
    gsm: "270 GSM",
    origin: "Lancashire Heritage Cotton Mill, UK",
    opacity: "100% Rugged Opaque",
    breathability: "Medium-High (4.3 / 5.0)",
    wrinkleResistance: "Indestructible Heavyweight Structure",
    image: "/fabric_roll_cavalry_drill.jpg",
    description:
      "Heavyweight olive cavalry drill with prominent diagonal double-rib ridges. Robust, structured, and ideal for durable bespoke trousers, safari jackets, and workwear tailoring.",
    shortInfo: "Heavy Cavalry Double-Drill • 270 GSM",
    price: "Rs. 3,590 • BESPOKE FIT",
    bestFor: "Gurkha & Pleated Trousers, Safari Overshirts, Unlined Workwear Jackets",
    care: "Machine Wash at 30°C • Medium Iron",
    accentColor: "#555A3D",
  },
  {
    id: "fabric-sh403-rose",
    code: "SH-403-RS",
    name: "Blossom Rose Banker Stripe",
    category: "stripes",
    categoryLabel: "EGYPTIAN GIZA STRIPE",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    yarnCount: "140/2 Ne Compact Spun",
    weave: "High-Density Fine Twill Weave",
    weight: "All-Season Sartorial",
    gsm: "120 GSM",
    origin: "Nile Delta Harvest • Spun in Italy",
    opacity: "100% Opaque",
    breathability: "High (4.8 / 5.0)",
    wrinkleResistance: "Natural Resilient Twill Drape",
    image: "/fabric_sh403_rose_stripe.jpg",
    description:
      "Soft blossom rose pink and optic white alternating candy stripes with fine diagonal twill ribbing. Provides an immaculate refined aesthetic for modern power dressing.",
    shortInfo: "140/2 Ne Egyptian Giza • 120 GSM",
    price: "Rs. 3,490 • BESPOKE FIT",
    bestFor: "Power Dressing Dress Shirts, Spread Collars, Tailored Suits",
    care: "Dry Clean or Gentle Machine Wash at 30°C • Warm Steam Iron",
    accentColor: "#D89A9E",
  },
  {
    id: "fabric-sh403-royal",
    code: "SH-403-BL",
    name: "Royal Bengal Banker Stripe",
    category: "stripes",
    categoryLabel: "EGYPTIAN GIZA STRIPE",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    yarnCount: "140/2 Ne Compact Spun",
    weave: "High-Density Fine Twill Weave",
    weight: "All-Season Sartorial",
    gsm: "120 GSM",
    origin: "Nile Delta Harvest • Spun in Italy",
    opacity: "100% Opaque",
    breathability: "High (4.8 / 5.0)",
    wrinkleResistance: "Natural Resilient Twill Drape",
    image: "/fabric_sh403_royal_stripe.jpg",
    description:
      "Crisp royal blue and optic white alternating bengal stripes with micro-twill diagonal ribbing. Exceptional color vibrancy and soft wrinkle-resistant luster.",
    shortInfo: "140/2 Ne Egyptian Giza • 120 GSM",
    price: "Rs. 3,490 • BESPOKE FIT",
    bestFor: "Executive Boardroom Shirts, French Cuff Formals, Spread Collars",
    care: "Dry Clean or Gentle Machine Wash at 30°C • Warm Steam Iron",
    accentColor: "#2A5B8C",
  },
  {
    id: "fabric-st16974-terra",
    code: "ST-16974",
    name: "Terracotta & Chalk Stripe",
    category: "stripes",
    categoryLabel: "LONG-STAPLE STRIPE",
    composition: "100% Extra-Long Staple Luxury Cotton",
    yarnCount: "120/2 Ne Combed Long-Staple",
    weave: "Precision Vertical Bengal Weave",
    weight: "Lightweight Crisp",
    gsm: "115 GSM",
    origin: "Extra-Long Staple Combed Cotton",
    opacity: "100% Opaque",
    breathability: "Very High (4.9 / 5.0)",
    wrinkleResistance: "Smooth Compact Surface",
    image: "/fabric_st16974_terracotta_stripe.jpg",
    description:
      "Subtle dusty terracotta rose and chalk-white stripe with a smooth compact surface. Delivers a modern sartorial presence with effortless drape.",
    shortInfo: "120/2 Ne Long-Staple Cotton • 115 GSM",
    price: "Rs. 3,290 • BESPOKE FIT",
    bestFor: "Contemporary Sartorial Dress Shirts, Cutaway Collars, Tailored Blazers",
    care: "Gentle Machine Wash at 30°C • Medium Iron",
    accentColor: "#B25E4B",
  },
  {
    id: "fabric-superviola-sand",
    code: "V-13672/06",
    name: "Superviola Sand Flax Linen",
    category: "linen",
    categoryLabel: "SUPERVIOLA ARTISANAL LINEN",
    composition: "100% Pure Artisanal Normandy Flax Linen",
    yarnCount: "60 Lea Pure European Flax",
    weave: "Natural Slub Textural Cross-Weave",
    weight: "Summer Breathable Drape",
    gsm: "155 GSM",
    origin: "Normandy Flax Fields, France",
    opacity: "Semi-Opaque (Linen Texture)",
    breathability: "Maximum Breathability (5.0 / 5.0)",
    wrinkleResistance: "Characteristic Natural Linen Patina",
    image: "/fabric_superviola_sand_linen.jpg",
    description:
      "Undyed natural oatmeal sand tone with authentic linen slub texture. Air-permeable, cool to the skin, and develops a richer softer hand-feel with each wear.",
    shortInfo: "60 Lea Pure Normandy Flax • 155 GSM",
    price: "Rs. 3,790 • BESPOKE FIT",
    bestFor: "Resort Tailoring, Relaxed Bespoke Shirts, Mandarin Collars, Gurkha Trousers",
    care: "Hand Wash Cold or Gentle Cycle • Line Dry • Steam Iron while Damp",
    accentColor: "#D6C6B0",
  }
];

// Hero visual collection images
const heroVisualImages = [
  {
    id: "hero-1",
    title: "Atelier Textile Vault & Rolls",
    image: "/about_fabric_rolls.jpg",
    fabricRef: atelierFabricsList[0]
  },
  {
    id: "hero-2",
    title: "Royal Emerald Velvet",
    image: "/fabric_roll_emerald_velvet.jpg",
    fabricRef: atelierFabricsList[1]
  },
  {
    id: "hero-3",
    title: "Bordeaux Silk Jacquard",
    image: "/fabric_roll_bordeaux_silk.jpg",
    fabricRef: atelierFabricsList[3]
  },
  {
    id: "hero-4",
    title: "Camel Cashmere Flannel",
    image: "/fabric_roll_camel_flannel.jpg",
    fabricRef: atelierFabricsList[8]
  }
];

export default function FabricsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeFabric, setActiveFabric] = useState<FabricItem>(atelierFabricsList[0]);
  const [activeHeroSlide, setActiveHeroSlide] = useState<number>(0);
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [swatchModalOpen, setSwatchModalOpen] = useState<boolean>(false);
  const [swatchRequested, setSwatchRequested] = useState<boolean>(false);
  const [savedFabrics, setSavedFabrics] = useState<Set<string>>(new Set());
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const filteredFabrics = selectedCategory === "all"
    ? atelierFabricsList
    : atelierFabricsList.filter((f) => f.category === selectedCategory);

  const handleHorizontalScroll = (direction: "left" | "right") => {
    if (horizontalScrollRef.current) {
      const scrollAmount = horizontalScrollRef.current.clientWidth * 0.75;
      horizontalScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleSaveFabric = (id: string) => {
    setSavedFabrics((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleSwatchRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSwatchRequested(true);
    setTimeout(() => {
      setSwatchModalOpen(false);
      setSwatchRequested(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header with active 'fabrics' tab indicator */}
      <Header activeTab="fabrics" />

      {/* ========================================================================= */}
      {/* 1. 100% PURE VISUAL FABRIC HERO BANNER (ZERO TEXT OVERLAYS ON IMAGE)      */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-24 sm:pt-28 lg:pt-32 pb-4 sm:pb-6 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1780px] w-full mx-auto space-y-4">
          
          {/* Main Pure Visual Fabric Showcase Frame (100% Clean Image, No Text) */}
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[540px] xl:h-[580px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden bg-[#1E1914] shadow-xl border border-white/60 group">
            
            {/* Active Hero Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroVisualImages[activeHeroSlide].image}
              alt={heroVisualImages[activeHeroSlide].title}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.02]"
              loading="eager"
            />

            {/* Left & Right Hero Navigation Arrows */}
            <button
              onClick={() => setActiveHeroSlide((prev) => (prev === 0 ? heroVisualImages.length - 1 : prev - 1))}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-white/20 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Previous Fabric"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setActiveHeroSlide((prev) => (prev === heroVisualImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-white/20 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Next Fabric"
            >
              <ChevronRight size={20} />
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HORIZONTAL FABRIC CATEGORIES ROW (MATCHING REFERENCE SCREENSHOT)       */}
      {/* ========================================================================= */}
      <FabricCategoryQuickRow
        activeCategoryId={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          const studioEl = document.getElementById("swatches-studio");
          if (studioEl) {
            studioEl.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      {/* ========================================================================= */}
      {/* 3. MASTER INTERACTIVE SWATCHES STUDIO & ARCHIVE                           */}
      {/* ========================================================================= */}
      <main id="swatches-studio" className="relative flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-10 sm:space-y-14">
        
        {/* Section Header & Filter Tabs */}
        <div className="space-y-4 border-b border-[#D5C2AF] pb-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal uppercase leading-tight text-[#14110E]">
                CURATED TEXTILE SWATCHES
              </h2>
              <p className="text-xs sm:text-sm text-[#55473A] font-sans mt-0.5 max-w-xl">
                Inspect high-magnification weave density, laboratory parameters, and launch bespoke custom fitting.
              </p>
            </div>

            {/* Refined Filter Tabs Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "ALL ATELIER (14)" },
                { id: "stripes", label: "GIZA STRIPES" },
                { id: "linen", label: "NORMANDY LINEN" },
                { id: "wool", label: "MERINO & CASHMERE" },
                { id: "velvet_silk", label: "VELVET & SILK" },
                { id: "oxford_twill", label: "OXFORD & TWILL" },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.14em] uppercase px-4 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
                      isActive
                        ? "bg-[#14110E] text-[#FAF8F5] border-[#14110E] shadow-sm ring-1 ring-[#14110E]"
                        : "bg-[#FAF5EF] hover:bg-white text-[#14110E] border-[#D5C2AF]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Master 12-Column Swatch Inspection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          
          {/* Left Column (5 Cols): Active Fabric Spec Card */}
          <div className="lg:col-span-5 bg-[#FAF5EF] border border-[#D5C2AF] rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-sm">
            
            {/* Header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between border-b border-[#D5C2AF]/80 pb-2.5">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase font-sans">
                  {activeFabric.categoryLabel}
                </span>
                <span className="font-mono text-xs font-bold text-[#14110E] bg-white px-3 py-1 rounded-lg border border-[#D5C2AF] shadow-2xs">
                  {activeFabric.code}
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold uppercase text-[#14110E] leading-snug">
                {activeFabric.name}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#55473A] font-sans leading-relaxed">
                {activeFabric.description}
              </p>
            </div>

            {/* Macro Texture Preview Box with Zoom Feature */}
            <div 
              onClick={() => setZoomModalOpen(true)}
              className="relative rounded-2xl overflow-hidden h-[240px] sm:h-[280px] bg-[#1E1914] border border-[#D5C2AF] shadow-inner cursor-zoom-in group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeFabric.image}
                alt={activeFabric.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 right-3 bg-[#14110E]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-md">
                <ZoomIn size={13} className="text-[#C5A069]" />
                <span>Magnify Weave</span>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">Composition</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.composition}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">Yarn Count &amp; Ply</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.yarnCount}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">Weave &amp; Weight</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.gsm} • {activeFabric.weight}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">Breathability</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.breathability}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/custom-shirt?fabric=${encodeURIComponent(activeFabric.code)}`}
                className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl transition-all duration-300 uppercase flex items-center justify-center gap-2 shadow-md group/btn"
              >
                <span>CUSTOMIZE SHIRT IN THIS FABRIC</span>
                <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setSwatchModalOpen(true)}
                className="w-full bg-white hover:bg-[#FAF5EF] text-[#14110E] border border-[#D5C2AF] text-[11px] font-bold tracking-[0.16em] py-2.5 rounded-xl transition-all duration-200 uppercase cursor-pointer shadow-2xs"
              >
                REQUEST PHYSICAL SWATCH SAMPLE
              </button>
            </div>

          </div>

          {/* Right Column (7 Cols): Swatches Grid Card Gallery */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 items-stretch">
            {filteredFabrics.map((fabric) => {
              const isSelected = activeFabric.id === fabric.id;
              return (
                <div
                  key={fabric.id}
                  onClick={() => setActiveFabric(fabric)}
                  className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 transition-all duration-300 border flex flex-col justify-between space-y-3 cursor-pointer group ${
                    isSelected
                      ? "bg-[#14110E] text-white border-[#14110E] shadow-xl ring-2 ring-[#9E774C]/60 scale-[1.02]"
                      : "bg-[#FAF5EF] hover:bg-white text-[#14110E] border-[#D5C2AF] hover:border-[#9E774C] shadow-2xs"
                  }`}
                >
                  {/* Swatch Square Image */}
                  <div className="relative rounded-xl overflow-hidden aspect-square w-full bg-[#221B16] border border-[#D5C2AF]/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Selected Check Pill */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 bg-[#9E774C] text-white p-1.5 rounded-full shadow-md">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Swatch Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9.5px] font-bold tracking-wider uppercase font-mono ${
                          isSelected ? "text-[#D8C7B5]" : "text-[#8C6D47]"
                        }`}
                      >
                        {fabric.code}
                      </span>
                      <span
                        className={`text-[8.5px] font-semibold uppercase ${
                          isSelected ? "text-white/60" : "text-[#6E5D4F]"
                        }`}
                      >
                        {fabric.category.replace("_", " & ").toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-serif-luxury text-xs sm:text-sm font-bold uppercase tracking-tight leading-snug line-clamp-1">
                      {fabric.name}
                    </h4>

                    <p
                      className={`text-[10px] sm:text-[10.5px] font-sans line-clamp-1 ${
                        isSelected ? "text-[#CDBEB0]" : "text-[#55473A]"
                      }`}
                    >
                      {fabric.composition}
                    </p>
                  </div>

                  {/* Click to Inspect Action */}
                  <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider">
                    <span>{isSelected ? "ACTIVE SELECTION" : "INSPECT SWATCH"}</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. MENSWEAR BESPOKE FABRICS SHOWCASE (MATCHING REFERENCE 4-CARD GRID)     */}
        {/* ========================================================================= */}
        <MensFabricShowcaseGrid
          onSelectCollection={(colId) => {
            const el = document.getElementById("swatches-studio");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* ========================================================================= */}
        {/* 4. MID-PAGE EDITORIAL BANNER: BESPOKE CUTTING TABLE                       */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-[#D5C2AF] bg-[#FAF5EF] p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 Cols): Narrative & 3 Metric Cards */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 bg-[#EFE5D9] px-3.5 py-1.5 rounded-full border border-[#D5C2AF]">
                <Scissors size={13} className="text-[#8C6D47]" />
                <span className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.22em] text-[#8C6D47] uppercase font-mono">
                  SARTORIAL PRECISION
                </span>
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal uppercase leading-[1.08] tracking-tight text-[#14110E]">
                INDIVIDUALLY DRAFTED &amp; HAND-CUT <br className="hidden sm:inline" />
                ON BESPOKE PATTERNS.
              </h2>

              <p className="text-xs sm:text-sm text-[#55473A] font-sans leading-relaxed">
                Before a single needle touches your chosen cloth, every meter is rested for 48 hours to neutralize weave tension, inspected under daylight lamps, and hand-chalked to your exact anatomical posture.
              </p>

              {/* 3 Metric Stats Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
                <div className="bg-white p-3.5 rounded-2xl border border-[#D5C2AF]/80 space-y-0.5 shadow-2xs">
                  <span className="font-serif-luxury text-base sm:text-xl font-bold text-[#8C6D47] block">140/2 Ne</span>
                  <span className="text-[10px] uppercase font-bold text-[#14110E] block">Two-Fold Giza Yarn</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#D5C2AF]/80 space-y-0.5 shadow-2xs">
                  <span className="font-serif-luxury text-base sm:text-xl font-bold text-[#8C6D47] block">100%</span>
                  <span className="text-[10px] uppercase font-bold text-[#14110E] block">Pure Plant Fibers</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#D5C2AF]/80 space-y-0.5 shadow-2xs">
                  <span className="font-serif-luxury text-base sm:text-xl font-bold text-[#8C6D47] block">0%</span>
                  <span className="text-[10px] uppercase font-bold text-[#14110E] block">Shrinkage Post-Wash</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 Cols): Bespoke Cutting Table Photography */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D5C2AF] shadow-md h-[240px] sm:h-[300px] relative bg-[#241D17] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/atelier_bespoke_editorial_bg.jpg"
                  alt="Suitoholic Bespoke Cutting Table with Pure Linen and Tailor Tools"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* MODAL: HIGH RESOLUTION WEAVE MAGNIFIER                                   */}
      {/* ========================================================================= */}
      {zoomModalOpen && (
        <div 
          onClick={() => setZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#14110E] border border-white/20 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 p-6 text-white"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <span className="font-mono text-xs text-[#C5A069] font-bold block">{activeFabric.code}</span>
                <h3 className="font-serif-luxury text-2xl font-bold uppercase">{activeFabric.name}</h3>
              </div>
              <button
                onClick={() => setZoomModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Close Magnifier"
              >
                <X size={20} />
              </button>
            </div>

            {/* Magnified Image Container */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#221B16] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeFabric.image}
                alt={activeFabric.name}
                className="w-full h-full object-cover object-center scale-125 transition-transform duration-700 cursor-zoom-in"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider border border-white/20">
                MAGNIFICATION: 3.5X HIGH-DEFINITION WEAVE
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#D8C6B3]">
              <div>
                <span className="block font-semibold text-white">{activeFabric.composition}</span>
                <span>{activeFabric.gsm} • {activeFabric.yarnCount}</span>
              </div>
              <Link
                href={`/custom-shirt?fabric=${encodeURIComponent(activeFabric.code)}`}
                className="bg-[#9E774C] hover:bg-[#B38C5F] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xl transition-all shadow-md"
              >
                SELECT IN CONFIGURATOR →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PHYSICAL SWATCH BOX REQUEST                                        */}
      {/* ========================================================================= */}
      {swatchModalOpen && (
        <div 
          onClick={() => setSwatchModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FAF5EF] border border-[#D5C2AF] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-[#14110E] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#D5C2AF] pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase font-mono block">ATELIER CONCIERGE</span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase">REQUEST SAMPLE SWATCH</h3>
              </div>
              <button
                onClick={() => setSwatchModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#14110E] transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {swatchRequested ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={26} />
                </div>
                <h4 className="font-serif-luxury text-lg font-bold uppercase text-[#14110E]">
                  Sample Box Dispatched
                </h4>
                <p className="text-xs text-[#55473A] max-w-sm mx-auto">
                  Your physical swatch of <strong>{activeFabric.name} ({activeFabric.code})</strong> has been queued for express courier dispatch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSwatchRequest} className="space-y-4 text-left">
                <p className="text-xs text-[#55473A]">
                  Receive a complimentary tactile swatch card of <strong>{activeFabric.name}</strong> delivered to your doorstep.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alexander Wright"
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Apartment, Street Address, City, Postal Code"
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      Phone Number (For Courier)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl transition-all duration-300 uppercase shadow-md cursor-pointer"
                >
                  DISPATCH SWATCH SAMPLE
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

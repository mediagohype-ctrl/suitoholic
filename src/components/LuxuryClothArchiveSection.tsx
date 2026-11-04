"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, X, ZoomIn, Plus, Scissors, ArrowRight, Check, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistProvider";
import { useCustomizer } from "@/context/CustomizerModalProvider";
import { useCatalog } from "@/context/SiteDataProvider";

export interface LuxuryClothItem {
  id: string;
  code: string;
  mill: string;
  weightGsm: number;
  weightLabel: string;
  fibre: string;
  composition: string;
  pattern: string;
  colour: string;
  season: string;
  use: string;
  drape: string;
  series: string;
  pricePerMetre: number;
  formattedPrice: string;
  image: string;
  description: string;
}

export const LUXURY_CLOTH_ITEMS: LuxuryClothItem[] = [
  {
    id: "cloth-prod-49",
    code: "SH-49",
    mill: "GIZA 140s",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Fine Twill Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2633,
    formattedPrice: "₹ 2,633",
    image: "/api/media/5/whatsapp-image-2026-10-27-at-1-06-36-pm-2.jpeg",
    description: "Coral Red Bold Bengal Stripe Twill Shirt - Premium twill weave striped shirt for a sharp, confident look.",
  },
  {
    id: "cloth-prod-50",
    code: "SH-50",
    mill: "NORMANDY FLAX",
    weightGsm: 155,
    weightLabel: "155 GSM",
    fibre: "Normandy Flax Linen",
    composition: "Premium Linen-Cotton Blend",
    pattern: "Artisanal Slub Linen",
    colour: "Classic White & Ivory",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Artisanal Linen Archive",
    pricePerMetre: 2600,
    formattedPrice: "₹ 2,600",
    image: "/api/media/6/whatsapp-image-2026-10-27-at-1-06-36-pm-3.jpeg",
    description: "Beige Textured Linen Cotton Shirt - Lightweight breathable textured shirt for effortless smart styling.",
  },
  {
    id: "cloth-prod-51",
    code: "SH-51",
    mill: "GIZA 160s",
    weightGsm: 140,
    weightLabel: "140 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "Ultra-Fine Cotton Satin Twill Blend",
    pattern: "Royal Oxford & Twill",
    colour: "Camel & Tan",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Imperial Sateen Archive",
    pricePerMetre: 2600,
    formattedPrice: "₹ 2,600",
    image: "/api/media/7/whatsapp-image-2026-10-27-at-2-47-01-pm-1.jpeg",
    description: "Dark Chocolate Brown Satin Twill Shirt - Luxurious silk-touch satin twill shirt with a rich lustrous finish.",
  },
  {
    id: "cloth-prod-52",
    code: "SH-52",
    mill: "ALBINI 1876",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% High-Grade Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Aegean & Sky Blue",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2600,
    formattedPrice: "₹ 2,600",
    image: "/api/media/8/whatsapp-image-2026-10-27-at-2-47-02-pm-2.jpeg",
    description: "Royal Blue Classic Bengal Stripe Twill Shirt - Sharp and timeless royal blue striped shirt in premium twill weave.",
  },
  {
    id: "cloth-prod-57",
    code: "SH-57",
    mill: "SUITOHOLIC",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Superfine Egyptian Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2699,
    formattedPrice: "₹ 2,699",
    image: "/api/media/23/whatsapp-image-2026-10-31-at-8-50-12-pm.jpeg",
    description: "Suitoholic Sage Green Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-58",
    code: "SH-58",
    mill: "COMO SILK",
    weightGsm: 145,
    weightLabel: "145 GSM",
    fibre: "Mulberry Silk Jacquard",
    composition: "100% Jacquard Spun Cotton Blend",
    pattern: "Plush Velvet & Jacquard",
    colour: "Bordeaux & Rose",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Ceremonial Heritage",
    pricePerMetre: 2799,
    formattedPrice: "₹ 2,799",
    image: "/api/media/24/whatsapp-image-2026-10-31-at-10-22-18-pm.jpeg",
    description: "Pastel Pink Striped Jacquard Shirt - Tailored Jacquard Striped Formal Shirt.",
  },
  {
    id: "cloth-prod-59",
    code: "SH-59",
    mill: "ALBINI 1876",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Extra-Long Staple Combed Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2799,
    formattedPrice: "₹ 2,799",
    image: "/api/media/25/whatsapp-image-2026-10-31-at-10-25-46-pm.jpeg",
    description: "Suitoholic Berry Pink Bengal Striped Twill Shirt - Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-60",
    code: "SH-60",
    mill: "GIZA 140s",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Compact Double-Twist Egyptian Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Obsidian Black",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2899,
    formattedPrice: "₹ 2,899",
    image: "/api/media/26/whatsapp-image-2026-10-31-at-10-25-47-pm.jpeg",
    description: "Suitoholic Classic Black & White Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-65",
    code: "SH-65",
    mill: "THOMAS MASON",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Long-Staple Egyptian Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Midnight Navy",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2999,
    formattedPrice: "₹ 2,999",
    image: "/api/media/31/whatsapp-image-2026-10-31-at-10-40-00-pm-1.jpeg",
    description: "Navy Blue Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-66",
    code: "SH-66",
    mill: "BIELLA ATELIER",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% High-Grade Double-Twist Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Charcoal & Slate",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2999,
    formattedPrice: "₹ 2,999",
    image: "/api/media/32/whatsapp-image-2026-10-31-at-10-40-00-pm-2.jpeg",
    description: "Charcoal Grey Bengal Striped Twill Shirt - Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-67",
    code: "SH-67",
    mill: "ALBINI 1876",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% 2-Ply Long-Staple Egyptian Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2899,
    formattedPrice: "₹ 2,899",
    image: "/api/media/33/whatsapp-image-2026-10-31-at-10-40-01-pm.jpeg",
    description: "Lavender Purple Bengal Striped Twill Shirt - Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-68",
    code: "SH-68",
    mill: "GIZA 140s",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Combed Double-Twist Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Charcoal & Slate",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2799,
    formattedPrice: "₹ 2,799",
    image: "/api/media/34/whatsapp-image-2026-10-31-at-10-40-01-pm-1.jpeg",
    description: "Light Grey Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-69",
    code: "SH-69",
    mill: "COMO SILK",
    weightGsm: 140,
    weightLabel: "140 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Long-Staple Egyptian Cotton (2-Ply)",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "Autumn / Winter Warmth",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3199,
    formattedPrice: "₹ 3,199",
    image: "/api/media/35/whatsapp-image-2026-10-31-at-10-40-01-pm-2.jpeg",
    description: "Deep Burgundy Bengal Striped Twill Shirt - Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-70",
    code: "SH-70",
    mill: "GIZA 160s",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Egyptian Giza 160s Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3200,
    formattedPrice: "₹ 3,200",
    image: "/api/media/36/whatsapp-image-2026-11-01-at-12-49-05-am.jpeg",
    description: "Wine Purple Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-71",
    code: "SH-71",
    mill: "SUITOHOLIC",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Fine Combed Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Camel & Tan",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3400,
    formattedPrice: "₹ 3,400",
    image: "/api/media/37/whatsapp-image-2026-11-01-at-12-49-05-am-1.jpeg",
    description: "Khaki Brown Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-72",
    code: "SH-72",
    mill: "THOMAS MASON",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    pattern: "Banker & Bengal Stripe",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3400,
    formattedPrice: "₹ 3,400",
    image: "/api/media/38/whatsapp-image-2026-11-01-at-12-49-06-am.jpeg",
    description: "Bottle Green Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-73",
    code: "SH-73",
    mill: "GIZA 140s",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Long-Staple Egyptian Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Aegean & Sky Blue",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3500,
    formattedPrice: "₹ 3,500",
    image: "/api/media/39/whatsapp-image-2026-11-01-at-12-49-06-am-1.jpeg",
    description: "Cornflower Blue Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-74",
    code: "SH-74",
    mill: "ALBINI 1876",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Extra-Long Staple Double-Twist Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Aegean & Sky Blue",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2900,
    formattedPrice: "₹ 2,900",
    image: "/api/media/40/whatsapp-image-2026-11-01-at-12-49-06-am-2.jpeg",
    description: "Sky Blue Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-75",
    code: "SH-75",
    mill: "BIELLA ATELIER",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% High-Grade Combed Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2800,
    formattedPrice: "₹ 2,800",
    image: "/api/media/41/whatsapp-image-2026-11-01-at-12-49-06-am-3.jpeg",
    description: "Forest Green Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-76",
    code: "SH-76",
    mill: "GIZA 140s",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2950,
    formattedPrice: "₹ 2,950",
    image: "/api/media/42/suitoholic-27-done-jpg.jpeg",
    description: "Baby Pink Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-77",
    code: "SH-77",
    mill: "ALBINI 1876",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Compact Double-Twist Egyptian Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Aegean & Sky Blue",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3000,
    formattedPrice: "₹ 3,000",
    image: "/api/media/43/suitoholic-26-done-jpg.jpeg",
    description: "French Blue Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-78",
    code: "SH-78",
    mill: "SUITOHOLIC",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Fine Combed Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Camel & Tan",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3100,
    formattedPrice: "₹ 3,100",
    image: "/api/media/44/suitoholic-25done-jpg.jpeg",
    description: "Caramel Brown Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-79",
    code: "SH-79",
    mill: "THOMAS MASON",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Superfine Egyptian Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3300,
    formattedPrice: "₹ 3,300",
    image: "/api/media/45/suitoholic-24-done-jpg.jpeg",
    description: "Olive Green Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-80",
    code: "SH-80",
    mill: "GIZA 160s",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Combed Giza 160s Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Aegean & Sky Blue",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3300,
    formattedPrice: "₹ 3,300",
    image: "/api/media/46/suitoholic-23-done-jpg.jpeg",
    description: "Ice Blue Bengal Striped Twill Shirt - Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-81",
    code: "SH-81",
    mill: "NORMANDY FLAX",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Extra-Long Staple Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Classic White & Ivory",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 2500,
    formattedPrice: "₹ 2,500",
    image: "/api/media/47/suitoholic-22-done-jpg.jpeg",
    description: "Beige Cream Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
  {
    id: "cloth-prod-82",
    code: "SH-82",
    mill: "SUITOHOLIC",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Fine Combed Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Camel & Tan",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Executive Bengal Stripe Archive",
    pricePerMetre: 3100,
    formattedPrice: "₹ 3,100",
    image: "/api/media/48/suitoholic-21-done-jpg.jpeg",
    description: "Coffee Brown Bengal Striped Twill Shirt - Classic Tailored Fit Striped Twill Formal Shirt.",
  },
];

interface FilterState {
  search: string;
  use: string;
  fibre: string;
  pattern: string;
  colour: string;
  season: string;
  mill: string;
  weight: string;
  sort: string;
}

const INITIAL_FILTERS: FilterState = {
  search: "",
  use: "ALL SERVICES",
  fibre: "ALL FABRICS",
  pattern: "ALL WEAVES",
  colour: "ALL COLOURS",
  season: "ALL SEASONS",
  mill: "ALL MILLS",
  weight: "ALL WEIGHTS",
  sort: "NAME A-Z",
};

interface LuxuryClothArchiveSectionProps {
  onSelectFabricForCustomizer?: (code: string) => void;
  onRequestSwatchModal?: (cloth: LuxuryClothItem) => void;
}

export default function LuxuryClothArchiveSection({
  onSelectFabricForCustomizer,
  onRequestSwatchModal,
}: LuxuryClothArchiveSectionProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openCustomizer } = useCustomizer();
  const { products } = useCatalog();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<LuxuryClothItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic cloth items from the backend admin dashboard
  const activeClothList = useMemo(() => {
    if (products && products.length > 0) {
      const adminProducts = products.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        if (["blazers", "trousers", "tshirts", "ceremonial"].includes(cat)) {
          return false;
        }
        const nameLower = (p.name || "").toLowerCase();
        if (/\b(blazer|blazers|jacket|jackets|trouser|trousers|pant|pants|chino|chinos|kurta|t-shirt|polo)\b/i.test(nameLower)) {
          return false;
        }
        const img = (p.image || "").toLowerCase();
        if (/\bshirt_([1-9]|1[0-1])\.jpg\b/i.test(img)) {
          return false;
        }
        return Boolean(p.image);
      });

      if (adminProducts.length > 0) {
        return adminProducts.map((p, index) => {
          const name = p.name || `Fabric ${index + 1}`;
          const nameLower = name.toLowerCase();

          let colour = "Classic White & Ivory";
          if (nameLower.includes("navy")) {
            colour = "Midnight Navy";
          } else if (nameLower.includes("blue") || nameLower.includes("azure") || nameLower.includes("sky") || nameLower.includes("french") || nameLower.includes("ice") || nameLower.includes("cornflower")) {
            colour = "Aegean & Sky Blue";
          } else if (nameLower.includes("green") || nameLower.includes("sage") || nameLower.includes("olive") || nameLower.includes("bottle") || nameLower.includes("forest")) {
            colour = "Sage & Olive Green";
          } else if (nameLower.includes("pink") || nameLower.includes("rose") || nameLower.includes("berry") || nameLower.includes("red") || nameLower.includes("burgundy") || nameLower.includes("wine") || nameLower.includes("purple") || nameLower.includes("lavender") || nameLower.includes("coral")) {
            colour = "Bordeaux & Rose";
          } else if (nameLower.includes("brown") || nameLower.includes("tan") || nameLower.includes("camel") || nameLower.includes("chocolate") || nameLower.includes("caramel") || nameLower.includes("khaki") || nameLower.includes("coffee")) {
            colour = "Camel & Tan";
          } else if (nameLower.includes("black")) {
            colour = "Obsidian Black";
          } else if (nameLower.includes("grey") || nameLower.includes("gray") || nameLower.includes("charcoal")) {
            colour = "Charcoal & Slate";
          } else if (nameLower.includes("terracotta")) {
            colour = "Tuscan Terracotta";
          }

          let pattern = "Banker & Bengal Stripe";
          if (nameLower.includes("linen") || nameLower.includes("slub")) {
            pattern = "Artisanal Slub Linen";
          } else if (nameLower.includes("jacquard") || nameLower.includes("velvet")) {
            pattern = "Plush Velvet & Jacquard";
          } else if (nameLower.includes("oxford")) {
            pattern = "Royal Oxford & Twill";
          } else if (nameLower.includes("twill") || nameLower.includes("satin")) {
            pattern = "Royal Oxford & Twill";
          }

          let fibre = "Egyptian Giza Cotton";
          if (nameLower.includes("linen")) {
            fibre = "Normandy Flax Linen";
          } else if (nameLower.includes("silk") || nameLower.includes("jacquard")) {
            fibre = "Mulberry Silk Jacquard";
          }

          let mill = "SUITOHOLIC";
          if (nameLower.includes("giza 160") || nameLower.includes("satin")) {
            mill = "GIZA 160s";
          } else if (nameLower.includes("albini") || index % 4 === 1) {
            mill = "ALBINI 1876";
          } else if (nameLower.includes("thomas") || index % 4 === 2) {
            mill = "THOMAS MASON";
          } else if (nameLower.includes("giza") || index % 4 === 3) {
            mill = "GIZA 140s";
          }

          const cleanImage = p.image.replace(/^https?:\/\/[^/]+(?=\/api\/media)/, "");
          const rawPrice = p.rawPrice || 2600;

          return {
            id: `cloth-prod-${p.id}`,
            code: p.tag && !p.tag.includes(" ") ? p.tag : `SH-${p.id}`,
            mill,
            weightGsm: 135,
            weightLabel: "135 GSM",
            fibre,
            composition: p.fabric || "100% Superfine Egyptian Giza Cotton",
            pattern,
            colour,
            season: "All-Season Bespoke",
            use: "Custom Shirts",
            drape: "Crisp & Breathable",
            series: "Executive Bengal Stripe Archive",
            pricePerMetre: rawPrice,
            formattedPrice: p.price || `₹ ${rawPrice.toLocaleString("en-IN")}`,
            image: cleanImage,
            description: p.description || p.subtitle || `${name} - Tailored from luxury Egyptian cotton twill.`,
          } as LuxuryClothItem;
        });
      }
    }
    return LUXURY_CLOTH_ITEMS;
  }, [products]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setActiveDropdown(null);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setActiveDropdown(null);
  };

  // Suitoholic Services and Offerings Filter Configurations
  const useOptions = useMemo(
    () => [
      "ALL SERVICES",
      "Custom Shirts",
      "Bespoke Suits & Tuxedos",
      "Sartorial Trousers & Gurkhas",
      "Ceremonial & Evening Wear",
    ],
    []
  );

  const fibreOptions = useMemo(
    () => [
      "ALL FABRICS",
      "Egyptian Giza Cotton",
      "Normandy Flax Linen",
      "Super 140s Merino Wool",
      "Cashmere & Flannel Blend",
      "Mulberry Silk Jacquard",
      "Royal Plush Velvet",
    ],
    []
  );

  const patternOptions = useMemo(
    () => [
      "ALL WEAVES",
      "Royal Oxford & Twill",
      "Banker & Bengal Stripe",
      "Artisanal Slub Linen",
      "3D Honeycomb Piqué",
      "Herringbone & Chevron",
      "Worsted Suiting Twill",
      "Plush Velvet & Jacquard",
    ],
    []
  );

  const colourOptions = useMemo(
    () => [
      "ALL COLOURS",
      "Classic White & Ivory",
      "Aegean & Sky Blue",
      "Midnight Navy",
      "Charcoal & Slate",
      "Tuscan Terracotta",
      "Sage & Olive Green",
      "Bordeaux & Rose",
      "Camel & Tan",
      "Obsidian Black",
    ],
    []
  );

  const seasonOptions = useMemo(
    () => [
      "ALL SEASONS",
      "All-Season Bespoke",
      "Spring / Summer Breathable",
      "Autumn / Winter Warmth",
    ],
    []
  );

  const millOptions = useMemo(
    () => [
      "ALL MILLS",
      "GIZA 140s",
      "GIZA 160s",
      "ALBINI 1876",
      "THOMAS MASON",
      "NORMANDY FLAX",
      "BIELLA ATELIER",
      "COMO SILK",
      "SUITOHOLIC",
    ],
    []
  );

  const weightOptions = useMemo(
    () => [
      "ALL WEIGHTS",
      "Lightweight Shirtings (<150 GSM)",
      "Medium Linens & Piqués (150 - 220 GSM)",
      "Structured Suiting & Velvet (>220 GSM)",
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      "NAME A-Z",
      "NAME Z-A",
      "PRICE: LOW TO HIGH",
      "PRICE: HIGH TO LOW",
      "WEIGHT: LIGHT TO HEAVY",
      "WEIGHT: HEAVY TO LIGHT",
    ],
    []
  );

  const FILTER_CONFIG = useMemo(
    () => [
      { key: "use", label: "SERVICE", allLabel: "ALL SERVICES", options: useOptions },
      { key: "fibre", label: "FABRIC", allLabel: "ALL FABRICS", options: fibreOptions },
      { key: "pattern", label: "WEAVE", allLabel: "ALL WEAVES", options: patternOptions },
      { key: "colour", label: "COLOUR", allLabel: "ALL COLOURS", options: colourOptions },
      { key: "season", label: "SEASON", allLabel: "ALL SEASONS", options: seasonOptions },
      { key: "mill", label: "MILL", allLabel: "ALL MILLS", options: millOptions },
      { key: "weight", label: "WEIGHT", allLabel: "ALL WEIGHTS", options: weightOptions },
    ],
    [useOptions, fibreOptions, patternOptions, colourOptions, seasonOptions, millOptions, weightOptions]
  );

  // Filtered and Sorted Cloths
  const filteredCloths = useMemo(() => {
    return activeClothList.filter((item) => {
      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          item.code.toLowerCase().includes(q) ||
          item.mill.toLowerCase().includes(q) ||
          item.fibre.toLowerCase().includes(q) ||
          item.composition.toLowerCase().includes(q) ||
          item.pattern.toLowerCase().includes(q) ||
          item.use.toLowerCase().includes(q) ||
          item.colour.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Service / Use
      if (filters.use !== "ALL SERVICES" && item.use !== filters.use) {
        return false;
      }

      // Fibre / Fabric
      if (filters.fibre !== "ALL FABRICS" && item.fibre !== filters.fibre) {
        return false;
      }

      // Pattern / Weave
      if (filters.pattern !== "ALL WEAVES" && item.pattern !== filters.pattern) {
        return false;
      }

      // Colour
      if (filters.colour !== "ALL COLOURS" && item.colour !== filters.colour) {
        return false;
      }

      // Season
      if (filters.season !== "ALL SEASONS" && item.season !== filters.season) {
        return false;
      }

      // Mill
      if (filters.mill !== "ALL MILLS" && item.mill !== filters.mill) {
        return false;
      }

      // Weight
      if (filters.weight !== "ALL WEIGHTS") {
        if (filters.weight === "Lightweight Shirtings (<150 GSM)" && item.weightGsm >= 150) return false;
        if (filters.weight === "Medium Linens & Piqués (150 - 220 GSM)" && (item.weightGsm < 150 || item.weightGsm > 220)) return false;
        if (filters.weight === "Structured Suiting & Velvet (>220 GSM)" && item.weightGsm <= 220) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sort) {
        case "NAME A-Z":
          return a.code.localeCompare(b.code);
        case "NAME Z-A":
          return b.code.localeCompare(a.code);
        case "PRICE: LOW TO HIGH":
          return a.pricePerMetre - b.pricePerMetre;
        case "PRICE: HIGH TO LOW":
          return b.pricePerMetre - a.pricePerMetre;
        case "WEIGHT: LIGHT TO HEAVY":
          return a.weightGsm - b.weightGsm;
        case "WEIGHT: HEAVY TO LIGHT":
          return b.weightGsm - a.weightGsm;
        default:
          return 0;
      }
    });
  }, [filters, activeClothList]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.use !== "ALL SERVICES" ||
    filters.fibre !== "ALL FABRICS" ||
    filters.pattern !== "ALL WEAVES" ||
    filters.colour !== "ALL COLOURS" ||
    filters.season !== "ALL SEASONS" ||
    filters.mill !== "ALL MILLS" ||
    filters.weight !== "ALL WEIGHTS";

  return (
    <section 
      id="swatches-studio" 
      aria-label="Master Luxury Bespoke Cloth Archive"
      className="w-full bg-[#ECEAE5] text-black py-12 sm:py-16 px-4 sm:px-6 lg:px-10 select-none border-b border-[#E5E3DD]"
    >
      <div className="max-w-[1720px] mx-auto space-y-6 sm:space-y-8">
        
        {/* =================================================================== */}
        {/* TOP ROW: SEARCH BAR, SORT DROPDOWN, COUNT & RESET BUTTON           */}
        {/* =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E3DD]">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search 
              size={17} 
              className="absolute left-0 top-1/2 -translate-y-1/2 text-black/60 stroke-[1.8] pointer-events-none" 
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search fabric, weave, code, or mill..."
              className="w-full bg-transparent pl-8 pr-8 py-2 text-xs sm:text-[13px] text-black placeholder:text-[#666666] border-b border-[#E5E3DD] hover:border-black focus:border-black outline-none font-sans tracking-wide transition-colors"
            />
            {filters.search && (
              <button 
                type="button"
                onClick={() => handleFilterChange("search", "")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Controls: Reset when filters active */}
          {hasActiveFilters && (
            <div className="flex items-center justify-end text-xs">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#666666] transition-colors cursor-pointer"
              >
                <X size={12} />
                <span>RESET</span>
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* FILTER BAR: SUITOHOLIC BESPOKE ATELIER SERVICES & SPECIFICATIONS     */}
        {/* =================================================================== */}
        <div 
          ref={dropdownRef}
          className="relative flex flex-wrap items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] uppercase z-30"
        >
          {FILTER_CONFIG.map(({ key, label, allLabel, options }) => {
            const currentVal = filters[key as keyof FilterState];
            const isSelected = currentVal !== allLabel;
            const isOpen = activeDropdown === key;

            return (
              <div key={key} className={`relative ${isOpen ? "z-50" : "z-20"}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(isOpen ? null : key);
                  }}
                  className={`px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-black text-white border-black shadow-xs"
                      : "bg-white hover:bg-[#F5F4F0] text-black border-[#E5E3DD] hover:border-black/40 shadow-xs"
                  }`}
                >
                  <span className={isSelected ? "text-neutral-300" : "text-[#666666]"}>{label}</span>
                  <span className="font-bold">{currentVal}</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-2 w-60 max-h-72 overflow-y-auto bg-white border border-[#E5E3DD] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {options.map((opt) => {
                      const active = currentVal === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleFilterChange(key as keyof FilterState, opt)}
                          className={`w-full text-left px-4 py-2 text-[10.5px] font-mono tracking-wider flex items-center justify-between hover:bg-[#F5F4F0] transition-colors cursor-pointer ${
                            active ? "text-black font-bold bg-[#F5F4F0]" : "text-[#666666]"
                          }`}
                        >
                          <span className="truncate pr-2">{opt}</span>
                          {active && <Check size={12} className="text-black shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* 6-COLUMN LUXURY CLOTH SWATCH GRID                                  */}
        {/* =================================================================== */}
        {filteredCloths.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="font-serif-luxury text-xl text-[#666666]">No cloth swatches match your selected filter criteria.</p>
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white rounded-full font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4.5 z-10 relative">
            {filteredCloths.map((cloth) => (
              <div
                key={cloth.id}
                onClick={() => setSelectedCloth(cloth)}
                className="group relative flex flex-col cursor-pointer select-none"
              >
                {/* Rectangular Vertical Swatch Image (3:4 ratio) */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-[#E5E3DD] group-hover:border-black group-hover:shadow-md transition-all duration-300 rounded-[16px]">
                  {/* Top-Right Heart Wishlist Button - Always Visible */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(cloth.id);
                    }}
                    type="button"
                    aria-label={isInWishlist(cloth.id) ? "Remove from wishlist" : "Save to wishlist"}
                    className="absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-xs transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-md cursor-pointer flex items-center justify-center opacity-100"
                  >
                    <Heart
                      size={15}
                      className={
                        isInWishlist(cloth.id)
                          ? "text-red-500 fill-red-500"
                          : "text-white fill-white/10 stroke-white stroke-[2]"
                      }
                    />
                  </button>

                  {/* Default Product Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cloth.image}
                    alt={`${cloth.mill} ${cloth.code} Swatch`}
                    className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Subtle ambient lighting overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 group-hover:opacity-40 transition-opacity" />

                  {/* Bottom-Right GSM Box Badge */}
                  <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 bg-white/95 backdrop-blur-xs text-black text-[8.5px] sm:text-[9px] font-mono font-bold tracking-wider border border-[#E5E3DD] shadow-xs rounded-full group-hover:opacity-0 transition-opacity">
                    {cloth.weightLabel}
                  </div>
                </div>

                {/* Information Block Below Swatch */}
                <div className="pt-2 sm:pt-2.5 pb-1 flex justify-between items-start gap-1.5">
                  
                  {/* Left Column: Fibre & Price/Metre sublabel */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-[11px] sm:text-xs font-semibold text-black uppercase tracking-wider truncate">
                      {cloth.fibre}
                    </div>

                    <div className="text-[8px] sm:text-[8.5px] text-[#666666] font-mono uppercase tracking-[0.18em]">
                      PRICE / METRE
                    </div>
                  </div>

                  {/* Right Column: Price */}
                  <div className="text-right flex flex-col justify-between items-end self-stretch shrink-0 pt-0.5">
                    <div className="text-xs sm:text-[13px] font-bold text-black transition-colors">
                      {cloth.formattedPrice}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openCustomizer({
                          id: cloth.id,
                          name: `${cloth.mill} ${cloth.code} Bespoke Shirt`,
                          image: cloth.image,
                          slug: cloth.id,
                          price: cloth.formattedPrice,
                          rawPrice: cloth.pricePerMetre,
                          fabric: `${cloth.mill} ${cloth.fibre}`,
                        });
                      }}
                      title="Customise Shirt in this fabric (6 Steps)"
                      aria-label={`Customise shirt in ${cloth.mill} ${cloth.code}`}
                      className="mt-1 w-6 h-6 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* =================================================================== */}
      {/* HIGH-MAGNIFICATION INTERACTIVE WEAVE INSPECTOR MODAL               */}
      {/* =================================================================== */}
      {selectedCloth && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => { setSelectedCloth(null); setZoomScale(1); }}
        >
          <div 
            className="relative w-full max-w-4xl bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => { setSelectedCloth(null); setZoomScale(1); }}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-black border border-[#E5E3DD] flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Left 6-Cols: Macro Weave Texture with Interactive Hover Magnification */}
            <div 
              className="md:col-span-6 h-[320px] md:h-[480px] relative overflow-hidden bg-[#ECEAE5] border-r border-[#E5E3DD] cursor-crosshair group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePos({ x, y });
              }}
              onMouseEnter={() => setZoomScale(2.4)}
              onMouseLeave={() => setZoomScale(1)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCloth.image}
                alt={`${selectedCloth.mill} ${selectedCloth.code} Texture`}
                className="w-full h-full object-cover transition-transform duration-150 ease-out will-change-transform"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: `scale(${zoomScale})`,
                }}
              />

              <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 text-[10px] font-mono tracking-widest text-black border border-[#E5E3DD] rounded-full shadow-xs">
                {selectedCloth.mill} • {selectedCloth.weightLabel}
              </div>

              {zoomScale > 1 ? (
                <div className="absolute bottom-3 right-3 bg-black px-3 py-1 text-[9.5px] font-mono text-white rounded-full shadow-sm">
                  2.4X MACRO ZOOM
                </div>
              ) : (
                <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 text-[10px] font-mono text-[#666666] border border-[#E5E3DD] rounded-full shadow-xs">
                  Hover to inspect weave texture
                </div>
              )}
            </div>

            {/* Right 6-Cols: Specifications & Actions */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E3DD] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#666666] font-bold tracking-[0.2em] uppercase block">
                      {selectedCloth.series}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-wide text-black">
                      {selectedCloth.code}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-[#666666] block tracking-widest">
                      PRICE / METRE
                    </span>
                    <span className="text-xl font-bold text-black font-mono">
                      {selectedCloth.formattedPrice}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-[#666666] leading-relaxed font-sans">
                  {selectedCloth.description}
                </p>

                {/* Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#E5E3DD]">
                    <span className="text-[#666666] text-[9px] block">PROVENANCE / MILL</span>
                    <span className="text-black font-semibold">{selectedCloth.mill}</span>
                  </div>
                  <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#E5E3DD]">
                    <span className="text-[#666666] text-[9px] block">GARMENT SERVICE</span>
                    <span className="text-black font-semibold">{selectedCloth.use}</span>
                  </div>
                  <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#E5E3DD]">
                    <span className="text-[#666666] text-[9px] block">COMPOSITION</span>
                    <span className="text-black font-semibold truncate block">{selectedCloth.composition}</span>
                  </div>
                  <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#E5E3DD]">
                    <span className="text-[#666666] text-[9px] block">WEIGHT & DRAPE</span>
                    <span className="text-black font-semibold">{selectedCloth.weightLabel} • {selectedCloth.drape}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href={
                    selectedCloth.use === "Custom Shirts"
                      ? `/custom-shirt?fabric=${encodeURIComponent(selectedCloth.code)}`
                      : `/shop`
                  }
                  onClick={() => onSelectFabricForCustomizer?.(selectedCloth.code)}
                  className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.2em] py-3.5 px-6 rounded-full transition-colors uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
                >
                  <Scissors size={14} />
                  <span>
                    {selectedCloth.use === "Custom Shirts"
                      ? "CUSTOMIZE SHIRT IN THIS FABRIC"
                      : "ORDER BESPOKE IN THIS FABRIC"}
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (onRequestSwatchModal) {
                      onRequestSwatchModal(selectedCloth);
                    }
                    setSelectedCloth(null);
                  }}
                  className="w-full bg-white hover:bg-[#F5F4F0] text-black border border-[#E5E3DD] text-[11px] font-bold tracking-wider py-3 rounded-full transition-colors uppercase cursor-pointer shadow-xs"
                >
                  REQUEST PHYSICAL SWATCH SAMPLE
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}

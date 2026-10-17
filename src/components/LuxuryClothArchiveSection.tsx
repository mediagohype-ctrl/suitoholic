"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, X, ZoomIn, Scissors, ArrowRight, Check } from "lucide-react";

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
    id: "cloth-gz-140",
    code: "GZ-140-WH",
    mill: "GIZA 140s",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Long-Staple Egyptian Giza 140s Cotton",
    pattern: "Royal Oxford & Twill",
    colour: "Classic White & Ivory",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Imperial Shirty Archive",
    pricePerMetre: 3290,
    formattedPrice: "₹3,290",
    image: "/fabric_roll_oxford_white.jpg",
    description: "Immaculate optic white 2-ply royal oxford with distinctive 2x2 micro-basketweave texture. Delivers exceptional drape, breathability, and timeless bespoke elegance.",
  },
  {
    id: "cloth-bs-140",
    code: "BS-140-NV",
    mill: "ALBINI 1876",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Compact Double-Twist Egyptian Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Aegean & Sky Blue",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Sartorial Executive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/fabric_roll_aegean_stripe.jpg",
    description: "Iconic Mediterranean Aegean blue bengal stripe shirting woven from long-staple Giza cotton. Crisp collar hold and smooth silken touch for boardroom dress shirts.",
  },
  {
    id: "cloth-ln-55-hb",
    code: "LN-55-HB",
    mill: "NORMANDY FLAX",
    weightGsm: 165,
    weightLabel: "165 GSM",
    fibre: "Normandy Flax Linen",
    composition: "100% Pure Normandy Flax Linen",
    pattern: "Herringbone & Chevron",
    colour: "Classic White & Ivory",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Artisanal Linen Archive",
    pricePerMetre: 3890,
    formattedPrice: "₹3,890",
    image: "/fabric_roll_herringbone.jpg",
    description: "Artisanal natural oatmeal linen woven in a subtle micro-chevron herringbone. Extremely airy, moisture-wicking, and softens luxuriously with every wash.",
  },
  {
    id: "cloth-tw-120-ib",
    code: "TW-120-IB",
    mill: "THOMAS MASON",
    weightGsm: 125,
    weightLabel: "125 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Extra-Long Staple Combed Giza Cotton",
    pattern: "Royal Oxford & Twill",
    colour: "Aegean & Sky Blue",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Imperial Shirty Archive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/fabric_roll_iceblue_twill.jpg",
    description: "Serene glacier ice blue shade with smooth micro-diagonal French twill ribbing. Pairs flawlessly with dark navy, charcoal, and beige tailoring.",
  },
  {
    id: "cloth-ln-55-tc",
    code: "LN-55-TC",
    mill: "NORMANDY FLAX",
    weightGsm: 165,
    weightLabel: "165 GSM",
    fibre: "Normandy Flax Linen",
    composition: "100% Pure Normandy Flax Linen",
    pattern: "Artisanal Slub Linen",
    colour: "Tuscan Terracotta",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Artisanal Linen Archive",
    pricePerMetre: 3890,
    formattedPrice: "₹3,890",
    image: "/fabric_roll_terracotta_linen.jpg",
    description: "Warm Tuscan terracotta clay tone with pronounced artisanal slub textures. Superior airflow and rustic elegance for resort tailoring and casual bespoke shirting.",
  },
  {
    id: "cloth-cf-280-cm",
    code: "CF-280-CM",
    mill: "BIELLA ATELIER",
    weightGsm: 280,
    weightLabel: "280 GSM",
    fibre: "Cashmere & Flannel Blend",
    composition: "90% Virgin Merino Wool, 10% Cashmere",
    pattern: "Worsted Suiting Twill",
    colour: "Camel & Tan",
    season: "Autumn / Winter Warmth",
    use: "Bespoke Suits & Tuxedos",
    drape: "Structured Crease-Resistant",
    series: "Master Bespoke Suiting",
    pricePerMetre: 5290,
    formattedPrice: "₹5,290",
    image: "/fabric_roll_camel_flannel.jpg",
    description: "Warm sartorial camel tan with a velvety brushed cashmere-wool surface. Exquisite warmth and featherlight luxury tailored for autumn blazers and 2-piece suiting.",
  },
  {
    id: "cloth-pq-120-sg",
    code: "PQ-120-SG",
    mill: "SUITOHOLIC",
    weightGsm: 160,
    weightLabel: "160 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Double-Mercerized Egyptian Piqué Cotton",
    pattern: "3D Honeycomb Piqué",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Sartorial Leisure",
    pricePerMetre: 3390,
    formattedPrice: "₹3,390",
    image: "/fabric_roll_waffle_sage.jpg",
    description: "Earthy botanical sage green with a tactile 3D honeycomb waffle knit structure. Superior air circulation, subtle texture contrast, and refined smart-casual luxury.",
  },
  {
    id: "cloth-sj-200-bx",
    code: "SJ-200-BX",
    mill: "COMO SILK",
    weightGsm: 145,
    weightLabel: "145 GSM",
    fibre: "Mulberry Silk Jacquard",
    composition: "100% Pure Mulberry Silk & Long-Staple Cotton",
    pattern: "Plush Velvet & Jacquard",
    colour: "Bordeaux & Rose",
    season: "All-Season Bespoke",
    use: "Ceremonial & Evening Wear",
    drape: "Soft & Fluid",
    series: "Ceremonial Heritage",
    pricePerMetre: 4290,
    formattedPrice: "₹4,290",
    image: "/fabric_roll_bordeaux_silk.jpg",
    description: "Deep bordeaux ruby jewel tone with luminous silk-touch luster. Woven on precision jacquard looms for black-tie dinner jackets, festive bandhgalas, and luxury bespoke vests.",
  },
  {
    id: "cloth-vl-300-em",
    code: "VL-300-EM",
    mill: "COMO SILK",
    weightGsm: 300,
    weightLabel: "300 GSM",
    fibre: "Royal Plush Velvet",
    composition: "100% Spun Micro-Velvet Silk Blend",
    pattern: "Plush Velvet & Jacquard",
    colour: "Sage & Olive Green",
    season: "Autumn / Winter Warmth",
    use: "Ceremonial & Evening Wear",
    drape: "Plush & Luminous Fall",
    series: "Ceremonial Heritage",
    pricePerMetre: 4490,
    formattedPrice: "₹4,490",
    image: "/fabric_roll_emerald_velvet.jpg",
    description: "Opulent royal emerald green velvet with deep multidimensional sheen and feather-soft hand feel. Engineered for evening statements, smoking jackets, and red-carpet bandhgalas.",
  },
  {
    id: "cloth-wl-140-ch",
    code: "WL-140-CH",
    mill: "BIELLA ATELIER",
    weightGsm: 260,
    weightLabel: "260 GSM",
    fibre: "Super 140s Merino Wool",
    composition: "100% Australian Super 140s Worsted Merino Wool",
    pattern: "Worsted Suiting Twill",
    colour: "Charcoal & Slate",
    season: "All-Season Bespoke",
    use: "Bespoke Suits & Tuxedos",
    drape: "Structured Crease-Resistant",
    series: "Master Bespoke Suiting",
    pricePerMetre: 4990,
    formattedPrice: "₹4,990",
    image: "/fabric_roll_charcoal_wool.jpg",
    description: "Sleek charcoal slate melange with superfine Australian merino wool fibers. Naturally fluid drape with impeccable crease recovery engineered for bespoke 2-piece and 3-piece suiting.",
  },
  {
    id: "cloth-tw-904-bk",
    code: "TW-904-BK",
    mill: "GIZA 160s",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Egyptian Giza 160s Combed Cotton",
    pattern: "Royal Oxford & Twill",
    colour: "Obsidian Black",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Imperial Shirty Archive",
    pricePerMetre: 3690,
    formattedPrice: "₹3,690",
    image: "/fabric_roll_diamond_twill.jpg",
    description: "Intense midnight obsidian black with subtle diagonal micro-diamond luster. Soft yet structured, crafted for dramatic black formal dress shirts and tuxedo accents.",
  },
  {
    id: "cloth-cd-280-ol",
    code: "CD-280-OL",
    mill: "SUITOHOLIC",
    weightGsm: 270,
    weightLabel: "270 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Heavy Structured Compact Drill Cotton",
    pattern: "Royal Oxford & Twill",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Sartorial Trousers & Gurkhas",
    drape: "Structured Crease-Resistant",
    series: "Sartorial Leisure",
    pricePerMetre: 3590,
    formattedPrice: "₹3,590",
    image: "/fabric_roll_cavalry_drill.jpg",
    description: "Heavyweight olive cavalry drill with prominent diagonal double-rib ridges. Robust, structured, and ideal for durable bespoke Gurkha trousers and safari overshirts.",
  },
  {
    id: "cloth-sh-403-ry",
    code: "SH-403-RY",
    mill: "GIZA 140s",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Long-Staple Egyptian Giza 140s Cotton (2-Ply)",
    pattern: "Banker & Bengal Stripe",
    colour: "Aegean & Sky Blue",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Sartorial Executive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/fabric_sh403_royal_stripe.jpg",
    description: "High-density fine royal blue banker stripe. Elegant micro-rib twill texture engineered for executive business shirts with cutaway or classic spread collars.",
  },
  {
    id: "cloth-sh-403-rs",
    code: "SH-403-RS",
    mill: "GIZA 140s",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Sartorial Executive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/fabric_sh403_rose_stripe.jpg",
    description: "Blossom rose executive banker stripe woven in double-twisted 140/2 Ne Egyptian yarn. Subtle pastel warmth with crisp boardroom presence.",
  },
  {
    id: "cloth-lv-140-st",
    code: "LV-140-ST",
    mill: "ALBINI 1876",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% 2-Ply Long-Staple Egyptian Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Bordeaux & Rose",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Sartorial Executive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/fabric_roll_lavender_stripe.jpg",
    description: "Pastel lavender hairline pinstripe on pure white base. Feather-light hand feel with silken luster, perfect for formal summer shirting.",
  },
  {
    id: "cloth-md-140-st",
    code: "MD-140-ST",
    mill: "THOMAS MASON",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Giza 140s Double-Twist Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Midnight Navy",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Imperial Shirty Archive",
    pricePerMetre: 3590,
    formattedPrice: "₹3,590",
    image: "/fabric_roll_midnight_stripe.jpg",
    description: "Bold midnight navy awning stripe with sharp contrast definition. Striking statement piece tailored for spread collar dress shirts.",
  },
  {
    id: "cloth-sg-140-st",
    code: "SG-140-ST",
    mill: "GIZA 140s",
    weightGsm: 130,
    weightLabel: "130 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Egyptian Giza 140s Combed Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Sartorial Executive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/fabric_roll_sage_stripe.jpg",
    description: "Sartorial sage green track stripe on an ivory background. Sophisticated contemporary palette for business-casual bespoke shirts.",
  },
  {
    id: "cloth-em-140-tw",
    code: "EM-140-TW",
    mill: "GIZA 140s",
    weightGsm: 140,
    weightLabel: "140 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Extra-Long Staple Double-Twist Cotton",
    pattern: "Royal Oxford & Twill",
    colour: "Sage & Olive Green",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Imperial Shirty Archive",
    pricePerMetre: 3690,
    formattedPrice: "₹3,690",
    image: "/fabric_roll_emerald_twill.jpg",
    description: "Rich forest emerald twill with soft luster and diagonal weave clarity. Designed for elevated dress shirts and Mandarin collar evening styles.",
  },
  {
    id: "cloth-sp-160-tw",
    code: "SP-160-TW",
    mill: "GIZA 160s",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Superfine Egyptian Giza 160s Cotton",
    pattern: "Royal Oxford & Twill",
    colour: "Midnight Navy",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Imperial Shirty Archive",
    pricePerMetre: 3890,
    formattedPrice: "₹3,890",
    image: "/fabric_roll_sapphire_twill.jpg",
    description: "Imperial sapphire blue 160s fine diagonal twill. Unsurpassed weave tightness with natural silk-like sheen and wrinkle recovery.",
  },
  {
    id: "cloth-es-140-pq",
    code: "ES-140-PQ",
    mill: "SUITOHOLIC",
    weightGsm: 160,
    weightLabel: "160 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Mercerized Egyptian Piqué Cotton",
    pattern: "3D Honeycomb Piqué",
    colour: "Camel & Tan",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Sartorial Leisure",
    pricePerMetre: 3390,
    formattedPrice: "₹3,390",
    image: "/fabric_roll_espresso_pique.jpg",
    description: "Deep espresso brown 3D micro-piqué with subtle natural stretch. Breathable, tactile, and engineered for tailored resort shirts and polo collars.",
  },
  {
    id: "cloth-flx-dg",
    code: "FLX-1069-DG",
    mill: "NORMANDY FLAX",
    weightGsm: 160,
    weightLabel: "160 GSM",
    fibre: "Normandy Flax Linen",
    composition: "100% Pre-Washed Artisanal Normandy Linen",
    pattern: "Artisanal Slub Linen",
    colour: "Charcoal & Slate",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Soft & Fluid",
    series: "Artisanal Linen Archive",
    pricePerMetre: 3890,
    formattedPrice: "₹3,890",
    image: "/fabric_flx01069_dove_grey_linen.jpg",
    description: "Dove grey washed artisanal flax linen. Luxuriously soft against bare skin with organic slub texture that keeps you cool in summer humidity.",
  },
  {
    id: "cloth-st-169-tc",
    code: "ST-16974-TC",
    mill: "SUITOHOLIC",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Fine Combed Giza Cotton",
    pattern: "Banker & Bengal Stripe",
    colour: "Tuscan Terracotta",
    season: "Spring / Summer Breathable",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Sartorial Executive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/fabric_st16974_terracotta_stripe.jpg",
    description: "Warm terracotta multi-stripe shirting with subtle sand contrast. Distinctive artisanal character tailored for weekend bespoke shirts.",
  },
  {
    id: "cloth-sv-sand-ln",
    code: "SV-01-SD",
    mill: "NORMANDY FLAX",
    weightGsm: 190,
    weightLabel: "190 GSM",
    fibre: "Normandy Flax Linen",
    composition: "100% Heavy Pure Flax Linen",
    pattern: "Artisanal Slub Linen",
    colour: "Camel & Tan",
    season: "Spring / Summer Breathable",
    use: "Sartorial Trousers & Gurkhas",
    drape: "Crisp & Breathable",
    series: "Artisanal Linen Archive",
    pricePerMetre: 3990,
    formattedPrice: "₹3,990",
    image: "/fabric_superviola_sand_linen.jpg",
    description: "Natural sand heavy flax linen with substantial body. Perfectly suited for relaxed Gurkha trousers, pleated chinos, and summer safari overshirts.",
  },
  {
    id: "cloth-fb-navy-st",
    code: "FB-200-NV",
    mill: "THOMAS MASON",
    weightGsm: 135,
    weightLabel: "135 GSM",
    fibre: "Egyptian Giza Cotton",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    pattern: "Banker & Bengal Stripe",
    colour: "Midnight Navy",
    season: "All-Season Bespoke",
    use: "Custom Shirts",
    drape: "Crisp & Breathable",
    series: "Sartorial Executive",
    pricePerMetre: 3490,
    formattedPrice: "₹3,490",
    image: "/formal_banker_stripe.jpg",
    description: "Classic deep navy formal banker stripe on optic white ground. Razor-sharp definition, exceptional colorfastness, and timeless business elegance.",
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
  drape: string;
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
  drape: "ALL DRAPE",
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
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<LuxuryClothItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const drapeOptions = useMemo(
    () => [
      "ALL DRAPE",
      "Crisp & Breathable",
      "Soft & Fluid",
      "Structured Crease-Resistant",
      "Plush & Luminous Fall",
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
      { key: "drape", label: "DRAPE", allLabel: "ALL DRAPE", options: drapeOptions },
    ],
    [useOptions, fibreOptions, patternOptions, colourOptions, seasonOptions, millOptions, weightOptions, drapeOptions]
  );

  // Filtered and Sorted Cloths
  const filteredCloths = useMemo(() => {
    return LUXURY_CLOTH_ITEMS.filter((item) => {
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

      // Drape
      if (filters.drape !== "ALL DRAPE" && item.drape !== filters.drape) {
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
  }, [filters]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.use !== "ALL SERVICES" ||
    filters.fibre !== "ALL FABRICS" ||
    filters.pattern !== "ALL WEAVES" ||
    filters.colour !== "ALL COLOURS" ||
    filters.season !== "ALL SEASONS" ||
    filters.mill !== "ALL MILLS" ||
    filters.weight !== "ALL WEIGHTS" ||
    filters.drape !== "ALL DRAPE";

  return (
    <section 
      id="swatches-studio" 
      aria-label="Master Luxury Bespoke Cloth Archive"
      className="w-full bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F8] to-[#EEE5EA]/40 text-[#14110E] py-12 sm:py-16 px-4 sm:px-6 lg:px-10 select-none border-b border-[#DDD2D8]"
    >
      <div className="max-w-[1720px] mx-auto space-y-6 sm:space-y-8">
        
        {/* =================================================================== */}
        {/* TOP ROW: SEARCH BAR, SORT DROPDOWN, COUNT & RESET BUTTON           */}
        {/* =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DDD2D8]">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search 
              size={17} 
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9E774C] stroke-[1.8] pointer-events-none" 
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search fabric, weave, code, or mill..."
              className="w-full bg-transparent pl-8 pr-8 py-2 text-xs sm:text-[13px] text-[#14110E] placeholder:text-[#7A6B5D] border-b border-[#DDD2D8] hover:border-[#9E774C] focus:border-[#4A202A] outline-none font-sans tracking-wide transition-colors"
            />
            {filters.search && (
              <button 
                type="button"
                onClick={() => handleFilterChange("search", "")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#7A6B5D] hover:text-[#4A202A] p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Controls: Sort, Cloth Count & Reset */}
          <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-7 text-xs">
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === "sort" ? null : "sort");
                }}
                className="flex items-center gap-1.5 text-[#55473A] hover:text-[#14110E] font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span className="text-[#7A6B5D]">SORT</span>
                <span className="text-[#4A202A] font-bold">{filters.sort}</span>
                <ChevronDown size={13} className={`text-[#7A6B5D] transition-transform duration-200 ${activeDropdown === "sort" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "sort" && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#DDD2D8] rounded-xl shadow-[0_12px_36px_rgba(74,32,42,0.14)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleFilterChange("sort", opt)}
                      className={`w-full text-left px-3.5 py-2 text-[11px] font-mono tracking-wider flex items-center justify-between hover:bg-[#FAF6F8] transition-colors cursor-pointer ${
                        filters.sort === opt ? "text-[#4A202A] font-bold bg-[#FAF6F8]" : "text-[#55473A]"
                      }`}
                    >
                      <span>{opt}</span>
                      {filters.sort === opt && <Check size={12} className="text-[#4A202A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Total Cloths Counter */}
            <div className="text-[#7A6B5D] font-mono text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
              <span className="text-[#14110E] font-bold">{filteredCloths.length}</span> CLOTHS
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#9E774C] hover:text-[#4A202A] transition-colors cursor-pointer"
              >
                <X size={12} />
                <span>RESET</span>
              </button>
            )}
          </div>
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
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#4A202A] text-white border-[#4A202A] shadow-xs"
                      : "bg-white hover:bg-[#FAF6F8] text-[#14110E] border-[#DDD2D8] hover:border-[#4A202A]/40 shadow-2xs"
                  }`}
                >
                  <span className={isSelected ? "text-[#D5C2AF]" : "text-[#7A6B5D]"}>{label}</span>
                  <span className="font-bold">{currentVal}</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-2 w-60 max-h-72 overflow-y-auto bg-white border border-[#DDD2D8] rounded-xl shadow-[0_12px_36px_rgba(74,32,42,0.14)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {options.map((opt) => {
                      const active = currentVal === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleFilterChange(key as keyof FilterState, opt)}
                          className={`w-full text-left px-3.5 py-2 text-[10.5px] font-mono tracking-wider flex items-center justify-between hover:bg-[#FAF6F8] transition-colors cursor-pointer ${
                            active ? "text-[#4A202A] font-bold bg-[#FAF6F8]" : "text-[#55473A]"
                          }`}
                        >
                          <span className="truncate pr-2">{opt}</span>
                          {active && <Check size={12} className="text-[#4A202A] shrink-0" />}
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
            <p className="font-serif-luxury text-xl text-[#7A6B5D]">No cloth swatches match your selected filter criteria.</p>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#4A202A] hover:bg-[#34141D] text-white rounded-lg font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
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
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF6F8] border border-[#DDD2D8] group-hover:border-[#4A202A]/70 group-hover:shadow-[0_10px_25px_rgba(74,32,42,0.12)] transition-all duration-300 rounded-[3px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cloth.image}
                    alt={`${cloth.mill} ${cloth.code} Swatch`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  
                  {/* Subtle ambient lighting overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 group-hover:opacity-60 transition-opacity" />

                  {/* Top-Left Mill / Collection Box Badge */}
                  <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-[#14110E]/90 backdrop-blur-xs text-[#FAF8F5] text-[8.5px] sm:text-[9px] font-mono tracking-[0.16em] uppercase rounded-[2px] shadow-sm">
                    {cloth.mill}
                  </div>

                  {/* Bottom-Right GSM Box Badge */}
                  <div className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 bg-white/95 backdrop-blur-xs text-[#4A202A] text-[8.5px] sm:text-[9px] font-mono font-bold tracking-wider border border-[#DDD2D8] shadow-2xs rounded-[2px]">
                    {cloth.weightLabel}
                  </div>

                  {/* Hover Inspect Pill */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="px-3 py-1.5 bg-[#4A202A]/95 text-white backdrop-blur-md rounded-full border border-[#9E774C]/50 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                      <ZoomIn size={12} className="text-[#FAF8F5]" />
                      <span>INSPECT</span>
                    </div>
                  </div>
                </div>

                {/* Information Block Below Swatch */}
                <div className="pt-2 sm:pt-2.5 pb-1 flex justify-between items-start gap-1.5">
                  
                  {/* Left Column: Code, Fibre, Price/Metre sublabel, Garment Service Use */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs sm:text-[13px] font-bold text-[#14110E] tracking-wider font-mono">
                      {cloth.code}
                    </div>

                    <div className="text-[9.5px] sm:text-[10px] font-semibold text-[#55473A] uppercase tracking-wider truncate">
                      {cloth.fibre}
                    </div>

                    <div className="text-[8px] sm:text-[8.5px] text-[#9E774C] font-mono uppercase tracking-[0.18em]">
                      PRICE / METRE
                    </div>

                    <div className="text-[10px] sm:text-[10.5px] text-[#4A202A] italic font-serif-luxury truncate">
                      {cloth.use}
                    </div>
                  </div>

                  {/* Right Column: Season & Price */}
                  <div className="text-right flex flex-col justify-between items-end self-stretch space-y-1 shrink-0">
                    <div className="text-[8.5px] sm:text-[9px] font-mono text-[#7A6B5D] uppercase tracking-wider">
                      {cloth.season}
                    </div>

                    <div className="text-xs sm:text-[13px] font-bold text-[#4A202A] group-hover:text-[#34141D] transition-colors">
                      {cloth.formattedPrice}
                    </div>
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
            className="relative w-full max-w-4xl bg-white border border-[#DDD2D8] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 text-[#14110E]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => { setSelectedCloth(null); setZoomScale(1); }}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#55473A] hover:text-[#14110E] border border-[#DDD2D8] flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Left 6-Cols: Macro Weave Texture with Interactive Hover Magnification */}
            <div 
              className="md:col-span-6 h-[320px] md:h-[480px] relative overflow-hidden bg-[#FAF6F8] border-r border-[#DDD2D8] cursor-crosshair group"
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

              <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[10px] font-mono tracking-widest text-[#4A202A] border border-[#DDD2D8] shadow-xs">
                {selectedCloth.mill} • {selectedCloth.weightLabel}
              </div>

              {zoomScale > 1 ? (
                <div className="absolute bottom-3 right-3 bg-[#4A202A] px-2 py-1 text-[9.5px] font-mono text-white rounded shadow-sm">
                  2.4X MACRO ZOOM
                </div>
              ) : (
                <div className="absolute bottom-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] font-mono text-[#55473A] border border-[#DDD2D8] rounded shadow-xs">
                  Hover to inspect weave texture
                </div>
              )}
            </div>

            {/* Right 6-Cols: Specifications & Actions */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-gradient-to-b from-white via-[#FAF6F8] to-[#EEE5EA]/50">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#DDD2D8] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#9E774C] font-bold tracking-[0.2em] uppercase block">
                      {selectedCloth.series}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-wide text-[#14110E]">
                      {selectedCloth.code}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-[#7A6B5D] block tracking-widest">
                      PRICE / METRE
                    </span>
                    <span className="text-xl font-bold text-[#4A202A] font-mono">
                      {selectedCloth.formattedPrice}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-[#55473A] leading-relaxed font-sans">
                  {selectedCloth.description}
                </p>

                {/* Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-2.5 bg-white rounded border border-[#DDD2D8] shadow-2xs">
                    <span className="text-[#7A6B5D] text-[9px] block">PROVENANCE / MILL</span>
                    <span className="text-[#14110E] font-semibold">{selectedCloth.mill}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#DDD2D8] shadow-2xs">
                    <span className="text-[#7A6B5D] text-[9px] block">GARMENT SERVICE</span>
                    <span className="text-[#4A202A] font-semibold">{selectedCloth.use}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#DDD2D8] shadow-2xs">
                    <span className="text-[#7A6B5D] text-[9px] block">COMPOSITION</span>
                    <span className="text-[#14110E] font-semibold truncate block">{selectedCloth.composition}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#DDD2D8] shadow-2xs">
                    <span className="text-[#7A6B5D] text-[9px] block">WEIGHT & DRAPE</span>
                    <span className="text-[#14110E] font-semibold">{selectedCloth.weightLabel} • {selectedCloth.drape}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href={
                    selectedCloth.use === "Custom Shirts"
                      ? `/custom-shirt?fabric=${encodeURIComponent(selectedCloth.code)}`
                      : `/shop`
                  }
                  onClick={() => onSelectFabricForCustomizer?.(selectedCloth.code)}
                  style={{ borderRadius: "6px" }}
                  className="w-full bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] py-3 transition-colors uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md group"
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
                  style={{ borderRadius: "6px" }}
                  className="w-full bg-white hover:bg-[#FAF6F8] text-[#14110E] border border-[#DDD2D8] text-[11px] font-mono tracking-wider py-2.5 transition-colors uppercase cursor-pointer shadow-2xs"
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

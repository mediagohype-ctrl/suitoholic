"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import {
  Scissors,
  Ruler,
  ShieldCheck,
  Award,
  ArrowRight,
  Globe2,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Truck,
  Layers,
  Shirt,
  Crown,
} from "lucide-react";

// =========================================================================
// 1. Core Services / Product Categories Data
// =========================================================================
const companyServices = [
  {
    id: "custom-shirts",
    title: "Bespoke & Custom Shirts",
    tagline: "100% Egyptian Giza 140s Cotton",
    description:
      "Individually cut to your posture with 22 stitches per inch, split yoke construction, and hand-shanked Australian mother-of-pearl buttons. Choose from over 15 collar, cuff, and monogram styles.",
    image: "/prod_classic_white.jpg",
    link: "/custom-shirt",
    buttonText: "CUSTOMIZE SHIRT",
    highlights: ["Split 45° Yoke", "Mother-of-Pearl", "22 SPI Single-Needle"],
  },
  {
    id: "tailored-suits",
    title: "Made-to-Measure Suits & Blazers",
    tagline: "Biella Super 130s–150s Worsted Wool",
    description:
      "Hand-crafted with natural floating horsehair canvas that molds to your chest. Available in single-breasted, double-breasted, and formal tuxedo silhouettes with full custom linings.",
    image: "/blazer_navy_wool.jpg",
    link: "/shop",
    buttonText: "VIEW SUITS",
    highlights: ["Floating Canvas", "Italian Worsted Wool", "Hand-Rolled Lapels"],
  },
  {
    id: "sartorial-trousers",
    title: "Sartorial Trousers & Gurkhas",
    tagline: "Pure Linen, Wool & Cotton Twill",
    description:
      "Engineered with classic Gurkha waistband tabs, side adjusters, deep pleats, and clean straight drapes. Cut to eliminate waistband pinching and provide all-day comfort.",
    image: "/pant_gurkha_olive.jpg",
    link: "/shop",
    buttonText: "VIEW TROUSERS",
    highlights: ["Gurkha Waistbands", "Side Adjusters", "Reinforced Crotch"],
  },
  {
    id: "ceremonial-wear",
    title: "Ceremonial & Evening Wear",
    tagline: "Bandhgalas, Tuxedos & Silk Ensembles",
    description:
      "Exquisite ceremonial garments for black-tie galas, weddings, and formal banquets. Features structured stand collars, satin lapels, and opulent silk-blend textures.",
    image: "/ceremonial_bandhgala.jpg",
    link: "/shop",
    buttonText: "EXPLORE CEREMONIAL",
    highlights: ["Stand Collar Structure", "Silk-Blend Luster", "Bespoke Finishing"],
  },
];

// =========================================================================
// 2. The 4-Step Tailoring Process Data
// =========================================================================
const tailoringProcessSteps = [
  {
    step: "01",
    title: "Cloth & Styling Selection",
    subtitle: "Over 200+ Luxury Fabrics",
    description:
      "Select your preferred fabric from our curated library of Italian Super 150s wools, Egyptian Giza cottons, and Belgian linens. Choose collar shape, cuff architecture, button style, and custom embroidery.",
  },
  {
    step: "02",
    title: "40-Point Fit Algorithm",
    subtitle: "2-Minute Digital Fitting",
    description:
      "Enter your simple height, weight, and fit preferences. Our proprietary 40-point measurement vector system calculates your precise chest, shoulder slope, arm pitch, and waist dimensions without a tailor visit.",
  },
  {
    step: "03",
    title: "Master Atelier Handcraft",
    subtitle: "Individual 1-of-1 Pattern Drafting",
    description:
      "Your order is never pulled from stock. A bespoke paper pattern is drafted specifically for your posture, hand-cut by master cutters, and sewn using single-needle 22 SPI construction.",
  },
  {
    step: "04",
    title: "Insured Delivery & 100% Fit Guarantee",
    subtitle: "Complimentary Alterations Included",
    description:
      "Your garment arrives steamed in our luxury packaging. If any adjustment is needed, we cover full alteration costs or provide a complimentary remake within 30 days.",
  },
];

// =========================================================================
// 3. Interactive Craftsmanship Hallmarks
// =========================================================================
const anatomyFeatures = [
  {
    id: "split-yoke",
    number: "01",
    title: "Split Yoke Construction",
    subtitle: "Ergonomic 45° Diagonal Bias Cut",
    description:
      "Unlike mass-market shirts with a single flat piece of fabric across the upper back, our master cutters divide the yoke into two symmetrical halves cut at a 45-degree diagonal bias. This allows the natural weave of the cotton to stretch and move with your shoulder blades, preventing tightness across the back during movement.",
    image: "/about_craft_split_yoke.jpg",
    metric: "45° Diagonal Bias",
    detailBadge: "ERGONOMIC DRAPE",
  },
  {
    id: "floating-canvas",
    number: "02",
    title: "Hand-Basted Floating Canvas",
    subtitle: "Natural Horsehair & Linen Architecture",
    description:
      "We strictly reject thermal chemical glues and fused synthetic backings. Instead, our tailors hand-stitch loose layers of natural horsehair and linen canvas between the cloth layers. Over time, your natural body heat molds the floating canvas to your exact chest contours for a bespoke silhouette that only improves with age.",
    image: "/about_craft_floating_canvas.jpg",
    metric: "100% Natural Canvas",
    detailBadge: "BREATHABLE MEMORY",
  },
  {
    id: "stitch-density",
    number: "03",
    title: "22 Stitches-Per-Inch Seaming",
    subtitle: "Ultra-Fine Single-Needle French Seams",
    description:
      "Standard industrial dress shirts settle for 12 to 14 loose stitches per inch. Suitoholic enforces an exacting 22 SPI standard executed with single-needle French seams. The outcome is an exceptionally strong, wafer-thin seam line that lays perfectly flat against the skin and resists puckering after laundering.",
    image: "/about_craft_buttons_shell.jpg",
    metric: "22 SPI Micro-Stitch",
    detailBadge: "SINGLE-NEEDLE CRAFT",
  },
  {
    id: "mop-buttons",
    number: "04",
    title: "Australian Mother-of-Pearl",
    subtitle: "Hand Cross-Stitched with Thread Shanks",
    description:
      "Every button is precision-carved from genuine deep-sea Australian mother-of-pearl oyster shell, characterized by its natural iridescence and cool tactile weight. Each button is hand cross-stitched with a raised thread shank, allowing it to glide smoothly through buttonholes without pulling the fabric.",
    image: "/about_craft_buttons_shell.jpg",
    metric: "4.0mm Genuine Shell",
    detailBadge: "PACIFIC PEARL",
  },
  {
    id: "french-cuff",
    number: "05",
    title: "Dual-Use Convertible Cuffs",
    subtitle: "Precision Mitered Edges & Swiss Interlining",
    description:
      "Constructed with lightweight floating Swiss interlining that retains a crisp, elegant roll without ever feeling stiff or cardboard-like. Designed with convertible dual buttonholes so you can wear them with mother-of-pearl buttons for daytime business or insert formal cufflinks for black-tie galas.",
    image: "/about_craft_cuff_link.jpg",
    metric: "Dual Convertible",
    detailBadge: "FORMAL VERSATILITY",
  },
];

// =========================================================================
// 4. Heritage Milestones Data
// =========================================================================
const heritageMilestones = [
  {
    year: "2003",
    tag: "THE INCEPTION",
    location: "New Delhi Atelier",
    title: "The First Cutting Bench",
    subtitle: "Reclaiming the uncompromising art of individual pattern drafting.",
    story:
      "Suitoholic was founded by master bespoke cutters trained in heritage tailoring. Frustrated by the shortcuts of industrial ready-to-wear sizing, they committed to a singular standard: every single garment must begin from a fresh individual paper pattern drafted by hand to the client's unique physique and shoulder pitch.",
    image: "/about_heritage_2003_archive.jpg",
    photoCaption: "Master Tailor Bespoke Cutting Bench • Est. 2003",
    metricLabel: "ESTABLISHED",
    metricValue: "NEW DELHI, INDIA",
  },
  {
    year: "2009",
    tag: "PROVENANCE",
    location: "Biella, Italy & Nile Delta",
    title: "Direct Textile Mill Alliances",
    subtitle: "Securing exclusive access to the world's purest natural fibers.",
    story:
      "To guarantee uncompromising cloth quality, we bypassed commercial fabric wholesalers to establish direct procurement agreements with multi-generational weaving mills in Biella, Northern Italy (for Super 150s worsted wool) and agricultural cooperatives in Egypt's Nile Delta (for authentic 140s Extra-Long Staple Giza cotton).",
    image: "/about_heritage_mill_loom.jpg",
    photoCaption: "Historic Biella Woolen Looms • Piedmont, Italy",
    metricLabel: "TEXTILE INTEGRITY",
    metricValue: "100% TRACEABLE",
  },
  {
    year: "2016",
    tag: "DIGITAL BESPOKE",
    location: "Research & Design Atelier",
    title: "40-Point Anatomical Master Fit",
    subtitle: "Savile Row precision engineered into an intuitive digital fitting room.",
    story:
      "Drawing from over a decade of bespoke cutting records, our tailors mapped 40 individual body measurement vectors. This allowed clients across the globe to achieve true Savile Row drape and proportion online in under two minutes, eliminating the requirement for multiple in-person fittings.",
    image: "/about_hero_cutting_table.jpg",
    photoCaption: "40-Point Vector Pattern Architecture",
    metricLabel: "FIT PRECISION",
    metricValue: "40 VECTORS",
  },
  {
    year: "2023",
    tag: "20-YEAR MILESTONE",
    location: "Global Sartorial Presence",
    title: "Two Decades of Craftsmanship",
    subtitle: "Over 150,000 bespoke garments delivered across 42 countries.",
    story:
      "Celebrating twenty years of sartorial leadership, Suitoholic has dressed heads of state, corporate leaders, and menswear connoisseurs worldwide. Maintaining a 99.4% first-fit accuracy rate, we cemented our reputation as one of the world's most trusted bespoke institutions.",
    image: "/about_craft_floating_canvas.jpg",
    photoCaption: "Hand-Basted Floating Canvas Craftsmanship",
    metricLabel: "GLOBAL CLIENTELE",
    metricValue: "42 COUNTRIES",
  },
  {
    year: "Today",
    tag: "SUSTAINABLE LUXURY",
    location: "Flagship Salons Worldwide",
    title: "The Zero-Waste Sartorial House",
    subtitle: "100% on-demand garment creation with zero warehouse overproduction.",
    story:
      "We remain fiercely dedicated to ethical on-demand craft. We manufacture zero mass-market stock, produce zero deadstock fabric waste, and craft exclusively with biodegradable natural fibers—demonstrating that true luxury is sustainable by design.",
    image: "/about_atelier_salon_cta.jpg",
    photoCaption: "Bespoke Flagship Fitting Salon & Atelier",
    metricLabel: "PRODUCTION MODEL",
    metricValue: "100% ON-DEMAND",
  },
];

export default function AboutPage() {
  const [activeBlueprintIndex, setActiveBlueprintIndex] = useState(0);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  const activeBlueprint = anatomyFeatures[activeBlueprintIndex];
  const activeMilestone = heritageMilestones[activeMilestoneIndex];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-transparent text-[#14110E] antialiased">
      {/* Global Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16 space-y-12 sm:space-y-16 lg:space-y-20 select-none">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Brand Mission & What Suitoholic Does                     */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] overflow-hidden shadow-[0_20px_50px_rgba(20,17,14,0.06)] p-6 sm:p-10 lg:p-14 xl:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Brand Declaration & Core Business Model */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">

              {/* Main Luxury Serif Heading */}
              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-[52px] xl:text-[60px] font-normal uppercase leading-[1.04] tracking-tight text-[#14110E]">
                BESPOKE TAILORING. <br />
                <span className="italic font-light text-[#8C6D47]">
                  ENGINEERED FOR YOUR INDIVIDUAL SILHOUETTE.
                </span>
              </h1>

              {/* Company Summary */}
              <p className="text-xs sm:text-sm lg:text-[15.5px] text-[#55473A] leading-relaxed font-sans font-normal max-w-xl">
                Suitoholic is an authentic bespoke and made-to-measure tailoring house. We craft custom dress shirts, canvas-constructed suits, precision trousers, and ceremonial wear—cut from pure natural fibers and individually drafted to your exact measurements with a <strong>100% Fit Guarantee</strong>.
              </p>

              {/* 4 Core Operational Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-[#D5C2AF]">
                <div className="space-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#14110E] block leading-none">
                    40+
                  </span>
                  <span className="text-[9.5px] sm:text-[10.5px] text-[#8C6D47] uppercase font-bold tracking-wider block font-sans">
                    Fit Data Vectors
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#14110E] block leading-none">
                    100%
                  </span>
                  <span className="text-[9.5px] sm:text-[10.5px] text-[#8C6D47] uppercase font-bold tracking-wider block font-sans">
                    Fit Guarantee
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#14110E] block leading-none">
                    140s
                  </span>
                  <span className="text-[9.5px] sm:text-[10.5px] text-[#8C6D47] uppercase font-bold tracking-wider block font-sans">
                    Egyptian Giza
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#14110E] block leading-none">
                    22 SPI
                  </span>
                  <span className="text-[9.5px] sm:text-[10.5px] text-[#8C6D47] uppercase font-bold tracking-wider block font-sans">
                    Single-Needle
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/custom-shirt"
                  className="bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[11px] sm:text-xs font-bold tracking-[0.2em] px-8 sm:px-10 py-4 transition-all duration-300 uppercase shadow-md flex items-center gap-2 group whitespace-nowrap"
                >
                  <span>3D CUSTOM FIT CONFIGURATOR</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/shop"
                  className="bg-transparent hover:bg-black/5 text-[#14110E] border border-[#14110E]/40 hover:border-[#14110E] text-[11px] sm:text-xs font-bold tracking-[0.2em] px-7 sm:px-8 py-4 transition-all duration-300 uppercase whitespace-nowrap"
                >
                  READY-TO-WEAR
                </Link>
              </div>

            </div>

            {/* Right Column: Authentic Editorial Atelier Cutting Bench Visual (Clean text-free presentation) */}
            <div className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#D5C2AF] h-[360px] sm:h-[480px] lg:h-[540px] bg-[#1E1915] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about_hero_cutting_table.jpg"
                alt="Suitoholic Master Bespoke Cutting Table"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                loading="eager"
              />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. WHAT WE CRAFT: The 4 Core Garment Categories & Services                */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          
          {/* Section Header */}
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
              WHAT WE CRAFT <br />
              <span className="italic font-light text-[#8C6D47]">FOR DISCERNING GENTLEMEN.</span>
            </h2>
          </div>

          {/* 4 Garment Offering Cards Grid matching Home Page Formation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-stretch">
            {companyServices.map((srv) => (
              <div
                key={srv.id}
                className="group flex flex-col w-full justify-between space-y-3"
              >
                {/* Upper Tall Rounded Image Container - Clean Pure Photography */}
                <div className="relative w-full aspect-[3/4.2] min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1E1914] shadow-md transition-all duration-500 group-hover:shadow-xl border border-[#D5C2AF]/50">
                  <Link href={srv.link} className="block w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* Lower Details Strip: Clean & Short Information */}
                <div className="flex flex-col justify-between space-y-2.5 px-0.5">
                  <div className="space-y-0.5">
                    <Link href={srv.link} className="block">
                      <h3 className="font-serif-luxury text-base sm:text-[17px] font-bold text-[#14110E] group-hover:text-[#9E774C] transition-colors uppercase tracking-tight leading-snug">
                        {srv.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] sm:text-xs text-[#8C6D47] font-medium tracking-wide uppercase font-sans">
                      {srv.tagline}
                    </p>
                  </div>

                  <Link
                    href={srv.link}
                    className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] py-3 rounded-xl transition-all duration-300 uppercase flex items-center justify-center gap-2 shadow-xs group/btn mt-1"
                  >
                    <span>{srv.buttonText}</span>
                    <ArrowRight size={13} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. HOW IT WORKS: The 4-Step Bespoke Journey                               */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#FAF5EF] border border-[#DAC8B6] p-6 sm:p-10 lg:p-14 xl:p-16 space-y-8 lg:space-y-10 shadow-sm">
          
          {/* Section Header */}
          <div className="max-w-2xl space-y-2.5">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
              HOW OUR TAILORING <br />
              <span className="italic font-light text-[#8C6D47]">PROCESS WORKS.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4D40] font-sans">
              From choosing your Italian cloth to receiving a master-tailored garment at your doorstep in four seamless steps.
            </p>
          </div>

          {/* 4 Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {tailoringProcessSteps.map((st) => (
              <div
                key={st.step}
                className="bg-[#EFE5D9] border border-[#D5C2AF] rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-bold text-[#9E774C]">
                      {st.step}
                    </span>
                    <span className="text-[9px] font-bold text-[#8C6D47] uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded border border-[#D5C2AF]">
                      PHASE {st.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-[15px] uppercase tracking-wide text-[#14110E]">
                    {st.title}
                  </h3>
                  <div className="text-[11px] font-serif italic text-[#8C6D47]">
                    {st.subtitle}
                  </div>
                  <p className="text-xs text-[#55473A] leading-relaxed font-sans">
                    {st.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D5C2AF] flex items-center gap-1.5 text-[10px] font-bold text-[#14110E] uppercase">
                  <CheckCircle2 size={13} className="text-[#8C6D47]" />
                  <span>Precision Guaranteed</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. CRAFTSMANSHIP BLUEPRINT: Anatomy of a Bespoke Garment                  */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] p-6 sm:p-10 lg:p-14 xl:p-16 space-y-8">
          
          {/* Section Header */}
          <div className="max-w-2xl space-y-2.5">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
              ANATOMY OF A <br />
              <span className="italic font-light text-[#8C6D47]">SUITOHOLIC GARMENT.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4D40] font-sans">
              Select any hallmark below to inspect the micro-tailoring standards enforced across every bespoke shirt and suit.
            </p>
          </div>

          {/* Blueprint Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-2">
            
            {/* Left Column: 5 Interactive Feature Selectors */}
            <div className="lg:col-span-5 space-y-2.5 flex flex-col justify-between">
              {anatomyFeatures.map((feat, idx) => {
                const isActive = activeBlueprintIndex === idx;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveBlueprintIndex(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 border flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? "bg-[#14110E] text-[#FAF8F5] border-[#14110E] shadow-md scale-[1.01]"
                        : "bg-white/60 hover:bg-white text-[#14110E] border-[#DAC8B6] hover:border-[#9E774C]"
                    }`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <span
                        className={`font-serif text-sm sm:text-base font-bold transition-colors ${
                          isActive ? "text-[#C5A069]" : "text-[#9E774C]"
                        }`}
                      >
                        {feat.number}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-[13px] font-bold tracking-wide uppercase truncate">
                          {feat.title}
                        </h4>
                        <p
                          className={`text-[10px] sm:text-[11px] font-sans truncate ${
                            isActive ? "text-[#D8C7B5]" : "text-[#6B5A4D]"
                          }`}
                        >
                          {feat.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform ${
                        isActive
                          ? "text-[#C5A069] translate-x-1"
                          : "text-[#9E774C] group-hover:translate-x-0.5 opacity-60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Blueprint Deep-Dive Display Card */}
            <div className="lg:col-span-7 bg-[#FAF5EF] border border-[#D5C0AB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 shadow-sm relative overflow-hidden">
              
              {/* Top Row: Metric & Badge */}
              <div className="flex items-center justify-between border-b border-[#D5C0AB] pb-4">
                <span className="inline-flex items-center gap-2 text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase bg-white px-3 py-1 rounded-full border border-[#D5C0AB]">
                  {activeBlueprint.detailBadge}
                </span>
                <span className="font-serif font-bold text-sm sm:text-base text-[#14110E]">
                  STANDARD: {activeBlueprint.metric}
                </span>
              </div>

              {/* Center Content: Title & Rich Story */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-[#14110E]">
                  {activeBlueprint.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-[15px] text-[#4A3D31] leading-relaxed font-sans font-normal">
                  {activeBlueprint.description}
                </p>
              </div>

              {/* High-Resolution Macro Craft Visual (Clean text-free presentation) */}
              <div className="relative rounded-xl overflow-hidden h-[200px] sm:h-[240px] border border-[#D5C0AB] bg-[#1E1915] shadow-inner group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeBlueprint.image}
                  alt={activeBlueprint.title}
                  className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                />
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 5. HERITAGE CHRONICLE ARCHIVE (Interactive Documentary Exhibition)        */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] overflow-hidden shadow-lg p-6 sm:p-10 lg:p-14 xl:p-16 space-y-8 lg:space-y-10">
          
          {/* Top Row: Section Tag & Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D5C2AF]">
            <div className="space-y-2">
              <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
                TWO DECADES OF <br />
                <span className="italic font-light text-[#8C6D47]">SARTORIAL LEADERSHIP.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5C4D40] max-w-md font-sans">
              From our first bespoke cutting table to dressing leaders across 42 countries. Select a milestone below to explore our historical archives.
            </p>
          </div>

          {/* Interactive Era Milestone Nav Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            {heritageMilestones.map((ms, idx) => {
              const isActive = activeMilestoneIndex === idx;
              return (
                <button
                  key={ms.year}
                  onClick={() => setActiveMilestoneIndex(idx)}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 border text-left cursor-pointer group flex flex-col justify-between space-y-2 ${
                    isActive
                      ? "bg-[#14110E] text-[#FAF8F5] border-[#14110E] shadow-md scale-[1.01]"
                      : "bg-white/70 hover:bg-white text-[#14110E] border-[#DAC8B6] hover:border-[#9E774C]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${
                        isActive ? "text-[#C5A069]" : "text-[#14110E]"
                      }`}
                    >
                      {ms.year}
                    </span>
                    <span
                      className={`text-[8.5px] sm:text-[9.5px] font-bold tracking-widest uppercase ${
                        isActive ? "text-[#D8C7B5]" : "text-[#8C6D47]"
                      }`}
                    >
                      {ms.tag}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">
                    {ms.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Era Deep-Dive Card with Archival Photo & Historical Story */}
          <div className="bg-[#FAF5EF] border border-[#DAC8B6] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Historical Narrative */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Year & Location Header */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal text-[#9E774C] leading-none">
                    {activeMilestone.year}
                  </span>
                  <div className="h-8 w-[1px] bg-[#D5C2AF] hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#14110E]">
                    <MapPin size={14} className="text-[#8C6D47]" />
                    <span>{activeMilestone.location}</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-[#14110E]">
                    {activeMilestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-serif italic text-[#8C6D47]">
                    &ldquo;{activeMilestone.subtitle}&rdquo;
                  </p>
                </div>

                {/* Full Historical Story */}
                <p className="text-xs sm:text-sm lg:text-[15px] text-[#4A3D31] leading-relaxed font-sans font-normal">
                  {activeMilestone.story}
                </p>

                {/* Archive Metric Badge */}
                <div className="pt-3 border-t border-[#DAC8B6] flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D47]">
                    ARCHIVAL BENCHMARK: {activeMilestone.metricLabel}
                  </span>
                  <span className="font-bold text-[#14110E] tracking-wider uppercase">
                    {activeMilestone.metricValue}
                  </span>
                </div>

              </div>

              {/* Right Column: High-Res Archival Documentary Photo */}
              <div className="lg:col-span-5 space-y-2">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-[#D5C2AF] h-[240px] sm:h-[290px] lg:h-[320px] bg-[#1E1915] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeMilestone.image}
                    alt={activeMilestone.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Photo Caption Plate (Below image, not on top) */}
                <div className="flex items-center justify-between text-[10.5px] text-[#55473A] px-1">
                  <span>{activeMilestone.photoCaption}</span>
                  <span className="font-mono text-[9.5px] text-[#8C6D47] uppercase font-bold">Suitoholic Archive</span>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 6. COMPANY CONCIERGE & FLAGSHIP SERVICES                                 */}
        {/* ========================================================================= */}
        <section className="bg-[#FAF5EF] border border-[#DAC8B6] rounded-2xl sm:rounded-3xl lg:rounded-[36px] p-6 sm:p-10 lg:p-12 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal uppercase text-[#14110E]">
              TAILORING CONCIERGE &amp; APPOINTMENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
            
            {/* Service 1: Flagship Bespoke Fitting */}
            <div className="bg-[#EFE5D9] border border-[#D5C2AF] rounded-2xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#14110E] text-[#FAF8F5] flex items-center justify-center">
                <Scissors size={18} className="text-[#C5A069]" />
              </div>
              <h4 className="font-bold text-sm uppercase text-[#14110E] tracking-wider">
                Flagship Studio Fitting
              </h4>
              <p className="text-xs text-[#55473A] leading-relaxed">
                Experience personal one-on-one master draper consultations at our flagship studio. Try fabric swatches, drape sample canvases, and configure your bespoke wardrobe.
              </p>
              <div className="text-[11px] font-medium text-[#8C6D47] pt-1">
                Mon–Sat: 10:00 AM – 8:30 PM
              </div>
            </div>

            {/* Service 2: Corporate & Wedding Concierge */}
            <div className="bg-[#EFE5D9] border border-[#D5C2AF] rounded-2xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#14110E] text-[#FAF8F5] flex items-center justify-center">
                <Crown size={18} className="text-[#C5A069]" />
              </div>
              <h4 className="font-bold text-sm uppercase text-[#14110E] tracking-wider">
                Wedding &amp; Executive Ensembles
              </h4>
              <p className="text-xs text-[#55473A] leading-relaxed">
                Dedicated sartorial wardrobe curation for grooms, black-tie celebrations, and executive leadership teams with private group fitting sessions.
              </p>
              <div className="text-[11px] font-medium text-[#8C6D47] pt-1">
                Custom Monograms &amp; Silk Linings
              </div>
            </div>

            {/* Service 3: 100% Fit Guarantee & Alterations */}
            <div className="bg-[#EFE5D9] border border-[#D5C2AF] rounded-2xl p-6 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#14110E] text-[#FAF8F5] flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#C5A069]" />
              </div>
              <h4 className="font-bold text-sm uppercase text-[#14110E] tracking-wider">
                30-Day Fit Guarantee
              </h4>
              <p className="text-xs text-[#55473A] leading-relaxed">
                Every online custom order is backed by our full fit pledge. If any adjustment is needed, we cover local alteration costs or remake the garment free of charge.
              </p>
              <div className="text-[11px] font-medium text-[#8C6D47] pt-1">
                Zero Risk • Doorstep Remake
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. GRAND ATELIER SALON INVITATION (CTA)                                  */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] overflow-hidden shadow-lg p-6 sm:p-10 lg:p-14 xl:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: CTA Pitch */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-[54px] font-normal uppercase leading-[1.06] text-[#14110E]">
                EXPERIENCE TRUE <br />
                <span className="italic font-light text-[#8C6D47]">BESPOKE LUXURY.</span>
              </h2>
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#55473A] leading-relaxed font-sans max-w-xl">
                Step into our digital fitting room. Customize your collar shape, cuff style, pocket architecture, and bespoke monogram in under two minutes — tailored by master artisans and delivered with our 100% Fit Guarantee.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/custom-shirt"
                  className="bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] px-8 sm:px-10 py-4 transition-all duration-300 uppercase shadow-md flex items-center gap-2 group whitespace-nowrap"
                >
                  <span>START YOUR CUSTOM FIT</span>
                  <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/shop"
                  className="bg-transparent hover:bg-black/5 text-[#14110E] border border-[#14110E]/40 hover:border-[#14110E] text-xs font-bold tracking-[0.2em] px-7 sm:px-9 py-4 transition-all duration-300 uppercase whitespace-nowrap"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>
            </div>

            {/* Right Column: Architectural Salon Photograph (Clean text-free presentation) */}
            <div className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#D5C2AF] h-[320px] sm:h-[400px] lg:h-[440px] bg-[#221B16] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about_atelier_salon_cta.jpg"
                alt="Suitoholic Bespoke Sartorial Salon & Fitting Lounge"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />
            </div>

          </div>
        </section>

      </main>

      {/* Feature Highlights Bar */}
      <FeatureHighlightsBar />

      {/* Global Luxury Footer */}
      <Footer />
    </div>
  );
}

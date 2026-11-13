"use client";

import React, { useState, useEffect } from "react";
import MannequinShirtViewer, { getShirtColorFamily } from "@/components/MannequinShirtViewer";
import { CollarIllustration, CuffIllustration } from "@/components/customizer/StyleIllustrations";
import { ArrowLeft, Check, X, Scissors, Plus, RefreshCw, ChevronDown, ShoppingBag, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { fillTemplate } from "@/content/merge";
import { useCatalog, useContent, useSettings } from "@/context/SiteDataProvider";
import { useCart } from "@/context/CartProvider";
import { useWishlist } from "@/context/WishlistProvider";
import { formatMoney } from "@/lib/api";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";
import type { CustomFit, ProductItem } from "@/lib/types";

import { EIGHT_CANONICAL_SISTER_SHIRTS } from"@/data/products";

export type CustomFitState = CustomFit;

export interface CustomizationModalProduct {
  id?: number | string;
  name: string;
  image: string;
  gallery?: string[];
  slug?: string;
  price?: string;
  rawPrice?: number;
  category?: string;
  fabric?: string;
  colorways?: unknown[];
}

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  /** The product being customised; its photo drives the fabric chip and the detail/review previews. */
  product?: CustomizationModalProduct | null;
  initialChestSize?: number;
  /** Disables the final button while the bag request is in flight. */
  submitting?: boolean;
  onConfirmCustomization: (customFit: CustomFitState, chosenProduct?: CustomizationModalProduct | ProductItem | null) => void | Promise<void>;
}

type MannequinFit ="lean" |"regular" |"tummy";
const asMannequinFit = (fit: string): MannequinFit => (fit ==="regular" || fit ==="tummy" ? fit :"lean");

function getSuggestionThumbnail(p: any): string {
  if (p?.image) return p.image;
  if (p?.gallery && p.gallery.length > 0) return p.gallery[0];
  return"/new_shirts/shirt_21.jpg";
}

function getShortShirtTitle(name: string): string {
  const n = (name || "").toUpperCase();
  if (n.includes("WHITE") && (n.includes("OXFORD") || n.includes("PINPOINT"))) return "White Oxford";
  if (n.includes("TERRACOTTA") || n.includes("CORAL")) return "Terracotta Coral";
  if (n.includes("ESPRESSO") || n.includes("DARK")) return "Dark Espresso";
  if (n.includes("SANDSTONE") || n.includes("LINEN") || n.includes("OATMEAL")) return "Sandstone Linen";
  if (n.includes("WHITE") || n.includes("CRISP")) return "Crisp White";
  if (n.includes("SKY") || n.includes("OXFORD")) return "Sky Blue Oxford";
  if (n.includes("SOLID") || (n.includes("MIDNIGHT") && n.includes("NAVY"))) return "Midnight Navy";
  if (n.includes("CHARCOAL") || n.includes("ANTHRACITE")) return "Charcoal Twill";
  if (n.includes("PINSTRIPE") || n.includes("BENGAL") || n.includes("NAVY")) return "Navy Pinstripe";
  return name.replace(/FORMAL|SAVILE ROW/gi, "").trim();
}

function MeasuringTapeIcon({ className = "w-[22px] h-[16px]" }: { className?: string }) {
  return (
    <svg
      className={`${className} shrink-0 inline-block`}
      viewBox="0 0 25 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Overall ivory background fill */}
      <path
        d="M2.3 4.8 C2.3 2.5 5.5 1.4 9.5 1.4 C13.5 1.4 16.7 2.5 16.7 4.8 V9.8 H23.5 L21.8 12.3 L23.5 14.8 H8.5 C4.8 14.8 2.3 13.2 2.3 11 Z"
        fill="#FFFDF8"
      />

      {/* Hollow inner hole shading */}
      <ellipse cx="9.5" cy="4.8" rx="4.5" ry="1.9" fill="#EBD9C6" stroke="#874B1E" strokeWidth="1.15" />

      {/* Top rim outer ellipse */}
      <ellipse cx="9.5" cy="4.8" rx="7.2" ry="3.1" stroke="#874B1E" strokeWidth="1.2" fill="none" />

      {/* Left wall and bottom contour with ribbon tail */}
      <path
        d="M2.3 4.8 V10.8 C2.3 13.2 5.2 14.8 8.8 14.8 H23.5 L21.8 12.3 L23.5 9.8 H9.5"
        stroke="#874B1E"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* Intermediate curve showing cylindrical wrap */}
      <path
        d="M2.5 10.8 C4 13.2 8.5 14 12.5 13.5"
        stroke="#874B1E"
        strokeWidth="0.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* Measurement marks & dots */}
      {/* Vertical graduation tick on left cylinder */}
      <line x1="5.2" y1="7.8" x2="5.2" y2="12.8" stroke="#874B1E" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="7.4" cy="10.8" r="0.65" fill="#874B1E" />

      {/* Tick and dot on center ribbon tail */}
      <line x1="14.5" y1="9.8" x2="14.5" y2="14.8" stroke="#874B1E" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="16.8" cy="12.3" r="0.65" fill="#874B1E" />

      {/* Inside back rim tick */}
      <line x1="9.5" y1="1.6" x2="9.5" y2="2.9" stroke="#874B1E" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

const STEP_HEADERS: Record<number, { prefix: string; accent: string }> = {
  1: { prefix: "Select Your", accent: "Chest Size" },
  2: { prefix: "Choose Your", accent: "Body Type" },
  3: { prefix: "Select Your", accent: "Height Category" },
  4: { prefix: "Select Your", accent: "Sleeves & Pockets" },
  5: { prefix: "Select Your", accent: "Collar & Cuff Style" },
  6: { prefix: "Review Your", accent: "Selection" },
};

const COLLAR_OPTIONS = [
  {
    id: "cutaway",
    title: "CUTAWAY COLLAR",
    badge: "CUTAWAY COLLAR",
    matchKey: "CUTAWAY",
    image: "/customizer/collar_style_cutaway.png",
  },
  {
    id: "mandarin",
    title: "MANDARIN COLLAR",
    badge: "MANDARIN COLLAR",
    matchKey: "MANDARIN",
    image: "/customizer/collar_style_mandarin.png",
  },
  {
    id: "buttondown",
    title: "BUTTON-DOWN COLLAR",
    badge: "BUTTON-DOWN\nCOLLAR",
    matchKey: "BUTTON",
    image: "/customizer/collar_style_buttondown.png",
  },
];

const CUFF_OPTIONS = [
  {
    id: "classic",
    title: "CLASSIC CUFF",
    badge: "CLASSIC CUFF",
    matchKeys: ["CLASSIC", "BARREL"],
    image: "/customizer/cuff_style_classic.png",
  },
  {
    id: "cufflink",
    title: "CUFFLINK CUFF (DOUBLE FOLD)",
    badge: "CUFFLINK CUFF\n(DOUBLE FOLD)",
    matchKeys: ["CUFFLINK", "FRENCH", "DOUBLE"],
    image: "/customizer/cuff_style_cufflink.png",
  },
];

function HeightSilhouetteIcon({ active = false, className = "w-6 h-10" }: { active?: boolean; className?: string }) {
  const strokeColor = active ? "#8A4418" : "#A89585";
  return (
    <svg
      className={`${className} shrink-0 inline-block`}
      viewBox="0 0 28 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="10" cy="6" r="3.2" stroke={strokeColor} strokeWidth="1.4" fill="none" />
      {/* Torso & Legs */}
      <path
        d="M6.5 12.5C6.5 11.4 7.4 10.5 8.5 10.5H11.5C12.6 10.5 13.5 11.4 13.5 12.5V23H12V38.5H10.5V25H9.5V38.5H8V23H6.5V12.5Z"
        stroke={strokeColor}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arms */}
      <path
        d="M5 13.5V23.5M15 13.5V23.5"
        stroke={strokeColor}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Height Dimension Vertical Arrow Line */}
      <line x1="22.5" y1="3" x2="22.5" y2="41" stroke={strokeColor} strokeWidth="1.3" />
      {/* Top arrow */}
      <path d="M19.5 6L22.5 3L25.5 6" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom arrow */}
      <path d="M19.5 38L22.5 41L25.5 38" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getHeightMeta(id: string) {
  const lower = (id || "").toLowerCase();
  if (lower.includes("extra")) {
    return {
      title: "EXTRA TALL HEIGHT",
      heightRangeFormatted: "5.11' to 6.2\"",
      frontLength: "30.5\"",
      sleeveLength: "26\"",
    };
  }
  if (lower.includes("tall") && !lower.includes("extra")) {
    return {
      title: "TALL HEIGHT",
      heightRangeFormatted: "5.8' to 5.10\"",
      frontLength: "29\"",
      sleeveLength: "24.5\"",
    };
  }
  return {
    title: "REGULAR HEIGHT",
    heightRangeFormatted: "5.5' to 5.7\"",
    frontLength: "27.5\"",
    sleeveLength: "23.75\"",
  };
}

const FIT_METADATA: Record<string, { desc: string; stomachLabel: string; getStomach: (chest: number) => string }> = {
  lean: {
    desc: "For a slimmer, more tailored look that follows your natural shape.",
    stomachLabel: "Stomach is",
    getStomach: (chest) => `${chest - 4}"`,
  },
  regular: {
    desc: "A balanced fit with extra comfort for everyday wear.",
    stomachLabel: "Stomach is",
    getStomach: (chest) => `${chest - 2}"`,
  },
  tummy: {
    desc: "Extra room around the stomach for maximum comfort.",
    stomachLabel: "Stomach size is",
    getStomach: (chest) => `${chest + 1}" – ${chest + 2}".`,
  },
};

export default function CustomizationModal({
  isOpen,
  onClose,
  productName ="Azure Sky Blue Bengal Stripe",
  product = null,
  initialChestSize,
  submitting = false,
  onConfirmCustomization,
}: CustomizationModalProps) {
  const c = useContent("customizer");
  const { customizationFee, currencySymbol } = useSettings();
  const { products } = useCatalog();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const startChest = initialChestSize ?? c.defaults.chestSize;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeItem, setActiveItem] = useState<CustomizationModalProduct | ProductItem | null>(() => product);
  const [activeItemName, setActiveItemName] = useState<string>(() => productName);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevProduct, setPrevProduct] = useState(product);
  if (isOpen !== prevIsOpen || product !== prevProduct) {
    setPrevIsOpen(isOpen);
    setPrevProduct(product);
    if (isOpen) {
      if (isOpen !== prevIsOpen) setCurrentStep(1);
      setActiveItem(product);
      setActiveItemName(productName);
    }
  }

  const [addedBagIds, setAddedBagIds] = useState<Record<number, number>>({});
  const [addingId, setAddingId] = useState<number | null>(null);
  const [quickAddToast, setQuickAddToast] = useState<{ message: string; visible: boolean } | null>(null);

  const [customFit, setCustomFit] = useState<CustomFitState>(() => {
    const m = c.chestSizes.find((x) => x.size === startChest);
    return {
      chestSize: startChest,
      collarSize: m?.collar ?? 15,
      shoulderSize: m?.shoulder ?? 17.5,
      bodyFit: c.defaults.bodyFit,
      height: c.defaults.height,
      sleeveType: c.defaults.sleeveType,
      collarStyle: c.defaults.collarStyle,
      cuffStyle: c.defaults.cuffStyle,
      pocket:"pocket",
      initials: c.defaults.initials,
      threadColor: c.defaults.threadColor,
      shirtColor:"white",
    };
  });

  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  const handleChestSelect = (size: number) => {
    const match = c.chestSizes.find((x) => x.size === size);
    const calculated = match ? { collar: match.collar, shoulder: match.shoulder } : { collar: 15, shoulder: 17.5 };
    setCustomFit((prev) => ({
      ...prev,
      chestSize: size,
      collarSize: calculated.collar,
      shoulderSize: calculated.shoulder,
    }));
  };

  const sisterProducts = React.useMemo(() => {
    const seenIds = new Set<string | number>();
    const list: ProductItem[] = [];

    // Always provide all 8 curated canonical sister shirts with authentic photography
    for (const canon of EIGHT_CANONICAL_SISTER_SHIRTS) {
      if (!seenIds.has(canon.id) && !seenIds.has(canon.slug)) {
        seenIds.add(canon.id);
        seenIds.add(canon.slug);
        list.push(canon);
      }
      if (list.length === 8) break;
    }

    // Fill from catalog products if ever needed
    if (list.length < 8 && products) {
      for (const p of products) {
        const cat = (p.category || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        if (
          (cat === "formal_shirts" || cat === "formal_stripes" || cat === "formal_bespoke" || slug.includes("shirt")) &&
          !seenIds.has(p.id) &&
          !seenIds.has(p.slug)
        ) {
          seenIds.add(p.id);
          seenIds.add(p.slug);
          list.push(p);
        }
        if (list.length === 8) break;
      }
    }

    return list.slice(0, 8);
  }, [products]);

  const handleSelectSisterProduct = (sister: ProductItem) => {
    setActiveItem(sister);
    setActiveItemName(sister.name);
  };

  const handleQuickAddWithSameFit = async (e: React.MouseEvent, sister: ProductItem) => {
    e.stopPropagation();
    setAddingId(sister.id);
    try {
      await addItem({
        productId: sister.id,
        quantity: 1,
        size: String(customFit.chestSize),
        customization: {
          ...customFit,
          shirtColor: sister.name,
        },
      });

      setAddedBagIds((prev) => ({
        ...prev,
        [sister.id]: (prev[sister.id] || 0) + 1,
      }));

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      setQuickAddToast({
        message: `Added ${sister.name} with your exact bespoke measurements to bag!`,
        visible: true,
      });
      setTimeout(() => {
        setQuickAddToast(null);
      }, 4000);
    } catch (err) {
      setQuickAddToast({
        message: (err as Error).message ||"Could not add item to bag",
        visible: true,
      });
      setTimeout(() => {
        setQuickAddToast(null);
      }, 4000);
    } finally {
      setAddingId(null);
    }
  };

  // Lock body scroll and pause Lenis while modal is open so wheel events inside modal work smoothly
  useEffect(() => {
    if (!isOpen) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (lenis) lenis.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      if (lenis) lenis.start();
    };
  }, [isOpen]);

  // The initial state is seeded from initialChestSize; selections are kept if the modal is closed and reopened.
  if (!isOpen) return null;

  const isFullSleeve = customFit.sleeveType ==="full";
  const totalSteps = 6;
  const stepCopy = (n: number) => c.steps[n - 1] ?? { breadcrumb:"", title:"", subtitle:"" };

  // Selections in"YOUR SELECTION" are shown strictly up to the active step;
  // going back (e.g. from Step 6 to Step 2) dynamically hides future step choices.
  const showBodyType = currentStep >= 2;
  const showHeight = currentStep >= 3;
  const showSleeve = currentStep >= 4;
  const showCollar = currentStep >= 5 && !!customFit.collarStyle;
  const showCuff = currentStep >= 5 && isFullSleeve && !!customFit.cuffStyle;
  const showMonogram = currentStep >= 5 && !!customFit.initials?.trim();

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (!submitting) {
      // Step 6: Complete — the parent adds the configured shirt to the bag
      triggerCelebration();
      void onConfirmCustomization({ ...customFit, specialInstructions: specialInstructions || undefined }, activeItem);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const getHeightCleanTitle = (h: string) => {
    const match = c.heights.find((opt) => opt.id === h);
    if (match?.shortTitle) return match.shortTitle;
    if (h.toLowerCase().includes("extra")) return"Extra Tall";
    if (h.toLowerCase().includes("regular") || h.toLowerCase().includes("5.5") || h.toLowerCase().includes("standard")) return"Regular Height";
    return"Tall Height";
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-1.5 sm:p-2 lg:p-3 animate-in fade-in duration-200"
      data-lenis-prevent
    >
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-[1560px] bg-[#F4E2DE] border border-[#E5D2C7] rounded-[24px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col min-h-[92vh] max-h-[97vh]"
        data-lenis-prevent
      >
        
        {/* Modal Top Header Bar */}
        <div className="bg-white text-black px-5 sm:px-8 lg:px-10 py-2 sm:py-2.5 flex items-center justify-between border-b border-[#E5E3DD] shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-black text-white flex items-center justify-center shadow-xs shrink-0">
              <Scissors size={13} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[9.5px] font-extrabold tracking-[0.22em] text-black uppercase block leading-tight">
                {c.eyebrow}
              </span>
              <h2 className="font-serif-luxury text-xs sm:text-[13.5px] font-bold text-black tracking-wider uppercase leading-tight truncate">
                {c.titlePrefix} {productName}
              </h2>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-[#F5F4F0] hover:bg-black text-black hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Close customization modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 sm:px-3 lg:px-4 pt-1 sm:pt-1.5 pb-3 sm:pb-4 space-y-1.5 sm:space-y-2"
          data-lenis-prevent
        >
          <div className="w-full max-w-[1420px] mx-auto px-1 sm:px-2 space-y-1.5 sm:space-y-2 transition-all duration-300">
            
            {/* Breadcrumb Steps Header */}
            <div className="flex items-center justify-between border-b border-[#E5E3DD] pb-1">
              <div className="flex items-center text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.2em] uppercase space-x-2 text-black">
                <span>{c.breadcrumbRoot}</span>
                <span className="text-[#888888] text-xs font-normal">&gt;</span>
                <span className="text-black font-bold">{stepCopy(currentStep).breadcrumb}</span>
              </div>
            </div>

            {/* Main 2-Column Grid with Equal Height Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start w-full">
            
            {/* LEFT COLUMN: 3D Interactive Mannequin Shirt Viewer & Selection Panel */}
            <div className="lg:col-span-6 flex flex-col justify-start relative transition-all duration-300">
              
              {/* Top Row: Inscription & Selection Summary (Shown from Step 1 onwards) */}
              <div className="flex items-start justify-between relative z-10 pl-1 pr-2 mb-2 animate-in fade-in duration-300">
                <div className="">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-black tracking-[0.06em] uppercase leading-tight">
                    {c.studioTitleLines.map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </h3>

                </div>

                {/* Floating "Your Selection" Box - Dynamically reveals selections per step (Hidden on Step 6 to spotlight shirt preview and avoid duplicate specs) */}
                {currentStep < 6 && (
                  <div className={`text-left ${currentStep === 5 ? "min-w-[240px] sm:min-w-[270px] p-2.5" : "min-w-[130px] sm:min-w-[155px] p-3"} bg-white rounded-2xl border border-[#E5E3DD] shadow-sm transition-all duration-300`}>
                    <h5 className="text-[11px] font-bold tracking-[0.14em] text-black uppercase mb-1 pb-1 border-b border-[#E5E3DD]">
                      {c.selectionTitle}
                    </h5>
                    <div className={`${currentStep === 5 ? "grid grid-cols-2 gap-x-3 gap-y-1" : "space-y-1.5"} text-[10.5px]`}>
                      {/* Step 1: Chest Size (always shown) */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[#666666] font-medium">Chest Size</span>
                        <strong className="text-black font-bold">{customFit.chestSize}&quot;</strong>
                      </div>

                      {/* Step 2: Body Type */}
                      {showBodyType && (
                        <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                          <span className="text-[#666666] font-medium">Body Type</span>
                          <strong className="text-black font-bold capitalize">{customFit.bodyFit} Fit</strong>
                        </div>
                      )}

                      {/* Step 3: Height */}
                      {showHeight && (
                        <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                          <span className="text-[#666666] font-medium">Height</span>
                          <strong className="text-black font-bold">{getHeightCleanTitle(customFit.height)}</strong>
                        </div>
                      )}

                      {/* Step 4: Sleeve */}
                      {showSleeve && (
                        <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                          <span className="text-[#666666] font-medium">Sleeve</span>
                          <strong className="text-black font-bold capitalize">
                            {customFit.sleeveType === "half" ? "Half Sleeve" : "Full Sleeve"}
                          </strong>
                        </div>
                      )}

                      {/* Step 5: Collar */}
                      {showCollar && (
                        <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                          <span className="text-[#666666] font-medium">Collar</span>
                          <strong className="text-black font-bold truncate max-w-[85px]" title={customFit.collarStyle}>
                            {customFit.collarStyle.replace(/COLLAR|\/ BAND/gi, "").trim() || customFit.collarStyle.split(" ")[0]}
                          </strong>
                        </div>
                      )}

                      {/* Step 5: Cuff */}
                      {showCuff && (
                        <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                          <span className="text-[#666666] font-medium">Cuff</span>
                          <strong className="text-black font-bold truncate max-w-[85px]" title={customFit.cuffStyle}>
                            {customFit.cuffStyle.replace(/CUFF|DOUBLE/gi, "").trim() || customFit.cuffStyle.split(" ")[0]}
                          </strong>
                        </div>
                      )}

                      {/* Step 5: Monogram */}
                      {showMonogram && (
                        <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                          <span className="text-[#666666] font-medium">Monogram</span>
                          <strong className="text-black font-bold uppercase">{customFit.initials}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Center: 3D Interactive Mannequin Shirt */}
              <div className="relative w-full flex flex-col items-center justify-start flex-1 pt-1">
                <MannequinShirtViewer
                  chestSize={customFit.chestSize}
                  bodyFit={asMannequinFit(customFit.bodyFit)}
                  height={customFit.height}
                  sleeveType={customFit.sleeveType === "half" ? "half" : "full"}
                  collarStyle={customFit.collarStyle}
                  cuffStyle={customFit.cuffStyle}
                  pocket={customFit.pocket === "no-pocket" ? "no-pocket" : "pocket"}
                  initials={customFit.initials}
                  threadColor={customFit.threadColor}
                  currentStep={currentStep}
                  product={activeItem}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: 6-Step Interactive Configurator Box */}
            <div className="lg:col-span-6 relative flex flex-col items-end w-full transition-all duration-300 -mt-1 sm:-mt-1.5 lg:-mt-2">
              
              <div className="bg-gradient-to-b from-[#FAF3EA] via-[#F8EFE4] to-[#FAF3EA] border border-[#E7D6C6] rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(120,70,30,0.1)] relative z-10 flex flex-col justify-between w-full max-w-[550px] lg:ml-auto h-[585px] sm:h-[605px] lg:h-[625px] shrink-0">
                
                {/* Stepper Header with Brand Accent */}
                <div className="shrink-0 mb-0.5 sm:mb-1">
                  {/* SUITOHOLIC Brand Strip matching Reference Design */}
                  <div className="flex items-center justify-center gap-3 w-full mb-1">
                    <div className="h-[1.5px] w-14 sm:w-20 bg-[#8E6F57]" />
                    <span className="font-['Playfair_Display',Georgia,serif] text-[10.5px] sm:text-[11.5px] tracking-[0.28em] uppercase text-[#32241C] font-semibold">
                      SUITOHOLIC™
                    </span>
                    <div className="h-[1.5px] w-14 sm:w-20 bg-[#8E6F57]" />
                  </div>

                  <div className="text-center">
                    <h3 className="font-['Playfair_Display',Georgia,serif] text-xl sm:text-2xl lg:text-[28px] font-bold text-[#18110D] tracking-tight leading-tight flex items-baseline justify-center flex-wrap">
                      <span>{STEP_HEADERS[currentStep]?.prefix || "Select Your"}</span>{" "}
                      <span
                        className="relative inline-block text-[#A66538] font-script text-[32px] sm:text-[40px] lg:text-[44px] font-normal leading-[0.85] ml-2 align-baseline"
                        style={{ fontFamily: "'Alex Brush', 'Alex_Brush', cursive" }}
                      >
                        {STEP_HEADERS[currentStep]?.accent || "Style"}
                        {currentStep === 1 && (
                          <svg
                            className="absolute -bottom-1.5 left-0 w-full h-3 overflow-visible pointer-events-none"
                            viewBox="0 0 140 12"
                            fill="none"
                            preserveAspectRatio="none"
                          >
                            <path d="M4 8.5C45 2 95 2 136 7.5" stroke="#A66538" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        )}
                      </span>
                    </h3>

                    <p className="font-['Playfair_Display',Georgia,serif] italic font-bold text-[12.5px] sm:text-[13.5px] lg:text-[14px] text-[#140D09] text-center mt-1 sm:mt-1.5 mb-1 sm:mb-1.5 leading-snug tracking-tight sm:tracking-normal sm:whitespace-nowrap">
                      {stepCopy(currentStep).subtitle}
                    </p>
                  </div>
                </div>

                {/* Steps Content Body - Fixed Height Container with Vertical Centering */}
                <div className={`flex-1 min-h-0 flex flex-col w-full ${currentStep === 6 ? "justify-start" : "justify-center my-auto"}`}>

                {/* STEP 1: CHEST SIZE */}
                {currentStep === 1 && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div>
                      {/* Divider Badge with Center Pill */}
                      <div className="flex items-center gap-3 w-full my-2">
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        <span className="px-5 py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[9.5px] sm:text-[10px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                          {c.chestLabel || "CHEST SIZE (IN INCHES)"}
                        </span>
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      </div>

                      {/* 8 Buttons in 2 Rows of 4 */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-2.5">
                        {c.chestSizes.map(({ size }) => {
                          const isSelected = customFit.chestSize === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleChestSelect(size)}
                              className={`h-[48px] sm:h-[52px] px-1 rounded-[14px] font-sans font-bold text-[16px] sm:text-[17px] tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#6D0E1C] via-[#5A0713] to-[#3F030A] text-white border border-[#7D1524] shadow-[0_6px_16px_rgba(85,8,18,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] scale-[1.02]"
                                  : "bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EA] to-[#F3E7D7] hover:from-[#FFFFFF] hover:to-[#EEDECB] text-[#1A110B] border border-[#E4D3C2] shadow-[0_2px_5px_rgba(140,90,50,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-xs active:scale-[0.98]"
                              }`}
                            >
                              {size}&quot;
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3-Column Measurement Summary Box */}
                    <div className="bg-gradient-to-b from-[#F7ECE0] to-[#EFE1D1] border border-[#DEC9B7] rounded-[16px] p-2.5 sm:p-3 grid grid-cols-3 divide-x divide-[#8E6F57] text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_6px_rgba(90,50,20,0.05)] mt-2">
                      <div className="px-1">
                        <span className="font-['Playfair_Display',Georgia,serif] italic font-medium text-[11.5px] sm:text-[12px] text-[#4E3B30] block">
                          Chest Size
                        </span>
                        <strong className="font-sans font-bold text-[15px] sm:text-[16px] text-[#1A110B] block mt-0.5">
                          {customFit.chestSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="font-['Playfair_Display',Georgia,serif] italic font-medium text-[11.5px] sm:text-[12px] text-[#4E3B30] block">
                          Collar Size
                        </span>
                        <strong className="font-sans font-bold text-[15px] sm:text-[16px] text-[#1A110B] block mt-0.5">
                          {customFit.collarSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="font-['Playfair_Display',Georgia,serif] italic font-medium text-[11.5px] sm:text-[12px] text-[#4E3B30] block">
                          Shoulder
                        </span>
                        <strong className="font-sans font-bold text-[15px] sm:text-[16px] text-[#1A110B] block mt-0.5">
                          {customFit.shoulderSize}&quot;
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: BODY TYPE */}
                {currentStep === 2 && (
                  <div className="space-y-2 sm:space-y-2.5 pt-0.5 animate-in fade-in duration-200">
                    {c.bodyFits.map((fit) => {
                      const isSelected = customFit.bodyFit === fit.id;
                      const meta = FIT_METADATA[fit.id] || {
                        desc: fit.description,
                        stomachLabel: "Stomach is",
                        getStomach: (chest: number) => `${chest - 4}"`,
                      };

                      return (
                        <div
                          key={fit.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: fit.id }))}
                          className={`w-full rounded-[16px] sm:rounded-[18px] p-2.5 sm:p-3 text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-b from-[#FDF8F2] via-[#FAF1E4] to-[#F5EAD9] border-[1.5px] border-[#9E5D2A] shadow-[0_3px_12px_rgba(158,93,42,0.12)] scale-[1.005]"
                              : "bg-gradient-to-b from-[#FFFDF9]/90 to-[#FAF4EA]/80 hover:bg-[#FFFDF9] border border-[#DECBB8] shadow-[0_1px_4px_rgba(140,90,50,0.04)]"
                          }`}
                        >
                          <div className="flex items-start gap-3 sm:gap-3.5">
                            {/* Radio Circle */}
                            <div className="pt-0.5 shrink-0">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "border-2 border-[#8E5224] bg-[#FDF9F3]"
                                    : "border-[1.5px] border-[#915B30] bg-transparent"
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-[#8E5224]" />}
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="flex-1 min-w-0">
                              {/* Title Badge */}
                              <span
                                className={`px-3 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-bold tracking-[0.16em] uppercase inline-block transition-colors ${
                                  isSelected
                                    ? "bg-gradient-to-r from-[#8E5224] via-[#814519] to-[#8E5224] text-white shadow-[0_1px_4px_rgba(130,70,25,0.25)]"
                                    : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                              >
                                {fit.title}
                              </span>

                              {/* Description in Serif */}
                              <p className="font-['Playfair_Display',Georgia,serif] text-[12px] sm:text-[12.5px] text-[#1B120C] leading-snug mt-1 mb-1.5 font-medium">
                                {meta.desc}
                              </p>

                              {/* Thin Horizontal Divider */}
                              <div className="h-[1px] w-full bg-[#DECBB8] my-1.5" />

                              {/* Measurements Strip with Tape Measure Icons */}
                              <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-[11.5px] text-[#1B120C]">
                                <div className="flex items-center gap-1.5">
                                  <MeasuringTapeIcon className="w-[22px] h-[16px] sm:w-[24px] sm:h-[17px] shrink-0" />
                                  <span>
                                    <span className="font-['Playfair_Display',Georgia,serif] font-medium">Chest is </span>
                                    <strong className="font-sans font-bold text-[#140E0A] text-[12px] sm:text-[12.5px]">
                                      {customFit.chestSize}&quot;
                                    </strong>
                                  </span>
                                </div>
                                <span className="h-3.5 w-[1px] bg-[#C8B39F] mx-0.5" />
                                <div className="flex items-center gap-1.5">
                                  <MeasuringTapeIcon className="w-[22px] h-[16px] sm:w-[24px] sm:h-[17px] shrink-0" />
                                  <span>
                                    <span className="font-['Playfair_Display',Georgia,serif] font-medium">{meta.stomachLabel} </span>
                                    <strong className="font-sans font-bold text-[#140E0A] text-[12px] sm:text-[12.5px]">
                                      {meta.getStomach(customFit.chestSize)}
                                    </strong>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 3: HEIGHT */}
                {currentStep === 3 && (
                  <div className="space-y-2 sm:space-y-2.5 pt-0.5 animate-in fade-in duration-200">
                    {c.heights.map((opt) => {
                      const isSelected = customFit.height === opt.id;
                      const meta = getHeightMeta(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, height: opt.id }))}
                          className={`w-full rounded-[16px] sm:rounded-[18px] p-2.5 sm:p-3 text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_3px_12px_rgba(157,74,25,0.14)] scale-[1.005]"
                              : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-3.5">
                            {/* Radio Circle */}
                            <div className="shrink-0">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "border-2 border-[#8A4418] bg-[#FDFBF7]"
                                    : "border-2 border-[#B8A392] bg-transparent"
                                }`}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                              </div>
                            </div>

                            {/* Person Silhouette Height Measurement Icon */}
                            <div className="shrink-0 flex items-center justify-center">
                              <HeightSilhouetteIcon active={isSelected} className="w-5.5 sm:w-6 h-9 sm:h-10" />
                            </div>

                            {/* Card Content */}
                            <div className="flex-1 min-w-0">
                              {/* Pill Badge */}
                              <span
                                className={`px-3.5 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase inline-block transition-colors ${
                                  isSelected
                                    ? "bg-[#8A4418] text-white shadow-2xs"
                                    : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                              >
                                {meta.title}
                              </span>

                              {/* Height Range */}
                              <div className="text-[12px] sm:text-[12.5px] text-[#2C1F17] mt-1 font-medium">
                                <span>Height: </span>
                                <strong className="font-bold text-[#140E0A]">
                                  {meta.heightRangeFormatted}
                                </strong>
                              </div>

                              {/* Shirt Front Length & Sleeves Length */}
                              <div className="flex items-center gap-2 text-[10.5px] sm:text-[11px] text-[#4E3A2F] mt-0.5 font-medium">
                                <span>
                                  Shirt Front Length:{" "}
                                  <strong className="font-bold text-[#140E0A]">{meta.frontLength}</strong>
                                </span>
                                <span className="text-[#C8B39F]">|</span>
                                <span>
                                  Sleeves Length:{" "}
                                  <strong className="font-bold text-[#140E0A]">{meta.sleeveLength}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 4: SLEEVES & POCKETS */}
                {currentStep === 4 && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                    {/* HALF SLEEVE SECTION */}
                    <div>
                      {/* Divider Badge with Center Pill */}
                      <div className="flex items-center gap-3 w-full mb-3">
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        <span className="px-5 py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[9.5px] sm:text-[10px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)]">
                          HALF SLEEVE
                        </span>
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                        {/* Half Sleeve WITH Pocket */}
                        {(() => {
                          const isSelected = customFit.sleeveType === "half" && customFit.pocket !== "no-pocket";
                          return (
                            <div
                              onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "half", pocket: "pocket" }))}
                              className={`p-3 sm:p-3.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                  : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                  }`}
                                >
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                </div>
                              </div>

                              <div className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 h-20 sm:h-24">
                                <img
                                  src="/customizer/sleeves_half_pocket.png"
                                  alt="Half Sleeve With Pocket"
                                  className="max-h-full max-w-[130px] object-contain drop-shadow-xs"
                                />
                              </div>

                              <span
                                className={`w-full py-1 px-2 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase transition-colors text-center mt-1.5 ${
                                  isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                              >
                                WITH POCKET
                              </span>
                            </div>
                          );
                        })()}

                        {/* Half Sleeve WITHOUT Pocket */}
                        {(() => {
                          const isSelected = customFit.sleeveType === "half" && customFit.pocket === "no-pocket";
                          return (
                            <div
                              onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "half", pocket: "no-pocket" }))}
                              className={`p-3 sm:p-3.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                  : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                  }`}
                                >
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                </div>
                              </div>

                              <div className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 h-20 sm:h-24">
                                <img
                                  src="/customizer/sleeves_half_nopocket.png"
                                  alt="Half Sleeve Without Pocket"
                                  className="max-h-full max-w-[130px] object-contain drop-shadow-xs"
                                />
                              </div>

                              <span
                                className={`w-full py-1 px-2 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase transition-colors text-center mt-1.5 ${
                                  isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                              >
                                WITHOUT POCKET
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* FULL SLEEVE SECTION */}
                    <div>
                      {/* Divider Badge with Center Pill */}
                      <div className="flex items-center gap-3 w-full mb-3 mt-1 sm:mt-2">
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        <span className="px-5 py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[10px] sm:text-[10.5px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)]">
                          FULL SLEEVE
                        </span>
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                        {/* Full Sleeve WITH Pocket */}
                        {(() => {
                          const isSelected = customFit.sleeveType === "full" && customFit.pocket !== "no-pocket";
                          return (
                            <div
                              onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full", pocket: "pocket" }))}
                              className={`p-3 sm:p-3.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                  : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                  }`}
                                >
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                </div>
                              </div>

                              <div className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 h-20 sm:h-24">
                                <img
                                  src="/customizer/sleeves_full_pocket.png"
                                  alt="Full Sleeve With Pocket"
                                  className="max-h-full max-w-[130px] object-contain drop-shadow-xs"
                                />
                              </div>

                              <span
                                className={`w-full py-1 px-2 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase transition-colors text-center mt-1.5 ${
                                  isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                              >
                                WITH POCKET
                              </span>
                            </div>
                          );
                        })()}

                        {/* Full Sleeve WITHOUT Pocket */}
                        {(() => {
                          const isSelected = customFit.sleeveType === "full" && customFit.pocket === "no-pocket";
                          return (
                            <div
                              onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full", pocket: "no-pocket" }))}
                              className={`p-3 sm:p-3.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                  : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                  }`}
                                >
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                </div>
                              </div>

                              <div className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 h-20 sm:h-24">
                                <img
                                  src="/customizer/sleeves_full_nopocket.png"
                                  alt="Full Sleeve Without Pocket"
                                  className="max-h-full max-w-[130px] object-contain drop-shadow-xs"
                                />
                              </div>

                              <span
                                className={`w-full py-1 px-2 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase transition-colors text-center mt-1.5 ${
                                  isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                              >
                                WITHOUT POCKET
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: COLLAR & CUFF STYLE */}
                {currentStep === 5 && (
                  <div className="space-y-2 sm:space-y-2.5 pt-0.5 animate-in fade-in duration-200">
                    {/* SECTION 1: COLLAR STYLE */}
                    <div>
                      {/* Divider Badge with Center Pill */}
                      <div className="flex items-center gap-3 w-full mb-2 sm:mb-2.5">
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        <span className="px-5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[9px] sm:text-[9.5px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                          COLLAR STYLE
                        </span>
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                        {COLLAR_OPTIONS.map((col) => {
                          const isSelected = customFit.collarStyle.toUpperCase().includes(col.matchKey);
                          return (
                            <div
                              key={col.id}
                              onClick={() => setCustomFit((prev) => ({ ...prev, collarStyle: col.title }))}
                              className={`p-2 sm:p-2.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                  : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              {/* Radio Circle Top-Left */}
                              <div className="absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center transition-all">
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#8A4418]" />}
                                </div>
                              </div>

                              {/* Collar Photo */}
                              <div className="w-full flex items-center justify-center pt-1 pb-0.5 h-12 sm:h-14">
                                <img
                                  src={col.image}
                                  alt={col.title}
                                  className="max-h-full max-w-full object-contain drop-shadow-xs"
                                />
                              </div>

                              {/* Pill Badge */}
                              <span
                                className={`w-full py-0.5 px-1 rounded-full text-[8px] sm:text-[8.5px] font-bold tracking-[0.12em] uppercase transition-colors text-center mt-1 min-h-[22px] sm:min-h-[24px] flex items-center justify-center leading-tight whitespace-pre-line ${
                                  isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                                title={col.title}
                              >
                                {col.badge || col.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION 2: CUFF STYLE */}
                    <div>
                      {/* Divider Badge with Center Pill */}
                      <div className="flex items-center gap-3 w-full mb-2 sm:mb-2.5 mt-0.5 sm:mt-1">
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        <span className="px-5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[9px] sm:text-[9.5px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                          CUFF STYLE
                        </span>
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        {CUFF_OPTIONS.map((cuff) => {
                          const isSelected = cuff.matchKeys.some((k) => customFit.cuffStyle.toUpperCase().includes(k));
                          return (
                            <div
                              key={cuff.id}
                              onClick={() => setCustomFit((prev) => ({ ...prev, cuffStyle: cuff.title }))}
                              className={`p-2 sm:p-2.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                  : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              {/* Radio Circle Top-Left */}
                              <div className="absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center transition-all">
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#8A4418]" />}
                                </div>
                              </div>

                              {/* Cuff Photo */}
                              <div className="w-full flex items-center justify-center pt-1 pb-0.5 h-12 sm:h-14">
                                <img
                                  src={cuff.image}
                                  alt={cuff.title}
                                  className="max-h-full max-w-full object-contain drop-shadow-xs"
                                />
                              </div>

                              {/* Pill Badge */}
                              <span
                                className={`w-full py-0.5 px-1.5 rounded-full text-[8.5px] sm:text-[9px] font-bold tracking-[0.14em] uppercase transition-colors text-center mt-1 min-h-[22px] sm:min-h-[24px] flex items-center justify-center leading-tight whitespace-pre-line ${
                                  isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
                                }`}
                              >
                                {cuff.badge}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION 3: INITIALS */}
                    <div>
                      {/* Divider Badge with Center Pill */}
                      <div className="flex items-center gap-3 w-full mb-2 sm:mb-2.5 mt-0.5 sm:mt-1">
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        <span className="px-5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[9px] sm:text-[9.5px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                          INITIALS
                        </span>
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      </div>

                      {/* 2-Part Grid: Monogram Input on Left, Thread Color Dropdown on Right */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {/* Left Side: Do You Need Monogram? */}
                        <div className="bg-[#FFF8F1]/90 border border-[#DFC8B4] rounded-[14px] p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between">
                          <label className="text-[8.5px] sm:text-[9px] font-bold tracking-wider text-[#1F1A17] uppercase block mb-1">
                            DO YOU NEED MONOGRAM?
                          </label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              maxLength={3}
                              value={customFit.initials || ""}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
                                setCustomFit((prev) => ({ ...prev, initials: val }));
                              }}
                              placeholder="e.g. YS (Optional)"
                              className="w-full bg-white/90 border border-[#D5C2AF] rounded-[10px] px-3 py-1.5 text-[11px] font-bold tracking-widest text-[#1F1A17] placeholder:text-[#9B897D] placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-[#9A5426] focus:ring-1 focus:ring-[#9A5426]/30 shadow-2xs transition-all uppercase"
                            />
                            {customFit.initials && (
                              <button
                                type="button"
                                onClick={() => setCustomFit((prev) => ({ ...prev, initials: "" }))}
                                className="absolute right-2 text-[#8A796E] hover:text-[#1F1A17] text-xs font-bold p-1 cursor-pointer"
                                title="Clear monogram"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Select Thread Color Dropdown */}
                        <div className="bg-[#FFF8F1]/90 border border-[#DFC8B4] rounded-[14px] p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between">
                          <label className="text-[8.5px] sm:text-[9px] font-bold tracking-wider text-[#1F1A17] uppercase block mb-1">
                            SELECT THREAD COLOR
                          </label>
                          <div className="relative flex items-center">
                            {/* Color Dot indicator */}
                            <div
                              className="w-3.5 h-3.5 rounded-full shrink-0 ml-2.5 mr-[-24px] z-10 border border-black/20 shadow-2xs pointer-events-none"
                              style={{
                                backgroundColor:
                                  customFit.threadColor === "black"
                                    ? "#14110E"
                                    : customFit.threadColor === "white"
                                    ? "#FFFFFF"
                                    : customFit.threadColor === "gold"
                                    ? "#B8860B"
                                    : customFit.threadColor === "burgundy"
                                    ? "#6B1F2A"
                                    : customFit.threadColor === "silver"
                                    ? "#71717A"
                                    : "#1E40AF",
                              }}
                            />
                            <select
                              value={customFit.threadColor || "dark_blue"}
                              onChange={(e) => setCustomFit((prev) => ({ ...prev, threadColor: e.target.value }))}
                              className="w-full bg-white/90 border border-[#D5C2AF] rounded-[10px] pl-7 pr-7 py-1.5 text-[10.5px] font-semibold text-[#1F1A17] focus:outline-none focus:border-[#9A5426] focus:ring-1 focus:ring-[#9A5426]/30 shadow-2xs transition-all cursor-pointer appearance-none"
                            >
                              <option value="dark_blue">Dark Blue (Navy)</option>
                              <option value="black">Classic Black</option>
                              <option value="white">Crisp White</option>
                              <option value="gold">Royal Gold</option>
                              <option value="burgundy">Bordeaux Burgundy</option>
                              <option value="silver">Silver Grey</option>
                            </select>
                            <div className="pointer-events-none absolute right-2.5 flex items-center text-[#8A796E]">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: REVIEW */}
                {currentStep === 6 && (
                  <div className="space-y-1.5 sm:space-y-2 pt-0.5 animate-in fade-in duration-200">
                    {/* 6-Step Stepper Pills Bar matching Reference Image 2 */}
                    <div className="flex items-center justify-between gap-1 w-full pb-1.5 border-b border-[#EADBCE]">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex flex-col items-center gap-0.5 cursor-pointer group"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#8A4418] text-white text-[9.5px] font-bold flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all">
                          1
                        </div>
                        <span className="text-[8.5px] sm:text-[9px] font-semibold text-[#5C4A3E] group-hover:text-[#8A4418] flex items-center gap-0.5 whitespace-nowrap">
                          Chest <span className="text-[#8A4418] font-bold">✓</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex flex-col items-center gap-0.5 cursor-pointer group"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#8A4418] text-white text-[9.5px] font-bold flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all">
                          2
                        </div>
                        <span className="text-[8.5px] sm:text-[9px] font-semibold text-[#5C4A3E] group-hover:text-[#8A4418] flex items-center gap-0.5 whitespace-nowrap">
                          Body <span className="text-[#8A4418] font-bold">✓</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="flex flex-col items-center gap-0.5 cursor-pointer group"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#8A4418] text-white text-[9.5px] font-bold flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all">
                          3
                        </div>
                        <span className="text-[8.5px] sm:text-[9px] font-semibold text-[#5C4A3E] group-hover:text-[#8A4418] flex items-center gap-0.5 whitespace-nowrap">
                          Height <span className="text-[#8A4418] font-bold">✓</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="flex flex-col items-center gap-0.5 cursor-pointer group"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#8A4418] text-white text-[9.5px] font-bold flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all">
                          4
                        </div>
                        <span className="text-[8.5px] sm:text-[9px] font-semibold text-[#5C4A3E] group-hover:text-[#8A4418] flex items-center gap-0.5 whitespace-nowrap">
                          Measure <span className="text-[#8A4418] font-bold">✓</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="flex flex-col items-center gap-0.5 cursor-pointer group"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#8A4418] text-white text-[9.5px] font-bold flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all">
                          5
                        </div>
                        <span className="text-[8.5px] sm:text-[9px] font-semibold text-[#5C4A3E] group-hover:text-[#8A4418] flex items-center gap-0.5 whitespace-nowrap">
                          Cuff <span className="text-[#8A4418] font-bold">✓</span>
                        </span>
                      </button>

                      {/* Step 6 Active Pill matching Reference Image 2 */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#9D4A19] to-[#7E370F] text-white shadow-[0_2px_6px_rgba(157,74,25,0.25)] shrink-0">
                        <div className="w-4 h-4 rounded-full bg-[#522105] text-white text-[9px] font-bold flex items-center justify-center">
                          6
                        </div>
                        <span className="text-[9.5px] font-bold tracking-wider uppercase text-white">
                          Review
                        </span>
                      </div>
                    </div>

                    {/* SECTION: YOUR SELECTION SUMMARY */}
                    <div>
                      {/* Divider Badge with Center Pill */}
                      <div className="flex items-center gap-3 w-full my-1 sm:my-1.5">
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        <span className="px-5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[9px] sm:text-[9.5px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                          YOUR SELECTION SUMMARY
                        </span>
                        <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      </div>

                      {/* 6-Row Specification Strip matching Reference Image 2 */}
                      <div className="rounded-[14px] bg-[#FFF8F1]/90 border border-[#DEC7B2] overflow-hidden divide-y divide-[#EADBCE] shadow-2xs">
                        {/* 1. FABRIC */}
                        <div className="py-1 px-2.5 sm:py-1.5 sm:px-3 flex items-center gap-2.5 sm:gap-3">
                          <div className="w-11 h-7.5 sm:w-12 sm:h-8 rounded-[6px] overflow-hidden border border-[#DFCDBA] shrink-0 bg-[#F4EDE4]">
                            <img
                              src="/customizer/review_fabric_thumb.jpg"
                              alt={activeItemName || productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] sm:text-[8.5px] font-bold tracking-wider text-[#8A4418] uppercase block leading-tight">
                              1. FABRIC
                            </span>
                            <span className="text-[10.5px] sm:text-[11px] font-bold text-[#1F1A17] block truncate leading-snug">
                              {getShortShirtTitle(activeItemName || activeItem?.name || productName)}
                            </span>
                          </div>
                        </div>

                        {/* 2. SIZE & FIT */}
                        <div className="py-1 px-2.5 sm:py-1.5 sm:px-3 flex items-center gap-2.5 sm:gap-3">
                          <div className="w-11 h-7.5 sm:w-12 sm:h-8 rounded-[6px] overflow-hidden border border-[#DFCDBA] shrink-0 bg-[#F4EDE4]">
                            <img
                              src="/customizer/review_shirt_thumb.png"
                              alt="Size & Fit"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] sm:text-[8.5px] font-bold tracking-wider text-[#8A4418] uppercase block leading-tight">
                              2. SIZE & FIT
                            </span>
                            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#1F1A17] block leading-snug">
                              Chest Size: {customFit.chestSize}&quot; &nbsp;&nbsp;|&nbsp;&nbsp; {customFit.bodyFit === "lean" ? "Lean Fit" : customFit.bodyFit === "regular" ? "Regular Fit" : "Tummy Comfort Fit"}
                            </span>
                          </div>
                        </div>

                        {/* 3. HEIGHT */}
                        <div className="py-1 px-2.5 sm:py-1.5 sm:px-3 flex items-center gap-2.5 sm:gap-3">
                          <div className="w-11 h-7.5 sm:w-12 sm:h-8 rounded-[6px] overflow-hidden border border-[#DFCDBA] shrink-0 bg-[#F4EDE4]">
                            <img
                              src="/customizer/review_height_thumb.png"
                              alt="Height Category"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] sm:text-[8.5px] font-bold tracking-wider text-[#8A4418] uppercase block leading-tight">
                              3. HEIGHT
                            </span>
                            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#1F1A17] block leading-snug">
                              {getHeightCleanTitle(customFit.height)} ({getHeightMeta(customFit.height).heightRangeFormatted})
                            </span>
                          </div>
                        </div>

                        {/* 4. SLEEVE */}
                        <div className="py-1 px-2.5 sm:py-1.5 sm:px-3 flex items-center gap-2.5 sm:gap-3">
                          <div className="w-11 h-7.5 sm:w-12 sm:h-8 rounded-[6px] overflow-hidden border border-[#DFCDBA] shrink-0 bg-[#F4EDE4]">
                            <img
                              src="/customizer/review_sleeve_thumb.png"
                              alt="Sleeve"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] sm:text-[8.5px] font-bold tracking-wider text-[#8A4418] uppercase block leading-tight">
                              4. SLEEVE
                            </span>
                            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#1F1A17] block capitalize leading-snug">
                              {customFit.sleeveType === "half" ? "Half Sleeves" : "Full Sleeves"}
                            </span>
                          </div>
                        </div>

                        {/* 5. COLLAR & CUFF */}
                        <div className="py-1 px-2.5 sm:py-1.5 sm:px-3 flex items-center gap-2.5 sm:gap-3">
                          <div className="w-11 h-7.5 sm:w-12 sm:h-8 rounded-[6px] overflow-hidden border border-[#DFCDBA] shrink-0 bg-[#F4EDE4]">
                            <img
                              src="/customizer/review_collar_thumb.png"
                              alt="Collar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] sm:text-[8.5px] font-bold tracking-wider text-[#8A4418] uppercase block leading-tight">
                              5. COLLAR & CUFF
                            </span>
                            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#1F1A17] block truncate leading-snug">
                              {customFit.collarStyle.replace(/COLLAR/gi, "").trim()} Collar &nbsp;&nbsp;|&nbsp;&nbsp; {customFit.cuffStyle.replace(/\(DOUBLE FOLD\)/gi, "").trim() || "Classic Cuff"}
                            </span>
                          </div>
                        </div>

                        {/* 6. INITIALS */}
                        <div className="py-1 px-2.5 sm:py-1.5 sm:px-3 flex items-center gap-2.5 sm:gap-3">
                          <div className="w-11 h-7.5 sm:w-12 sm:h-8 rounded-[6px] overflow-hidden border border-[#DFCDBA] shrink-0 bg-[#F4EDE4]">
                            <img
                              src="/customizer/review_monogram_thumb.png"
                              alt="Monogram Initials"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] sm:text-[8.5px] font-bold tracking-wider text-[#8A4418] uppercase block leading-tight">
                              6. INITIALS
                            </span>
                            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#1F1A17] block leading-snug">
                              {customFit.initials ? (
                                `${customFit.initials} (${
                                  customFit.threadColor === "black"
                                    ? "Classic Black"
                                    : customFit.threadColor === "white"
                                    ? "Crisp White"
                                    : customFit.threadColor === "gold"
                                    ? "Royal Gold"
                                    : customFit.threadColor === "burgundy"
                                    ? "Bordeaux Burgundy"
                                    : customFit.threadColor === "silver"
                                    ? "Silver Grey"
                                    : "Dark Blue"
                                } Thread)`
                              ) : (
                                "YS (Dark Blue Thread)"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION: ADDITIONAL REMARKS / SPECIAL INSTRUCTIONS */}
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[8.5px] sm:text-[9px] font-bold tracking-wider text-[#1F1A17] uppercase">
                          ADDITIONAL REMARKS / SPECIAL INSTRUCTIONS
                        </label>
                        <span className="text-[8.5px] sm:text-[9px] text-[#888888] font-medium">
                          {specialInstructions.length}/400
                        </span>
                      </div>

                      <div className="relative rounded-[12px] bg-[#FFF8F1] border border-[#DEC7B2] p-2 sm:p-2.5 flex items-start gap-2 shadow-2xs">
                        <svg className="w-3.5 h-3.5 text-[#A35D27] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>

                        <textarea
                          rows={3}
                          maxLength={400}
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 400))}
                          placeholder="If you want any changes in the above measure, just write in this box for whatever you have selected. If you want a little half inch to one inch plus or minus, just let us know in this box so we can make according to your customization."
                          className="w-full bg-transparent text-[9px] sm:text-[9.5px] text-[#3C2F27] placeholder:text-[#8C7A6E] placeholder:italic focus:outline-none resize-none min-h-[52px] sm:min-h-[56px] max-h-[60px] leading-relaxed overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        />

                        {/* Diagonal resize indicator lines matching Image 2 */}
                        <div className="absolute bottom-1.5 right-1.5 pointer-events-none text-[#C8B7A6]">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10">
                            <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                            <line x1="9" y1="5" x2="5" y2="9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>

                {/* BOTTOM NAVIGATION ACTIONS */}
                <div className="shrink-0 pt-2.5 sm:pt-3 border-t border-[#DFCDBA] flex items-center justify-between gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={currentStep > 1 ? handlePrevStep : onClose}
                    className="px-6 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-b from-[#FFFDF9] to-[#F1E5D7] hover:from-[#FFFFFF] hover:to-[#EAD8C5] text-[#1E140E] border border-[#DFCFBF] rounded-[14px] sm:rounded-full font-['Playfair_Display',Georgia,serif] font-bold text-[11px] sm:text-[11.5px] tracking-[0.16em] uppercase flex items-center justify-center gap-1.5 transition-all shadow-[0_2px_6px_rgba(160,110,70,0.12)] cursor-pointer active:scale-95"
                  >
                    <ArrowLeft size={13} strokeWidth={2.5} />
                    <span>{c.backLabel || "BACK"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={submitting}
                    className="flex-1 py-2.5 sm:py-3 px-6 sm:px-7 rounded-[14px] sm:rounded-full bg-gradient-to-r from-[#6D0E1C] via-[#5A0713] to-[#3F030A] hover:from-[#7C1222] hover:to-[#4C050D] text-white flex items-center justify-between border border-[#7D1524] shadow-[0_4px_16px_rgba(85,8,18,0.35)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait active:scale-[0.99]"
                  >
                    <span className="font-['Playfair_Display',Georgia,serif] font-bold text-[11.5px] sm:text-xs tracking-[0.18em] uppercase text-white">
                      {currentStep === totalSteps ? (submitting ? c.addingLabel : "CONFIRM & PROCEED →") : c.continueLabel}
                    </span>
                    <span className="border-l border-white/25 pl-3.5 sm:pl-4 text-[10.5px] sm:text-[11px] font-bold tracking-widest text-white/90 font-sans">
                      {currentStep} OF {totalSteps}
                    </span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* SISTER FABRICS & COLORS - SEPARATE ROW SECTION BELOW THE GRID (MATCHING HOME PAGE PATTERN) */}
          {currentStep === 6 && sisterProducts.length > 0 && (
            <div id="sister-fabrics-section" className="space-y-4 pt-8 sm:pt-10 border-t border-[#E5E3DD] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
                <h4 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                  ADD MORE SHIRTS IN DIFFERENT FABRICS
                </h4>
              </div>

              {/* Quick Add Inline Feedback Banner */}
              {quickAddToast && (
                <div className="bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <Check size={14} className="text-white shrink-0" />
                    <span>{quickAddToast.message}</span>
                  </div>
                </div>
              )}

              {/* 8 Cards in a 4-Column Responsive Grid matching Home Page Pattern */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[10px] gap-y-6 sm:gap-y-8 pt-1">
                {sisterProducts.slice(0, 8).map((sister) => {
                  const isSelected = (activeItem?.slug && activeItem.slug === sister.slug) || (activeItem?.id && String(activeItem.id) === String(sister.id));
                  const count = addedBagIds[sister.id] || 0;
                  const isSaved = isInWishlist(sister.id);
                  const hoverFullShirt = getMatchingFullShirtImage(sister);

                  const rawImages = sister.gallery && sister.gallery.length > 0 
                    ? sister.gallery 
                    : [sister.image];
                  const cleanImages = rawImages.map((img) => (img ? img.replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\/?/i, "/") : ""));
                  const activeMainImage = cleanImages[0] || sister.image || getSuggestionThumbnail(sister);
                  const activeHoverImage = hoverFullShirt || (cleanImages.length > 1 ? cleanImages[1] : null);

                  return (
                    <div
                      key={sister.id}
                      className="group flex flex-col w-full cursor-pointer relative"
                      onClick={() => handleSelectSisterProduct(sister)}
                    >
                      {/* Upper Rectangular Image Container - 254:350 Aspect Ratio matching Home Page */}
                      <div className={`relative w-full aspect-[254/350] rounded-[10px] overflow-hidden bg-[#ECEAE5] transition-all duration-300 ${
                        isSelected ? "ring-2 ring-black" : ""
                      }`}>
                        <div className="block relative w-full h-full overflow-hidden rounded-[10px]">
                          {/* Default Image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeMainImage}
                            alt={sister.name}
                            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-102 ${
                              activeHoverImage ? "group-hover:opacity-0" : ""
                            }`}
                            loading="lazy"
                          />

                          {/* Hover Image */}
                          {activeHoverImage && (
                            <div className="absolute inset-0 w-full h-full bg-[#ECEAE5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10 overflow-hidden pointer-events-none">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={activeHoverImage}
                                alt={`${sister.name} Full Look`}
                                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-102"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>

                        {/* Top Right: Floating Outline Heart Wishlist Icon */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(sister.id);
                          }}
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

                        {/* Top Left: Badges */}
                        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 items-start">
                          {isSelected && (
                            <span className="bg-black text-white text-[8.5px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                              Viewing
                            </span>
                          )}
                          {count > 0 && (
                            <span className="bg-black text-white text-[8.5px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <Check size={10} strokeWidth={2.5} /> {count} in bag
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lower Details Strip: Product Name & Price on Left, Plus Icon on Right */}
                      <div className="mt-2.5 sm:mt-3 flex items-start justify-between gap-2 px-1 pb-2">
                        <div className="min-w-0 flex-1 space-y-1">
                          <h5
                            title={sister.name}
                            className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.16em] text-black hover:opacity-75 uppercase transition-opacity truncate leading-snug"
                          >
                            {sister.name}
                          </h5>
                          <div className="font-sans text-[10px] sm:text-[11px] font-medium text-[#666666] tracking-[0.08em] uppercase">
                            RS. {sister.rawPrice ? sister.rawPrice.toLocaleString("en-IN") : sister.price.replace("₹", "").trim()}
                          </div>
                        </div>

                        {/* Right: Quick Add Button with same bespoke fit */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAddWithSameFit(e, sister)}
                          disabled={addingId === sister.id}
                          aria-label={`Add ${sister.name} with same fit`}
                          title="Add with exact same bespoke fit to bag"
                          className={`shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5 ${
                            count > 0 ? "bg-black text-white" : "bg-white hover:bg-black text-black hover:text-white"
                          }`}
                        >
                          {addingId === sister.id ? (
                            <RefreshCw size={11} className="animate-spin" />
                          ) : count > 0 ? (
                            <Check size={12} strokeWidth={2.5} />
                          ) : (
                            <ShoppingBag size={12} strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          </div>

        </div>

      </div>

    </div>
  );
}

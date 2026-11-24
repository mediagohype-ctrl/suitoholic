"use client";

import React, { useState, useEffect } from "react";
import MannequinShirtViewer, { getCoralBuyNowFitPhoto, getShirtColorFamily, getMatchingShirtModel } from "@/components/MannequinShirtViewer";
import InitialsPanel, { DEFAULT_INITIALS_THREAD, getInitialsThreadLabel, InitialsCuffPreview } from "@/components/customizer/InitialsPanel";
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

import { EIGHT_CANONICAL_SISTER_SHIRTS } from "@/data/products";

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
  buyNow?: boolean;
  onClose: () => void;
  productName?: string;
  /** The product being customised; its photo drives the fabric chip and the detail/review previews. */
  product?: CustomizationModalProduct | null;
  initialChestSize?: number;
  /** Disables the final button while the bag request is in flight. */
  submitting?: boolean;
  onConfirmCustomization: (customFit: CustomFitState, chosenProduct?: CustomizationModalProduct | ProductItem | null) => void | Promise<void>;
}

type MannequinFit = "lean" | "regular" | "tummy";
const asMannequinFit = (fit: string): MannequinFit => (fit === "regular" || fit === "tummy" ? fit : "lean");

function getSuggestionThumbnail(p: Pick<ProductItem, "image" | "gallery">): string {
  if (p?.image) return p.image;
  if (p?.gallery && p.gallery.length > 0) return p.gallery[0];
  return "/new_shirts/shirt_21.jpg";
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
    image: "/customizer/collar_style_cutaway.png?v=12",
  },
  {
    id: "mandarin",
    title: "MANDARIN COLLAR",
    badge: "MANDARIN COLLAR",
    matchKey: "MANDARIN",
    image: "/customizer/collar_style_mandarin.png?v=12",
  },
  {
    id: "buttondown",
    title: "BUTTON-DOWN COLLAR",
    badge: "BUTTON-DOWN\nCOLLAR",
    matchKey: "BUTTON",
    image: "/customizer/collar_style_buttondown.png?v=12",
  },
];

const CUFF_OPTIONS = [
  {
    id: "classic",
    title: "CLASSIC CUFF",
    badge: "CLASSIC CUFF",
    matchKeys: ["CLASSIC", "BARREL"],
    image: "/customizer/cuff_style_classic.png?v=12",
  },
  {
    id: "cufflink",
    title: "CUFFLINK CUFF (DOUBLE FOLD)",
    badge: "CUFFLINK CUFF\n(DOUBLE FOLD)",
    matchKeys: ["CUFFLINK", "FRENCH", "DOUBLE"],
    image: "/customizer/cuff_style_cufflink.png?v=12",
  },
];

const SLEEVE_PHOTOS = {
  full: { pocket: "/customizer/sleeves_full_pocket.png", "no-pocket": "/customizer/sleeves_full_nopocket.png" },
  half: { pocket: "/customizer/sleeves_half_pocket.png", "no-pocket": "/customizer/sleeves_half_nopocket.png" },
};

function HeightSilhouetteIcon({ active = false, className = "w-7 sm:w-8 h-12 sm:h-14" }: { active?: boolean; className?: string }) {
  const strokeColor = active ? "#3D2415" : "#A68B76";
  return (
    <svg
      className={`${className} shrink-0 inline-block`}
      viewBox="0 0 66 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head: circular outline with gap to shoulders */}
      <circle cx="26" cy="12.5" r="7.5" stroke={strokeColor} strokeWidth="2.3" fill="none" />

      {/* Outer Body Contour: Shoulders -> Straight Arms -> Hands curving into Hips -> Straight Legs -> Rounded Feet -> Inseam & Crotch Arch */}
      <path
        d="
          M 19 24.5
          C 14.5 25 11 27.5 11 31.5
          L 11 60
          C 11 63.5 13 66 17 66
          L 17 100
          A 3.75 3.75 0 0 0 24.5 100
          L 24.5 65
          A 1.5 1.5 0 0 1 27.5 65
          L 27.5 100
          A 3.75 3.75 0 0 0 35 100
          L 35 66
          C 39 66 41 63.5 41 60
          L 41 31.5
          C 41 27.5 37.5 25 33 24.5
          Z
        "
        stroke={strokeColor}
        strokeWidth="2.3"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner Arm / Torso Division Slits */}
      <line x1="17" y1="40" x2="17" y2="63.5" stroke={strokeColor} strokeWidth="2.3" strokeLinecap="round" />
      <line x1="35" y1="40" x2="35" y2="63.5" stroke={strokeColor} strokeWidth="2.3" strokeLinecap="round" />

      {/* Height Dimension Vertical Double-Headed Arrow Line & End Caps matching Reference Design */}
      <line x1="50" y1="5" x2="62" y2="5" stroke={strokeColor} strokeWidth="2.3" strokeLinecap="round" />
      <path d="M 52.5 9.5 L 56 5.5 L 59.5 9.5" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="56" y1="5.5" x2="56" y2="103.5" stroke={strokeColor} strokeWidth="2.3" />
      <path d="M 52.5 99.5 L 56 103.5 L 59.5 99.5" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="50" y1="104" x2="62" y2="104" stroke={strokeColor} strokeWidth="2.3" strokeLinecap="round" />
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
  buyNow = false,
  onClose,
  productName = "Azure Sky Blue Bengal Stripe",
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

  const createEmptyCustomFit = (): CustomFitState => ({
    chestSize: 0,
    collarSize: 0,
    shoulderSize: 0,
    bodyFit: "",
    height: "",
    sleeveType: "",
    collarStyle: "",
    cuffStyle: "",
    pocket: "",
    initials: "",
    threadColor: "",
    shirtColor: "white",
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeItem, setActiveItem] = useState<CustomizationModalProduct | ProductItem | null>(() => product);
  const [activeItemName, setActiveItemName] = useState<string>(() => productName);
  const [customFit, setCustomFit] = useState<CustomFitState>(createEmptyCustomFit);
  const [wantsInitials, setWantsInitials] = useState(false);
  const initialsId = React.useId();
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [addedBagIds, setAddedBagIds] = useState<Record<number, number>>({});
  const [addingId, setAddingId] = useState<number | null>(null);
  const [quickAddToast, setQuickAddToast] = useState<{ message: string; visible: boolean } | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const productKey = product?.slug ?? product?.id ?? product?.name ?? productName;
  const [prevProductKey, setPrevProductKey] = useState(productKey);
  if (isOpen !== prevIsOpen || productKey !== prevProductKey) {
    setPrevIsOpen(isOpen);
    setPrevProductKey(productKey);
    if (isOpen) {
      if (isOpen !== prevIsOpen) {
        setCurrentStep(1);
        setCustomFit(createEmptyCustomFit());
        setWantsInitials(false);
        setSpecialInstructions("");
      }
      setActiveItem(product);
      setActiveItemName(productName);
    }
  }
  const isFullSleeve = customFit.sleeveType === "full";
  const includesInitials = isFullSleeve && wantsInitials;
  const showInitialsPanel = currentStep === 5 && includesInitials;
  const orderFit = {
    ...customFit,
    shirtColor: activeItemName,
    ...(customFit.sleeveType === "half" ? { cuffStyle: "" } : {}),
    threadColor: includesInitials ? customFit.threadColor || (customFit.initials ? DEFAULT_INITIALS_THREAD : "") : "",
    ...(!includesInitials ? { initials: "" } : {}),
  };

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
          ...orderFit,
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
        message: (err as Error).message || "Could not add item to bag",
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

  if (!isOpen) return null;

  const totalSteps = 6;
  const stepCopy = (n: number) => c.steps[n - 1] ?? { breadcrumb: "", title: "", subtitle: "" };

  // Selections in"YOUR SELECTION" are shown strictly up to the active step;
  // going back (e.g. from Step 6 to Step 2) dynamically hides future step choices.
  const showBodyType = currentStep >= 2;
  const showHeight = currentStep >= 3;
  const showSleeve = currentStep >= 5;
  const showCollar = currentStep >= 5 && !!customFit.collarStyle;
  const showCuff = currentStep >= 5 && isFullSleeve && !!customFit.cuffStyle;
  const selectedCollarStyle = customFit.collarStyle.toUpperCase();
  const selectedCollar = COLLAR_OPTIONS.find(({ matchKey }) => selectedCollarStyle.includes(matchKey));
  const selectedCuffStyle = customFit.cuffStyle.toUpperCase();
  const selectedCuff = CUFF_OPTIONS.find(({ matchKeys }) => matchKeys.some((key) => selectedCuffStyle.includes(key)));
  const handleCuffChange = (cuffStyle: string) => setCustomFit((prev) => ({ ...prev, cuffStyle }));
  const showMonogram = currentStep >= 5 && includesInitials && !!customFit.initials?.trim();
  const reviewFitPhoto = getCoralBuyNowFitPhoto((activeItem || product)?.slug, customFit.bodyFit);
  const reviewFitTitle = c.bodyFits.find(({ id }) => id === customFit.bodyFit)?.title;
  const reviewHeight = getHeightMeta(customFit.height);
  const reviewSleeve = isFullSleeve ? "Full Sleeves" : "Half Sleeves";
  const reviewPocket = customFit.pocket === "pocket" ? "With Pocket" : "Without Pocket";
  const reviewSleevePhoto = SLEEVE_PHOTOS[isFullSleeve ? "full" : "half"][customFit.pocket === "pocket" ? "pocket" : "no-pocket"];

  const isCurrentStepComplete = (() => {
    switch (currentStep) {
      case 1:
        return customFit.chestSize > 0;
      case 2:
        return !!customFit.bodyFit;
      case 3:
        return !!customFit.height;
      case 4:
        return !!customFit.sleeveType && !!customFit.pocket;
      case 5:
        return customFit.sleeveType === "half"
          ? !!customFit.collarStyle
          : (!!customFit.collarStyle && !!customFit.cuffStyle);
      case 6:
        return true;
      default:
        return false;
    }
  })();

  const handleNextStep = () => {
    if (!isCurrentStepComplete) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!submitting) {
      // Step 6: Complete — the parent adds the configured shirt to the bag
      triggerCelebration();
      void onConfirmCustomization({ ...orderFit, specialInstructions: specialInstructions || undefined }, activeItem);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
    if (h.toLowerCase().includes("extra")) return "Extra Tall";
    if (h.toLowerCase().includes("regular") || h.toLowerCase().includes("5.5") || h.toLowerCase().includes("standard")) return "Regular Height";
    return "Tall Height";
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-1.5 sm:p-2 lg:p-3 animate-in fade-in duration-200"
      data-lenis-prevent
    >

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[1560px] bg-[#F2E4D3] border border-[#E5E3DD] rounded-[24px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col min-h-[92vh] max-h-[97vh]"
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
                          <strong className="text-black font-bold">{customFit.chestSize > 0 ? `${customFit.chestSize}"` : "—"}</strong>
                        </div>

                        {/* Step 2: Body Type */}
                        {showBodyType && (
                          <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                            <span className="text-[#666666] font-medium">Body Type</span>
                            <strong className="text-black font-bold capitalize">{customFit.bodyFit ? `${customFit.bodyFit} Fit` : "—"}</strong>
                          </div>
                        )}

                        {/* Step 3: Height */}
                        {showHeight && (
                          <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                            <span className="text-[#666666] font-medium">Height</span>
                            <strong className="text-black font-bold">{customFit.height ? getHeightCleanTitle(customFit.height) : "—"}</strong>
                          </div>
                        )}

                        {/* Step 5 summary: Step 4 shows these choices on the preview and option cards. */}
                        {showSleeve && (
                          <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                            <span className="text-[#666666] font-medium">Sleeve</span>
                            <strong className="text-black font-bold capitalize">
                              {customFit.sleeveType ? (customFit.sleeveType === "half" ? "Half Sleeve" : "Full Sleeve") : "—"}
                            </strong>
                          </div>
                        )}

                        {showSleeve && !!customFit.pocket && (
                          <div className="flex justify-between items-center gap-2 animate-in fade-in duration-200">
                            <span className="text-[#666666] font-medium">Pocket</span>
                            <strong className="text-black font-bold capitalize">
                              {customFit.pocket === "pocket" ? "With Pocket" : "Without Pocket"}
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
                    buyNow={buyNow}
                    chestSize={customFit.chestSize}
                    bodyFit={customFit.bodyFit as "lean" | "regular" | "tummy" | ""}
                    height={customFit.height}
                    sleeveType={customFit.sleeveType === "half" ? "half" : "full"}
                    collarStyle={customFit.collarStyle}
                    cuffStyle={customFit.cuffStyle}
                    pocket={customFit.pocket === "no-pocket" ? "no-pocket" : customFit.pocket === "pocket" ? "pocket" : ""}
                    initials={orderFit.initials}
                    threadColor={orderFit.threadColor}
                    currentStep={currentStep}
                    product={activeItem}
                  />
                </div>

              </div>

              {/* RIGHT COLUMN: 6-Step Interactive Configurator Box */}
              <div className="lg:col-span-6 relative flex flex-col items-end w-full transition-all duration-300 -mt-1 sm:-mt-1.5 lg:-mt-2">

                <div className={`bg-gradient-to-b from-[#FAF3EA] via-[#F8EFE4] to-[#FAF3EA] border border-[#E7D6C6] rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_rgba(120,70,30,0.1)] relative z-10 flex flex-col justify-between w-full max-w-[550px] lg:ml-auto shrink-0 ${showInitialsPanel ? "h-[635px] sm:h-[705px] lg:h-[715px]" : "h-[585px] sm:h-[605px] lg:h-[625px]"}`}>

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
                          {currentStep === 5 && !isFullSleeve ? "Collar Style" : (STEP_HEADERS[currentStep]?.accent || "Style")}
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
                        {currentStep === 5 && !isFullSleeve
                          ? "Tailor the perfect collar curvature for your half sleeve shirt."
                          : stepCopy(currentStep).subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Steps Content Body - Fixed Height Container with Vertical Centering */}
                  <div className={`flex-1 min-h-0 flex flex-col w-full ${currentStep === 5 || currentStep === 6 ? "justify-start overflow-y-auto [scrollbar-width:thin] pr-0.5" : "justify-center my-auto"}`}>

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
                                  aria-pressed={isSelected}
                                  onClick={() => handleChestSelect(size)}
                                  className={`h-[48px] sm:h-[52px] px-1 rounded-[14px] font-[Arial,sans-serif] font-bold tabular-nums text-[16px] sm:text-[17px] transition-all duration-200 cursor-pointer flex items-center justify-center ${isSelected
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
                            <strong className="font-[Arial,sans-serif] font-bold tabular-nums text-[15px] sm:text-[16px] text-[#1A110B] block mt-0.5">
                              {customFit.chestSize > 0 ? `${customFit.chestSize}"` : "—"}
                            </strong>
                          </div>
                          <div className="px-1">
                            <span className="font-['Playfair_Display',Georgia,serif] italic font-medium text-[11.5px] sm:text-[12px] text-[#4E3B30] block">
                              Collar Size
                            </span>
                            <strong className="font-[Arial,sans-serif] font-bold tabular-nums text-[15px] sm:text-[16px] text-[#1A110B] block mt-0.5">
                              {customFit.collarSize > 0 ? `${customFit.collarSize}"` : "—"}
                            </strong>
                          </div>
                          <div className="px-1">
                            <span className="font-['Playfair_Display',Georgia,serif] italic font-medium text-[11.5px] sm:text-[12px] text-[#4E3B30] block">
                              Shoulder
                            </span>
                            <strong className="font-[Arial,sans-serif] font-bold tabular-nums text-[15px] sm:text-[16px] text-[#1A110B] block mt-0.5">
                              {customFit.shoulderSize > 0 ? `${customFit.shoulderSize}"` : "—"}
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
                              className={`w-full rounded-[16px] sm:rounded-[18px] p-2.5 sm:p-3 text-left transition-all duration-200 cursor-pointer ${isSelected
                                  ? "bg-gradient-to-b from-[#FDF8F2] via-[#FAF1E4] to-[#F5EAD9] border-[1.5px] border-[#9E5D2A] shadow-[0_3px_12px_rgba(158,93,42,0.12)] scale-[1.005]"
                                  : "bg-gradient-to-b from-[#FFFDF9]/90 to-[#FAF4EA]/80 hover:bg-[#FFFDF9] border border-[#DECBB8] shadow-[0_1px_4px_rgba(140,90,50,0.04)]"
                                }`}
                            >
                              <div className="flex items-start gap-2.5 sm:gap-3.5 w-full">
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
                                          {customFit.chestSize > 0 ? `${customFit.chestSize}"` : "—"}
                                        </strong>
                                      </span>
                                    </div>
                                    <span className="h-3.5 w-[1px] bg-[#C8B39F] mx-0.5" />
                                    <div className="flex items-center gap-1.5">
                                      <MeasuringTapeIcon className="w-[22px] h-[16px] sm:w-[24px] sm:h-[17px] shrink-0" />
                                      <span>
                                        <span className="font-['Playfair_Display',Georgia,serif] font-medium">{meta.stomachLabel} </span>
                                        <strong className="font-sans font-bold text-[#140E0A] text-[12px] sm:text-[12.5px]">
                                          {customFit.chestSize > 0 ? meta.getStomach(customFit.chestSize) : "—"}
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
                              className={`w-full rounded-[16px] sm:rounded-[18px] p-3 sm:p-3.5 lg:p-4 text-left transition-all duration-200 cursor-pointer ${isSelected
                                  ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_3px_12px_rgba(157,74,25,0.14)] scale-[1.005]"
                                  : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                                }`}
                            >
                              <div className="flex items-center gap-3 sm:gap-4">
                                {/* Radio Circle */}
                                <div className="shrink-0 pl-1">
                                  <div
                                    className={`w-5 sm:w-5.5 h-5 sm:h-5.5 rounded-full flex items-center justify-center transition-all ${isSelected
                                        ? "border-2 border-[#8A4418] bg-[#FDFBF7]"
                                        : "border-2 border-[#B8A392] bg-transparent"
                                      }`}
                                  >
                                    {isSelected && <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#8A4418]" />}
                                  </div>
                                </div>

                                {/* Person Silhouette Height Measurement Icon */}
                                <div className="shrink-0 flex items-center justify-center px-0.5 sm:px-1">
                                  <HeightSilhouetteIcon active={isSelected} className="w-7 sm:w-8 h-12 sm:h-14" />
                                </div>

                                {/* Vertical separator line matching reference design */}
                                <div className="h-10 sm:h-12 w-[1px] bg-[#DFC8B4] shrink-0 mx-0.5 sm:mx-1" />

                                {/* Card Content */}
                                <div className="flex-1 min-w-0">
                                  {/* Pill Badge */}
                                  <span
                                    className={`px-3.5 sm:px-4 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[9.5px] font-bold tracking-[0.16em] uppercase inline-block transition-colors ${isSelected
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
                              const isSelected = customFit.sleeveType === "half" && customFit.pocket === "pocket";
                              return (
                                <div
                                  onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "half", pocket: "pocket" }))}
                                  className={`p-3 sm:p-3.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${isSelected
                                      ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                      : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                                    }`}
                                >
                                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                        }`}
                                    >
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                    </div>
                                  </div>

                                  <div className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 h-20 sm:h-24">
                                    <img
                                      src={SLEEVE_PHOTOS.half.pocket}
                                      alt="Half Sleeve With Pocket"
                                      className="max-h-full max-w-[130px] object-contain drop-shadow-xs"
                                    />
                                  </div>

                                  <span
                                    className={`w-full py-1 px-2 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase transition-colors text-center mt-1.5 ${isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
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
                                  className={`p-3 sm:p-3.5 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${isSelected
                                      ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                      : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                                    }`}
                                >
                                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                        }`}
                                    >
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                    </div>
                                  </div>

                                  <div className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 h-20 sm:h-24">
                                    <img
                                      src={SLEEVE_PHOTOS.half["no-pocket"]}
                                      alt="Half Sleeve Without Pocket"
                                      className="max-h-full max-w-[130px] object-contain drop-shadow-xs"
                                    />
                                  </div>

                                  <span
                                    className={`w-full py-1 px-2 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase transition-colors text-center mt-1.5 ${isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
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
                            <span className="px-6 py-1 rounded-full bg-[#8A4418] text-white font-['Playfair_Display',Georgia,serif] text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_2px_6px_rgba(138,68,24,0.25)]">
                              FULL SLEEVE
                            </span>
                            <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                            {/* Full Sleeve WITH Pocket */}
                            {(() => {
                              const isSelected = customFit.sleeveType === "full" && customFit.pocket === "pocket";
                              return (
                                <div
                                  onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full", pocket: "pocket", cuffStyle: prev.cuffStyle || "CLASSIC CUFF" }))}
                                  className={`p-3 sm:p-3.5 rounded-[18px] sm:rounded-[20px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${isSelected
                                      ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                      : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                                    }`}
                                >
                                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#8A4418]/70 bg-transparent"
                                        }`}
                                    >
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                    </div>
                                  </div>

                                  <div className="w-full flex items-center justify-center pt-1.5 pb-1 h-24 sm:h-28">
                                    <img
                                      src={SLEEVE_PHOTOS.full.pocket}
                                      alt="Full Sleeve With Pocket"
                                      className="h-full w-auto max-w-[155px] object-contain drop-shadow-xs"
                                    />
                                  </div>

                                  <span
                                    className={`w-full py-1.5 px-3 rounded-full font-['Playfair_Display',Georgia,serif] text-[11px] sm:text-[11.5px] font-bold tracking-[0.06em] uppercase transition-colors text-center mt-1.5 ${isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
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
                                  onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full", pocket: "no-pocket", cuffStyle: prev.cuffStyle || "CLASSIC CUFF" }))}
                                  className={`p-3 sm:p-3.5 rounded-[18px] sm:rounded-[20px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${isSelected
                                      ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                      : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                                    }`}
                                >
                                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#8A4418]/70 bg-transparent"
                                        }`}
                                    >
                                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                    </div>
                                  </div>

                                  <div className="w-full flex items-center justify-center pt-1.5 pb-1 h-24 sm:h-28">
                                    <img
                                      src={SLEEVE_PHOTOS.full["no-pocket"]}
                                      alt="Full Sleeve Without Pocket"
                                      className="h-full w-auto max-w-[155px] object-contain drop-shadow-xs"
                                    />
                                  </div>

                                  <span
                                    className={`w-full py-1.5 px-3 rounded-full font-['Playfair_Display',Georgia,serif] text-[11px] sm:text-[11.5px] font-bold tracking-[0.06em] uppercase transition-colors text-center mt-1.5 ${isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
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
                      <div className="space-y-1.5 sm:space-y-2 pt-1 pb-1 animate-in fade-in duration-200">
                        {/* SECTION 1: COLLAR STYLE */}
                        <div>
                          {/* Divider Badge with Center Pill */}
                          <div className="flex items-center gap-3 w-full mb-1.5 sm:mb-2">
                            <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                            <span className="px-4 py-0.5 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[8.5px] sm:text-[9px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                              COLLAR STYLE
                            </span>
                            <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                          </div>

                          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                            {COLLAR_OPTIONS.map((col) => {
                              const isSelected = selectedCollar?.id === col.id;
                              return (
                                <div
                                  key={col.id}
                                  onClick={() => setCustomFit((prev) => ({ ...prev, collarStyle: col.title }))}
                                  className={`p-1.5 sm:p-2 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${isSelected
                                      ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                      : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                                    }`}
                                >
                                  {/* Radio Circle Top-Left */}
                                  <div className="absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center transition-all">
                                    <div
                                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                        }`}
                                    >
                                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#8A4418]" />}
                                    </div>
                                  </div>

                                  {/* Collar Photo */}
                                  <div className="w-full flex items-center justify-center pt-1 pb-0.5 h-14 sm:h-16 lg:h-17">
                                    <img
                                      src={col.image}
                                      alt={col.title}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  </div>

                                  {/* Pill Badge */}
                                  <span
                                    className={`w-full py-0.5 px-1 rounded-full text-[8px] sm:text-[8.5px] font-bold tracking-[0.12em] uppercase transition-colors text-center mt-1 min-h-[22px] sm:min-h-[24px] flex items-center justify-center leading-tight whitespace-pre-line ${isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
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

                        {/* SECTION 2: CUFF STYLE (Only for Full Sleeves) */}
                        {isFullSleeve && (
                          <div>
                            {/* Divider Badge with Center Pill */}
                            <div className="flex items-center gap-3 w-full mb-1.5 sm:mb-2 mt-0.5">
                              <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                              <span className="px-4 py-0.5 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[8.5px] sm:text-[9px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                                CUFF STYLE
                              </span>
                              <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                              {CUFF_OPTIONS.map((cuff) => {
                                const isSelected = selectedCuff?.id === cuff.id;
                                return (
                                  <div
                                    key={cuff.id}
                                    onClick={() => handleCuffChange(cuff.title)}
                                    className={`p-1.5 sm:p-2 rounded-[16px] text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer ${isSelected
                                        ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#9D4A19] shadow-[0_4px_14px_rgba(157,74,25,0.14)] scale-[1.01]"
                                        : "bg-[#FFF8F1]/80 hover:bg-[#FFF5EC] border border-[#DFC8B4] shadow-2xs hover:shadow-xs"
                                      }`}
                                  >
                                    {/* Radio Circle Top-Left */}
                                    <div className="absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center transition-all">
                                      <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${isSelected ? "border-2 border-[#8A4418] bg-[#FDFBF7]" : "border-2 border-[#B8A392] bg-transparent"
                                          }`}
                                      >
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#8A4418]" />}
                                      </div>
                                    </div>

                                    {/* Cuff Photo */}
                                    <div className="w-full flex items-center justify-center pt-1 pb-0.5 h-14 sm:h-16 lg:h-17">
                                      <img
                                        src={cuff.image}
                                        alt={cuff.title}
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    </div>

                                    {/* Pill Badge */}
                                    <span
                                      className={`w-full py-0.5 px-1.5 rounded-full text-[8px] sm:text-[8.5px] font-bold tracking-[0.12em] uppercase transition-colors text-center mt-1 min-h-[22px] sm:min-h-[24px] flex items-center justify-center leading-tight whitespace-pre-line ${isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#DFD0BE] text-[#3E2D22]"
                                        }`}
                                    >
                                      {cuff.badge}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SECTION 3: INITIALS (Only for Full Sleeves) */}
                        {isFullSleeve && (
                          <div>
                            {/* Divider Badge with Center Pill */}
                            <div className="mt-1 mb-2 flex w-full items-center gap-3">
                              <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                              <span className="shrink-0 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] px-5 py-1 text-[10px] font-bold tracking-[0.18em] text-white uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] sm:text-[11px]">
                                INITIALS
                              </span>
                              <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                            </div>

                            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-[14px] border border-[#DFC8B4] bg-[#FFF8F1]/90 px-3 py-2 shadow-2xs sm:px-3.5">
                              <span id={`${initialsId}-question`} className="font-playfair text-[13px] font-extrabold leading-tight text-[#1F1A17] sm:text-[15px]">
                                Do You Want Initials?
                              </span>
                              <div role="radiogroup" aria-labelledby={`${initialsId}-question`} className="flex shrink-0 gap-2">
                                {[true, false].map((enabled) => (
                                  <label
                                    key={String(enabled)}
                                    className={`font-playfair flex min-h-9 min-w-[68px] cursor-pointer items-center justify-center gap-1.5 rounded-full border px-2.5 text-[11px] font-extrabold transition-colors focus-within:ring-2 focus-within:ring-[#C68A4C]/50 sm:min-h-10 sm:min-w-[74px] sm:text-[13px] ${wantsInitials === enabled
                                      ? "border-[#8A4418] bg-[#F3DFCB] text-[#6D3413]"
                                      : "border-[#DFC8B4] bg-[#FFFCF8] text-[#4E3B30] hover:bg-[#FAEDE0]"
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`${initialsId}-choice`}
                                      checked={wantsInitials === enabled}
                                      onChange={() => setWantsInitials(enabled)}
                                      className="size-3.5 shrink-0 accent-[#8A4418]"
                                    />
                                    {enabled ? "Yes" : "No"}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {showInitialsPanel && (
                              <InitialsPanel
                                id={initialsId}
                                initials={customFit.initials}
                                threadColor={orderFit.threadColor}
                                cuff={selectedCuff ?? CUFF_OPTIONS[0]}
                                cuffOptions={CUFF_OPTIONS}
                                onCuffChange={handleCuffChange}
                                onInitialsChange={(initials) => setCustomFit((prev) => ({ ...prev, initials }))}
                                onThreadChange={(threadColor) => setCustomFit((prev) => ({ ...prev, threadColor }))}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 6: REVIEW */}
                    {currentStep === 6 && (
                      <div className="space-y-1.5 sm:space-y-2 pt-0.5 animate-in fade-in duration-200">
                        {/* 6-Step Stepper Pills Bar matching Reference Image */}
                        <div className="flex items-center justify-between gap-1 w-full pb-2 border-b border-[#EADBCE]">
                          {/* Step 1: Chest */}
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#B87A46] to-[#9C5F2D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                              1
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#E8D9C8] text-[9px] sm:text-[9.5px] font-semibold text-[#422C1D] group-hover:text-[#8A4418] flex items-center justify-center gap-0.5 whitespace-nowrap shadow-2xs leading-none">
                              Chest <span className="text-[#422C1D] font-bold">✓</span>
                            </span>
                          </button>

                          {/* Step 2: Body */}
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#B87A46] to-[#9C5F2D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                              2
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#E8D9C8] text-[9px] sm:text-[9.5px] font-semibold text-[#422C1D] group-hover:text-[#8A4418] flex items-center justify-center gap-0.5 whitespace-nowrap shadow-2xs leading-none">
                              Body <span className="text-[#422C1D] font-bold">✓</span>
                            </span>
                          </button>

                          {/* Step 3: Height */}
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#B87A46] to-[#9C5F2D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                              3
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#E8D9C8] text-[9px] sm:text-[9.5px] font-semibold text-[#422C1D] group-hover:text-[#8A4418] flex items-center justify-center gap-0.5 whitespace-nowrap shadow-2xs leading-none">
                              Height <span className="text-[#422C1D] font-bold">✓</span>
                            </span>
                          </button>

                          {/* Step 4: Measure */}
                          <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#B87A46] to-[#9C5F2D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                              4
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#E8D9C8] text-[9px] sm:text-[9.5px] font-semibold text-[#422C1D] group-hover:text-[#8A4418] flex items-center justify-center gap-0.5 whitespace-nowrap shadow-2xs leading-none">
                              Measure <span className="text-[#422C1D] font-bold">✓</span>
                            </span>
                          </button>

                          {/* Step 5: Cuff / Collar */}
                          <button
                            type="button"
                            onClick={() => setCurrentStep(5)}
                            className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#B87A46] to-[#9C5F2D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                              5
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#E8D9C8] text-[9px] sm:text-[9.5px] font-semibold text-[#422C1D] group-hover:text-[#8A4418] flex items-center justify-center gap-0.5 whitespace-nowrap shadow-2xs leading-none">
                              {isFullSleeve ? "Cuff" : "Collar"} <span className="text-[#422C1D] font-bold">✓</span>
                            </span>
                          </button>

                          {/* Step 6: Review (Active) */}
                          <div className="flex flex-col items-center gap-1 flex-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#7A1220] via-[#5E0713] to-[#42040C] text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-[#7A1220]/25">
                              6
                            </div>
                            <span className="px-3.5 sm:px-4 py-0.5 rounded-full bg-gradient-to-r from-[#A05C2B] via-[#8C471C] to-[#A05C2B] text-white text-[9.5px] sm:text-[10px] font-bold tracking-wider leading-none shadow-xs whitespace-nowrap">
                              Review
                            </span>
                          </div>
                        </div>

                        {/* SECTION: YOUR SELECTION SUMMARY */}
                        <div>
                          {/* Divider Badge with Center Pill */}
                          <div className="flex items-center gap-3 w-full my-1.5 sm:my-2">
                            <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                            <span className="px-5 py-1 rounded-full bg-[#8A4418] text-white text-[10px] sm:text-[11px] font-extrabold tracking-[0.16em] uppercase shadow-[0_2px_6px_rgba(138,68,24,0.25)] shrink-0 font-sans">
                              YOUR SELECTION SUMMARY
                            </span>
                            <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                          </div>

                          {/* 6-Row Specification Strip matching Reference Image */}
                          <div className="rounded-[16px] bg-[#FFFFFF] border-2 border-[#D9C4B0] overflow-hidden divide-y divide-[#EADCCE] shadow-xs">
                            {/* 1. FABRIC */}
                            <div className="py-2.5 px-3 sm:py-3 sm:px-4 flex items-center gap-3 sm:gap-3.5">
                              <div className="w-[76px] h-[36px] sm:w-[86px] sm:h-[40px] md:w-[94px] md:h-[44px] rounded-[8px] overflow-hidden border border-[#DEC7B2] shrink-0 bg-[#F4EDE4] shadow-2xs">
                                <img
                                  src={activeItem?.image || product?.image || "/customizer/review_fabric_thumb.jpg?v=7"}
                                  alt={activeItemName || productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.09em] text-[#8A4418] uppercase block leading-tight font-sans">
                                  1. FABRIC
                                </span>
                                <span className="text-[13px] sm:text-[14.5px] font-bold text-[#14110E] block leading-snug font-sans">
                                  {activeItem?.name || activeItemName || productName}
                                </span>
                              </div>
                            </div>

                            {/* 2. SIZE & FIT */}
                            <div className="py-2.5 px-3 sm:py-3 sm:px-4 flex items-center gap-3 sm:gap-3.5">
                              <div className="w-[76px] h-[36px] sm:w-[86px] sm:h-[40px] md:w-[94px] md:h-[44px] rounded-[8px] overflow-hidden border border-[#DEC7B2] shrink-0 bg-[#F8F4EE] shadow-2xs flex items-center justify-center p-0.5">
                                <img
                                  src={reviewFitPhoto ?? getMatchingShirtModel(
                                    activeItem || product,
                                    false,
                                    asMannequinFit(customFit.bodyFit),
                                  )}
                                  alt="Size & Fit"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.09em] text-[#8A4418] uppercase block leading-tight font-sans">
                                  2. SIZE & FIT
                                </span>
                                <span className="text-[13px] sm:text-[14.5px] font-bold text-[#14110E] block capitalize leading-snug font-sans">
                                  Chest Size: {customFit.chestSize}&quot;<span className="font-bold text-[#8A4418]/60 px-2">|</span>{reviewFitTitle?.toLowerCase() || customFit.bodyFit}
                                </span>
                              </div>
                            </div>

                            {/* 3. HEIGHT */}
                            <div className="py-2.5 px-3 sm:py-3 sm:px-4 flex items-center gap-3 sm:gap-3.5">
                              <div aria-hidden="true" className="flex w-[76px] h-[36px] sm:w-[86px] sm:h-[40px] md:w-[94px] md:h-[44px] items-end justify-center rounded-[8px] overflow-hidden border border-[#DEC7B2] shrink-0 bg-[#F4EDE4] pb-0.5 shadow-2xs">
                                <HeightSilhouetteIcon active className={`w-auto ${reviewHeight.title.startsWith("EXTRA") ? "h-full" : reviewHeight.title === "TALL HEIGHT" ? "h-[90%]" : "h-[80%]"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.09em] text-[#8A4418] uppercase block leading-tight font-sans">
                                  3. HEIGHT
                                </span>
                                <span className="text-[13px] sm:text-[14.5px] font-bold text-[#14110E] block leading-snug font-sans">
                                  {getHeightCleanTitle(customFit.height)} ({reviewHeight.heightRangeFormatted})
                                </span>
                              </div>
                            </div>

                            {/* 4. SLEEVE */}
                            <div className="py-2.5 px-3 sm:py-3 sm:px-4 flex items-center gap-3 sm:gap-3.5">
                              <div className="w-[76px] h-[36px] sm:w-[86px] sm:h-[40px] md:w-[94px] md:h-[44px] rounded-[8px] overflow-hidden border border-[#DEC7B2] shrink-0 bg-[#F4EDE4] shadow-2xs">
                                <img
                                  src={reviewSleevePhoto}
                                  alt={`${reviewSleeve} ${reviewPocket.toLowerCase()}`}
                                  className="w-full h-full object-contain p-0.5"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.09em] text-[#8A4418] uppercase block leading-tight font-sans">
                                  4. SLEEVE
                                </span>
                                <span className="text-[13px] sm:text-[14.5px] font-bold text-[#14110E] block capitalize leading-snug font-sans">
                                  {reviewSleeve}
                                  <span className="font-bold text-[#8A4418]/60 px-2">|</span>
                                  {reviewPocket}
                                </span>
                              </div>
                            </div>

                            {/* 5. COLLAR & CUFF */}
                            <div className="py-2.5 px-3 sm:py-3 sm:px-4 flex items-center gap-3 sm:gap-3.5">
                              <div className="flex w-[76px] h-[36px] sm:w-[86px] sm:h-[40px] md:w-[94px] md:h-[44px] items-center divide-x divide-[#DEC7B2] rounded-[8px] overflow-hidden border border-[#DEC7B2] shrink-0 bg-[#F4EDE4] shadow-2xs">
                                <img
                                  src={(selectedCollar ?? COLLAR_OPTIONS[0]).image}
                                  alt={selectedCollar?.title ?? customFit.collarStyle}
                                  className="min-w-0 flex-1 h-full object-contain p-0.5"
                                />
                                {isFullSleeve && selectedCuff && (
                                  <img src={selectedCuff.image} alt={selectedCuff.title} className="min-w-0 flex-1 h-full object-contain p-0.5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.09em] text-[#8A4418] uppercase block leading-tight font-sans">
                                  {isFullSleeve ? "5. COLLAR & CUFF" : "5. COLLAR STYLE"}
                                </span>
                                <span className="text-[13px] sm:text-[14.5px] font-bold text-[#14110E] block leading-snug font-sans">
                                  {selectedCollar?.title ?? customFit.collarStyle}
                                  {isFullSleeve && (
                                    <>
                                      <span className="font-bold text-[#8A4418]/60 px-2">|</span>
                                      {selectedCuff?.title ?? customFit.cuffStyle}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>

                        {/* 6. INITIALS (Only for Full Sleeves when Monogram is Entered) */}
                        {showMonogram && (
                          <div className="py-2.5 px-3 sm:py-3 sm:px-4 flex items-center gap-3 sm:gap-3.5">
                            <div className="flex w-[76px] h-[36px] sm:w-[86px] sm:h-[40px] md:w-[94px] md:h-[44px] items-center rounded-[8px] overflow-hidden border border-[#DEC7B2] shrink-0 bg-[#F4EDE4] shadow-2xs">
                              <InitialsCuffPreview initials={orderFit.initials} threadColor={orderFit.threadColor} cuffId={selectedCuff?.id ?? CUFF_OPTIONS[0].id} className="w-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.09em] text-[#8A4418] uppercase block leading-tight font-sans">
                                6. INITIALS
                              </span>
                              <span className="text-[13px] sm:text-[14.5px] font-bold text-[#14110E] block leading-snug font-sans">
                                {customFit.initials.trim()}
                                {` (${getInitialsThreadLabel(orderFit.threadColor)} Thread)`}
                              </span>
                            </div>
                          </div>
                        )}
                          </div>
                        </div>

                        {/* SECTION: ADDITIONAL REMARKS / SPECIAL INSTRUCTIONS */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[9.5px] sm:text-[10px] font-extrabold tracking-[0.08em] text-[#14110E] uppercase font-sans">
                              ADDITIONAL REMARKS / SPECIAL INSTRUCTIONS
                            </label>
                            <span className="text-[9.5px] sm:text-[10px] text-[#7A6B60] font-semibold font-sans">
                              {specialInstructions.length}/400
                            </span>
                          </div>

                          <div className="relative rounded-[14px] bg-[#FFFFFF] border-2 border-[#D9C4B0] p-2.5 sm:p-3 flex items-start gap-2.5 shadow-2xs">
                            <svg className="w-4 h-4 text-[#8A4418] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>

                            <textarea
                              rows={3}
                              maxLength={400}
                              value={specialInstructions}
                              onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 400))}
                              placeholder="If you want any changes in the above measure, just write in this box for whatever you have selected. If you want a little half inch to one inch plus or minus, just let us know in this box so we can make according to your customization."
                              className="w-full bg-transparent text-[11px] sm:text-[12px] text-[#14110E] placeholder:text-[#8C7A6E] focus:outline-none resize-none min-h-[58px] sm:min-h-[64px] max-h-[72px] leading-relaxed overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-sans font-medium"
                            />

                            {/* Diagonal resize indicator lines matching Reference Image */}
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
                  <div className="shrink-0 pt-2.5 sm:pt-3 border-t border-[#DFCDBA] flex items-center justify-between gap-3 mt-auto relative z-20 bg-[#FAF3EA]">
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
                      disabled={!isCurrentStepComplete || submitting}
                      className={`flex-1 py-2.5 sm:py-3 px-6 sm:px-7 rounded-[14px] sm:rounded-full flex items-center justify-between border transition-all ${isCurrentStepComplete && !submitting
                          ? "bg-gradient-to-r from-[#6D0E1C] via-[#5A0713] to-[#3F030A] hover:from-[#7C1222] hover:to-[#4C050D] text-white border-[#7D1524] shadow-[0_4px_16px_rgba(85,8,18,0.35)] cursor-pointer active:scale-[0.99]"
                          : "bg-[#D9C8B7] text-[#7A695C] border-[#CBB8A6] cursor-not-allowed opacity-70"
                        }`}
                    >
                      <span className="font-['Playfair_Display',Georgia,serif] font-bold text-[11.5px] sm:text-xs tracking-[0.18em] uppercase">
                        {currentStep === totalSteps ? (submitting ? c.addingLabel : "CONFIRM & PROCEED →") : c.continueLabel}
                      </span>
                      <span className="border-l border-current/25 pl-3.5 sm:pl-4 text-[10.5px] sm:text-[11px] font-bold tracking-widest font-sans">
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
                        <div className={`relative w-full aspect-[254/350] rounded-[10px] overflow-hidden bg-[#ECEAE5] transition-all duration-300 ${isSelected ? "ring-2 ring-black" : ""
                          }`}>
                          <div className="block relative w-full h-full overflow-hidden rounded-[10px]">
                            {/* Default Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={activeMainImage}
                              alt={sister.name}
                              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-600 ease-out group-hover:scale-102 ${activeHoverImage ? "group-hover:opacity-0" : ""
                                }`}
                              loading="eager"
                              decoding="async"
                            />

                            {/* Hover Image */}
                            {activeHoverImage && (
                              <div className="absolute inset-0 w-full h-full bg-[#ECEAE5] opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-out z-10 overflow-hidden pointer-events-none">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={activeHoverImage}
                                  alt={`${sister.name} Full Look`}
                                  className="w-full h-full object-cover object-center transition-transform duration-600 ease-out group-hover:scale-102"
                                  loading="eager"
                                  decoding="async"
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
                              className={`drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-colors ${isSaved
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
                            className={`shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5 ${count > 0 ? "bg-black text-white" : "bg-white hover:bg-black text-black hover:text-white"
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

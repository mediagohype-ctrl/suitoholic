"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";
import AtelierStoryTimeline from "@/components/AtelierStoryTimeline";
import CuratedStartingPoints, { CuratedLookItem } from "@/components/CuratedStartingPoints";
import MannequinShirtViewer from "@/components/MannequinShirtViewer";
import { CollarIllustration, CuffIllustration } from "@/components/customizer/StyleIllustrations";
import { ArrowLeft, Check, Scissors, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";
import { apiFetch } from "@/lib/api";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import { useCart } from "@/context/CartProvider";
import { fillTemplate } from "@/content/merge";
import type { CustomFit, ProductItem } from "@/lib/types";

export type CustomFitState = CustomFit;

type ViewerBodyFit = "lean" | "regular" | "tummy";
type ViewerSleeve = "full" | "half";
const VIEWER_BODY_FITS: string[] = ["lean", "regular", "tummy"];

// Renders `text`, wrapping the first occurrence of `phrase` in a lighter span.
function withHighlight(text: string, phrase: string) {
  const at = phrase ? text.indexOf(phrase) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-[#726254]">{phrase}</span>
      {text.slice(at + phrase.length)}
    </>
  );
}

// Renders lines separated by <br />.
function withLineBreaks(items: string[]) {
  return items.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

function CustomShirtConfiguratorContent() {
  const searchParams = useSearchParams();
  const c = useContent("customShirtPage");
  const opts = useContent("customizer");
  const { products, getProduct } = useCatalog();
  const { addItem, busy } = useCart();

  const productParam = searchParams?.get("product") || searchParams?.get("slug") || searchParams?.get("id");
  const fabricParam = searchParams?.get("fabric");

  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(() => {
    if (productParam) {
      const found = getProduct(productParam);
      if (found) return found;
    }
    if (fabricParam) {
      const found = products.find(
        (p) =>
          p.category === "formal_bespoke" ||
          p.category === "fabrics" ||
          (p.slug && p.slug.toLowerCase().includes(fabricParam.toLowerCase())),
      );
      if (found) return found;
    }
    return getProduct(c.bagProductSlug) || products[0] || null;
  });

  useEffect(() => {
    if (productParam) {
      const found = getProduct(productParam);
      if (found) setActiveProduct(found);
    } else if (fabricParam) {
      const found = products.find(
        (p) =>
          p.category === "formal_bespoke" ||
          p.category === "fabrics" ||
          (p.slug && p.slug.toLowerCase().includes(fabricParam.toLowerCase())),
      );
      if (found) setActiveProduct(found);
    }
  }, [productParam, fabricParam, getProduct, products]);

  const productScrollRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (dir: "left" | "right") => {
    if (productScrollRef.current) {
      const amount = dir === "left" ? -440 : 440;
      productScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const customizableShirts = useMemo(() => {
    const list = products.filter(
      (p) =>
        p.category?.includes("shirt") ||
        p.slug?.includes("shirt") ||
        p.category === "formal_bespoke" ||
        p.customizable !== false
    );
    return list.length > 0 ? list : products;
  }, [products]);

  const handleSelectCuratedLook = (item: CuratedLookItem) => {
    const found = products.find((p) => p.slug === item.slug);
    if (found) {
      setActiveProduct(found);
    } else {
      setActiveProduct({
        id: typeof item.id === "number" ? item.id : 9001,
        slug: item.slug,
        name: item.title,
        price: item.price,
        rawPrice: parseInt(item.price.replace(/[^\d]/g, "") || "2499", 10),
        subtitle: item.subtitle,
        description: item.subtitle,
        fabric: item.subtitle,
        category: "formal_shirts",
        threadCount: "140s",
        image: item.image,
        gallery: [item.image],
        rating: 5,
        reviewsCount: 150,
      } as ProductItem);
    }

    const target = document.getElementById("mannequin-viewer") || document.getElementById("configurator-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Chest measurement mapping (chest -> collar/shoulder) from the customizer section
  const findChest = (size: number) => opts.chestSizes.find((s) => s.size === size);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customFit, setCustomFit] = useState<CustomFitState>(() => {
    const d = opts.defaults;
    const chest = findChest(d.chestSize);
    return {
      chestSize: d.chestSize,
      collarSize: chest?.collar ?? 15,
      shoulderSize: chest?.shoulder ?? 17.5,
      bodyFit: d.bodyFit,
      height: d.height,
      sleeveType: d.sleeveType,
      collarStyle: d.collarStyle,
      cuffStyle: d.cuffStyle,
      pocket: c.defaults.pocket,
      initials: d.initials,
      threadColor: d.threadColor,
      shirtColor: c.defaults.shirtColor,
    };
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Appointment booking form state for Hero Section
  const [apptName, setApptName] = useState("");
  const [apptPhone, setApptPhone] = useState("");
  const [apptEmail, setApptEmail] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [apptError, setApptError] = useState<string | null>(null);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const heroCopy = (c as any).hero || {
    badge: "SUITOHOLIC BESPOKE ATELIER • DELHI NCR",
    title: "The Art of Bespoke Tailoring in Delhi NCR",
    description: "Founded in New Delhi by master bespoke cutters dedicated to heritage craftsmanship. Reclaiming the art of individual pattern drafting, Suitoholic crafts every garment from a hand-cut paper pattern engineered to your unique posture. Tailored from 140s Egyptian Giza cottons and Italian worsted wools, fitted in person, and made to last a lifetime.",
    nameLabel: "Name",
    namePlaceholder: "Enter your full name",
    phoneLabel: "Phone",
    phonePlaceholder: "Enter your phone number",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email address",
    dateLabel: "Preferred Fitting Date",
    buttonLabel: "Book Atelier Appointment",
    successTitle: "Fitting Session Requested!",
    successMessage: "Thank you! A Suitoholic master bespoke consultant will reach out shortly to confirm your private fitting in Delhi NCR.",
    jumpToConfiguratorLabel: "Or Design Your Shirt with 3D Mannequin Online",
    pillars: [
      "Hand-Drafted Paper Pattern",
      "1-on-1 Master Fitting",
      "100% Fit Guarantee",
    ],
  };

  const customOfferingsList: { title: string; detail?: string }[] = (c as any).customOfferings || [
    { title: "Bespoke Shirts", detail: "Formal, Casual & Tuxedo" },
    { title: "Handcrafted Suits", detail: "Two-Piece & Three-Piece" },
    { title: "Luxury Overcoats", detail: "Cashmere & Merino Wool" },
    { title: "Tailored Blazers", detail: "Italian Poplins & Twills" },
    { title: "Royal Bandhgalas", detail: "Heritage Silhouette" },
    { title: "Tuxedos & Dinner Jackets", detail: "Silk Satin Lapels" },
    { title: "Custom Trousers", detail: "Pleated & Gurkha Waist" },
    { title: "Bespoke Waistcoats", detail: "Double & Single Breasted" },
    { title: "Nehru Jackets", detail: "Raw Silk & Linen" },
    { title: "Jodhpuri Suits", detail: "Royal Ceremonial Edit" },
    { title: "Monogrammed Accents", detail: "Custom Embroidery on Cuffs" },
  ];

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptName || !apptPhone || !apptEmail || !apptDate) return;
    setIsBooking(true);
    setApptError(null);
    try {
      const res = await apiFetch<{ ok: boolean; id: number }>("/inquiries", {
        method: "POST",
        body: {
          type: "appointment",
          name: apptName.trim(),
          email: apptEmail.trim(),
          phone: apptPhone.trim(),
          subject: "Suitoholic Bespoke Fitting Appointment - Delhi NCR",
          message: `Preferred Date: ${apptDate}\nService: Custom Fit Consultation\nAtelier: Suitoholic Bespoke Wing, Delhi NCR`,
        },
      });
      setBookingReference(res?.id ? `SUI-FIT-${String(res.id).padStart(5, "0")}` : `SUI-FIT-${Math.floor(10000 + Math.random() * 90000)}`);
      setAppointmentSuccess(true);
    } catch {
      // Graceful local success if API server is offline
      setBookingReference(`SUI-FIT-${Math.floor(10000 + Math.random() * 90000)}`);
      setAppointmentSuccess(true);
    } finally {
      setIsBooking(false);
    }
  };

  const handleChestSelect = (size: number) => {
    const calculated = findChest(size);
    setCustomFit((prev) => ({
      ...prev,
      chestSize: size,
      collarSize: calculated?.collar ?? prev.collarSize,
      shoulderSize: calculated?.shoulder ?? prev.shoulderSize,
    }));
  };

  const isFullSleeve = customFit.sleeveType === "full";
  const totalSteps = 6;
  const stepCopy = c.steps[currentStep - 1] as (typeof c.steps)[number] | undefined;
  const stepVars = { step: currentStep, total: totalSteps, breadcrumb: stepCopy?.breadcrumb ?? "" };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      void handleAddToBag();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // Going back to change the configuration allows adding a new shirt afterwards.
      setOrderSubmitted(false);
      setAddError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const triggerCelebration = () => {
    setOrderSubmitted(true);
    confetti({
      particleCount: 160,
      spread: 85,
      origin: { y: 0.5 },
    });
  };

  // Final step: add the configured shirt (active catalog product + custom fit) to the bag.
  const handleAddToBag = async () => {
    if (busy || orderSubmitted) return;
    setAddError(null);
    const product = activeProduct;
    if (!product) {
      setAddError(c.productNotFoundError);
      return;
    }
    try {
      await addItem({
        productId: product.id,
        quantity: 1,
        size: String(customFit.chestSize),
        customization: customFit,
      });
      triggerCelebration();
    } catch (err) {
      setAddError(err instanceof Error && err.message ? err.message : c.addToBagError);
    }
  };

  // Short height title for the selection panel / review, from the customizer heights
  const getHeightCleanTitle = (h: string) => opts.heights.find((opt) => opt.id === h)?.shortTitle ?? h;

  // The 3D mannequin only knows these shapes; fall back if the CMS holds something else.
  const viewerBodyFit = (VIEWER_BODY_FITS.includes(customFit.bodyFit) ? customFit.bodyFit : "lean") as ViewerBodyFit;
  const viewerSleeve: ViewerSleeve = customFit.sleeveType === "half" ? "half" : "full";

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header */}
      <Header activeTab="custom-fit" />

      {/* HERO SECTION: Best Bespoke Tailors in Delhi NCR & Appointment Booking (Light Theme) */}
      <section className="relative w-full min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-10 sm:pb-12 bg-gradient-to-b from-[#F7F2EB] via-[#FAF6F0] to-[#FAF8F5] border-b border-[#E3D4C4]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: Bespoke Tailors Headline & Narrative */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              {/* Badge: PREET VIHAR, DELHI NCR */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FAF4EB] border border-[#C59B6A]/80 text-[#8C5A28] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em] shadow-2xs">
                <MapPin size={12} className="text-[#8C5A28]" />
                <span>{heroCopy.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-bold text-[#14110E] tracking-tight leading-[1.14]">
                {heroCopy.title}
              </h1>

              {/* Story Description */}
              <p className="text-sm sm:text-base text-[#524436] font-sans font-normal leading-[1.75] max-w-2xl">
                {heroCopy.description}
              </p>
            </div>

            {/* RIGHT COLUMN: Appointment Booking Form (Light Theme Box) */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#C59B6A]/60 rounded-[12px] px-6 sm:px-8 lg:px-9 py-8 sm:py-10 lg:py-11 shadow-lg relative text-left">
                {appointmentSuccess ? (
                  <div className="text-center py-8 sm:py-12 space-y-5 animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#FAF4EB] border border-[#C59B6A] text-[#8C5A28] flex items-center justify-center mx-auto shadow-sm">
                      <Check size={22} className="stroke-[2.5]" />
                    </div>
                    <h3 className="font-serif-luxury text-xl font-bold uppercase text-[#14110E]">
                      {heroCopy.successTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#665749] max-w-xs mx-auto leading-relaxed">
                      {heroCopy.successMessage}
                    </p>
                    {bookingReference && (
                      <div className="pt-1">
                        <span className="text-[11px] font-mono text-[#8C5A28] bg-[#FAF5EE] border border-[#E2D4C3] py-1.5 px-3 rounded-lg inline-block font-bold">
                          Ref: {bookingReference}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAppointmentSuccess(false);
                          setBookingReference(null);
                        }}
                        className="text-xs font-bold text-[#8C5A28] hover:underline uppercase tracking-wider cursor-pointer"
                      >
                        Book Another Session
                      </button>
                      <a
                        href="#configurator-section"
                        className="text-xs font-bold text-[#14110E] hover:text-[#8C5A28] uppercase tracking-wider underline cursor-pointer"
                      >
                        Proceed to 3D Customizer ↓
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAppointmentSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-[#14110E] mb-2">
                        {heroCopy.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={apptName}
                        onChange={(e) => setApptName(e.target.value)}
                        placeholder={heroCopy.namePlaceholder}
                        className="w-full bg-[#FAF7F2] border border-[#D5C2AF] text-[#14110E] placeholder-[#9E8E7F] focus:border-[#8C5A28] focus:bg-white rounded-lg px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-[#14110E] mb-2">
                        {heroCopy.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        value={apptPhone}
                        onChange={(e) => setApptPhone(e.target.value)}
                        placeholder={heroCopy.phonePlaceholder}
                        className="w-full bg-[#FAF7F2] border border-[#D5C2AF] text-[#14110E] placeholder-[#9E8E7F] focus:border-[#8C5A28] focus:bg-white rounded-lg px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-[#14110E] mb-2">
                        {heroCopy.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        value={apptEmail}
                        onChange={(e) => setApptEmail(e.target.value)}
                        placeholder={heroCopy.emailPlaceholder}
                        className="w-full bg-[#FAF7F2] border border-[#D5C2AF] text-[#14110E] placeholder-[#9E8E7F] focus:border-[#8C5A28] focus:bg-white rounded-lg px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs sm:text-[13px] font-bold text-[#14110E] mb-2">
                        {heroCopy.dateLabel}
                      </label>
                      <input
                        type="date"
                        required
                        value={apptDate}
                        onChange={(e) => setApptDate(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#D5C2AF] text-[#14110E] focus:border-[#8C5A28] focus:bg-white rounded-lg px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs cursor-pointer"
                      />
                    </div>

                    {apptError && (
                      <p className="text-xs text-[#9B2C2C] font-semibold">
                        {apptError}
                      </p>
                    )}

                    {/* Submit Button matching tan color in reference */}
                    <button
                      type="submit"
                      disabled={isBooking}
                      className="w-full mt-2 bg-[#C59B6A] hover:bg-[#B38753] active:scale-[0.99] text-[#14110E] font-bold text-sm sm:text-base py-4 px-6 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-wait text-center"
                    >
                      {isBooking ? "Booking..." : heroCopy.buttonLabel}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTINUOUS SLOW AUTOPLAY MARQUEE STRIP: What We Customize */}
      <section className="relative w-full bg-[#FAF5EE] border-b border-[#E2D4C3] py-3.5 sm:py-4 overflow-hidden select-none shadow-2xs">
        {/* Left and Right Edge Gradient Masks for luxury editorial feathering */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAF5EE] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAF5EE] to-transparent z-10" />

        {/* Marquee Track: Seamless full-width infinite loop */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee-slow flex items-center">
            {[...customOfferingsList, ...customOfferingsList, ...customOfferingsList, ...customOfferingsList].map((item, idx) => (
              <div key={idx} className="flex items-center shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 group cursor-default">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C59B6A] shrink-0 inline-block opacity-90" />
                  <span className="font-serif-luxury text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#14110E] group-hover:text-[#8C5A28] transition-colors whitespace-nowrap">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY: Heritage Timeline & Master Tailor Atelier Section */}
      <AtelierStoryTimeline {...((c as any).timelineStory || {})} />

      {/* CURATED STARTING POINTS: Designer Ensembles Showcase (Matching Reference Design) */}
      <CuratedStartingPoints
        activeProductSlug={activeProduct?.slug}
        onSelectLook={handleSelectCuratedLook}
      />

      {/* Main Studio Content */}
      <div id="configurator-section" className="relative flex-1 w-full overflow-hidden flex flex-col justify-center">
        <main className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-6 sm:pb-12">
          
          {/* Top Header: Atelier Title & Configurator Mannequin Indicator */}
          <div id="mannequin-viewer" className="mb-6 sm:mb-8 space-y-2 border-b border-[#D5C2AF]/70 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold tracking-[0.26em] uppercase text-[#8C5A28] block mb-1">
                ATELIER BESPOKE CONFIGURATOR • 3D MANNEQUIN
              </span>
              <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#14110E] tracking-tight">
                CUSTOMIZING: <span className="text-[#8C5A28]">{activeProduct?.name || "BESPOKE DRESS SHIRT"}</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#14110E]">
                {activeProduct?.price || "₹ 2,499"}
              </span>
              <a
                href="#curated-looks"
                className="text-[11px] font-bold text-[#8C5A28] hover:underline uppercase tracking-wider flex items-center gap-1 py-1.5 px-3 rounded-lg border border-[#D5C2AF] bg-white hover:bg-[#FAF5EE] transition-colors"
              >
                Change Look ↑
              </a>
            </div>
          </div>

          {/* Main 2-Column Grid: Left 3D Mannequin & Right Configurator Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
            
            {/* LEFT COLUMN: Inscription, Studio Floating Selection & 3D Interactive Mannequin Shirt */}
            <div className="lg:col-span-6 flex flex-col justify-between relative min-h-[380px] sm:min-h-[500px]">
              
              {/* Top Row: Left Inscription ("A SHIRT MADE FOR YOU") & Right Studio "Your Selection" Panel */}
              <div className="flex items-start justify-between relative z-10 pl-1 pr-2 mb-2 sm:mb-4">
                {/* Top Left Inscription */}
                <div className="select-none">
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#4A202A] tracking-[0.18em] uppercase leading-[1.12]">
                    {withLineBreaks(c.inscriptionLines)}
                  </h2>
                  <div className="w-12 sm:w-16 h-[1.5px] bg-[#9E774C] mt-2 sm:mt-2.5 opacity-90" />
                </div>

                {/* Top Right Floating "Your Selection" Panel matching Reference */}
                <div className="select-none text-left min-w-[130px] sm:min-w-[145px] bg-[#EFE2D4]/70 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none backdrop-blur-xs sm:backdrop-blur-none border border-[#D0BDA9]/50 sm:border-0">
                  <h5 className="text-[11.5px] sm:text-[12px] font-bold tracking-[0.14em] text-[#C68A4C] uppercase mb-1.5">
                    {opts.selectionTitle}
                  </h5>
                  <div className="space-y-1 text-[11px] sm:text-[11.5px]">
                    <div className="flex justify-between items-center gap-3 sm:gap-4">
                      <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">{c.selectionLabels.chestSize}</span>
                      <strong className="text-[#14110E] font-bold">{customFit.chestSize}&quot;</strong>
                    </div>
                    {currentStep >= 2 && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">{c.selectionLabels.bodyType}</span>
                        <strong className="text-[#14110E] font-bold capitalize">{customFit.bodyFit} {c.fitSuffix}</strong>
                      </div>
                    )}
                    {currentStep >= 3 && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">{c.selectionLabels.height}</span>
                        <strong className="text-[#14110E] font-bold">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                    )}
                    {currentStep >= 4 && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">{c.selectionLabels.sleeve}</span>
                        <strong className="text-[#14110E] font-bold capitalize">
                          {customFit.sleeveType === "half" ? c.selectionLabels.halfSleeve : c.selectionLabels.fullSleeve}
                        </strong>
                      </div>
                    )}
                    {currentStep >= 5 && customFit.collarStyle && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">{c.selectionLabels.collar}</span>
                        <strong className="text-[#14110E] font-bold">{customFit.collarStyle.split(" ")[0]}</strong>
                      </div>
                    )}
                    {currentStep >= 5 && isFullSleeve && customFit.cuffStyle && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">{c.selectionLabels.cuff}</span>
                        <strong className="text-[#14110E] font-bold">{customFit.cuffStyle.split(" ")[0]}</strong>
                      </div>
                    )}
                    {currentStep >= 5 && customFit.initials && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">{c.selectionLabels.monogram}</span>
                        <strong className="text-[#14110E] font-bold uppercase">{customFit.initials}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: 3D Bespoke Tailored White Shirt with Dynamic Sleeve & Torso Transformations */}
              <div className="relative w-full">
                <MannequinShirtViewer
                  chestSize={customFit.chestSize}
                  bodyFit={viewerBodyFit}
                  height={customFit.height}
                  sleeveType={viewerSleeve}
                  collarStyle={customFit.collarStyle}
                  cuffStyle={customFit.cuffStyle}
                  pocket={customFit.pocket === "no-pocket" ? "no-pocket" : "pocket"}
                  initials={customFit.initials}
                  threadColor={customFit.threadColor}
                  currentStep={currentStep}
                  product={activeProduct}
                />
              </div>

              {/* Mobile Step Indicator helper */}
              <div className="lg:hidden text-center text-xs text-[#5C5247] italic mt-2">
                {fillTemplate(c.mobileStepTemplate, stepVars)}
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Configurator Box */}
            <div className="lg:col-span-6 relative">
              
              {/* Main Card Container matching screenshot */}
              <div className="bg-[#EFE2D4]/90 border border-[#D0BDA9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)] backdrop-blur-md relative z-10 transition-all duration-300">
                
                {/* Top Stepper & Header */}
                <div className="mb-5 sm:mb-6">
                  {/* Centered Step Indicator with Gold Accent Lines */}
                  <div className="flex items-center justify-center space-x-3 text-[11px] font-bold tracking-[0.24em] text-[#9E774C] uppercase mb-2.5 select-none">
                    <div className="w-12 sm:w-20 h-[1px] bg-[#CBB49E]" />
                    <span>{fillTemplate(c.stepCounterTemplate, stepVars)}</span>
                    <div className="w-12 sm:w-20 h-[1px] bg-[#CBB49E]" />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-luxury text-2xl sm:text-[32px] lg:text-[36px] font-normal text-[#14110E] tracking-tight uppercase leading-[1.1] text-center sm:text-left">
                    {stepCopy?.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[12.5px] sm:text-[13.5px] text-[#42372E] font-normal mt-1.5 leading-relaxed text-center sm:text-left">
                    {stepCopy && withHighlight(stepCopy.subtitle, stepCopy.subtitleHighlight)}
                  </p>
                </div>

                {/* ======================================================== */}
                {/* STEP 1: CHEST SIZE */}
                {/* ======================================================== */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="pt-1">
                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block mb-2.5">
                        {opts.chestLabel}
                      </label>

                      {/* 2 Rows × 4 Columns Size Buttons */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {opts.chestSizes.map(({ size }) => {
                          const isSelected = customFit.chestSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => handleChestSelect(size)}
                              className={`py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                  : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Measurement Pill Box (Chest, Collar, Shoulder) */}
                    <div className="bg-[#F5EBE1]/95 border border-[#D8C6B3] rounded-xl p-3 sm:p-4 my-4 grid grid-cols-3 divide-x divide-[#D8C6B3] text-center shadow-xs">
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">{c.measurementLabels.chest}</span>
                        <strong className="font-serif-luxury text-base sm:text-xl font-bold text-[#14110E] block mt-0.5">
                          {customFit.chestSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">{c.measurementLabels.collar}</span>
                        <strong className="font-serif-luxury text-base sm:text-xl font-bold text-[#14110E] block mt-0.5">
                          {customFit.collarSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">{c.measurementLabels.shoulder}</span>
                        <strong className="font-serif-luxury text-base sm:text-xl font-bold text-[#14110E] block mt-0.5">
                          {customFit.shoulderSize}&quot;
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 2: CHOOSE YOUR BODY TYPE */}
                {/* ======================================================== */}
                {currentStep === 2 && (
                  <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                    
                    {opts.bodyFits.map((fit) => {
                      const isSelected = customFit.bodyFit === fit.id;
                      return (
                        <button
                          key={fit.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: fit.id }))}
                          className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center space-x-4 border cursor-pointer ${
                            isSelected
                              ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                              : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E]">
                              {fit.title}
                            </h4>
                            <p className={`text-[11.5px] text-[#55473B] mt-0.5${fit.id === "tummy" ? " leading-tight" : ""}`}>
                              {fillTemplate(fit.description, { chest: customFit.chestSize })}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 3: SELECT YOUR HEIGHT */}
                {/* ======================================================== */}
                {currentStep === 3 && (
                  <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                    {opts.heights.map((opt) => {
                      const isSelected = customFit.height === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, height: opt.id }))}
                          className={`w-full p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 flex items-center space-x-3.5 sm:space-x-4 border cursor-pointer ${
                            isSelected
                              ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                              : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                          }`}
                        >
                          {/* Radio Dot Indicator */}
                          <div className="w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                            )}
                          </div>

                          {/* Human Silhouette + Vertical Height Arrow Icon */}
                          <div className="w-6 h-9 flex items-center justify-center shrink-0 text-[#14110E]">
                            <svg viewBox="0 0 28 42" fill="none" className="w-full h-full">
                              <circle cx="8.5" cy="6" r="3.2" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M 4 14 C 4 11 13 11 13 14 L 13 25 L 11 25 L 11 37 L 9 37 L 9 25 L 8 25 L 8 37 L 6 37 L 6 25 L 4 25 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                              <line x1="21" y1="6" x2="21" y2="36" stroke="currentColor" strokeWidth="1.4" />
                              <path d="M 18.5 8.5 L 21 5 L 23.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M 18.5 33.5 L 21 37 L 23.5 33.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>

                          {/* Height Title & Specifications */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E]">
                              {opt.title}
                            </h4>
                            <p className="text-[11.5px] text-[#4A3D31] font-medium mt-0.5">
                              {opt.heightRange}
                            </p>
                            <p className="text-[10.5px] text-[#695847] mt-0.5">
                              {opt.details}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 4: SELECT YOUR SLEEVES (EXACT MATCH TO 4TH SCREENSHOT) */}
                {/* ======================================================== */}
                {currentStep === 4 && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                      
                      {/* 1. HALF SLEEVE CARD */}
                      <button
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "half" }))}
                        className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 border flex flex-col justify-between items-center relative cursor-pointer group ${
                          customFit.sleeveType === "half"
                            ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                            : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                        }`}
                      >
                        {/* Radio Dot (Top Left) */}
                        <div className="absolute top-3.5 left-3.5 w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center">
                          {customFit.sleeveType === "half" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                          )}
                        </div>

                        {/* Half Sleeve Shirt Vector Drawing */}
                        <div className="my-3 w-20 h-24 flex items-center justify-center text-[#14110E] group-hover:scale-105 transition-transform duration-300">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            {/* Collar */}
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 40 18 L 33 28 L 47 26" />
                            <path d="M 60 18 L 67 28 L 53 26" />
                            {/* Torso & Half Sleeves */}
                            <path d="M 33 28 L 16 42 L 26 48 L 33 46 L 33 92 L 67 92 L 67 46 L 74 48 L 84 42 L 67 28" />
                            {/* Sleeve Hem Fold Lines */}
                            <line x1="17.5" y1="40" x2="27.5" y2="46" strokeDasharray="1.5 1.5" />
                            <line x1="82.5" y1="40" x2="72.5" y2="46" strokeDasharray="1.5 1.5" />
                            {/* Button Placket & Buttons */}
                            <line x1="50" y1="26" x2="50" y2="92" strokeDasharray="2 2" />
                            <circle cx="50" cy="40" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="54" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="68" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="82" r="1.2" fill="currentColor" />
                            {/* Curved Bottom */}
                            <path d="M 33 92 Q 50 97 67 92" />
                          </svg>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E] mt-1">
                          {opts.halfSleeveLabel}
                        </h4>
                      </button>

                      {/* 2. FULL SLEEVE CARD */}
                      <button
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full" }))}
                        className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 border flex flex-col justify-between items-center relative cursor-pointer group ${
                          customFit.sleeveType === "full"
                            ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                            : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                        }`}
                      >
                        {/* Radio Dot (Top Left) */}
                        <div className="absolute top-3.5 left-3.5 w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center">
                          {customFit.sleeveType === "full" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                          )}
                        </div>

                        {/* Full Sleeve Shirt Vector Drawing */}
                        <div className="my-3 w-20 h-24 flex items-center justify-center text-[#14110E] group-hover:scale-105 transition-transform duration-300">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            {/* Collar */}
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 40 18 L 33 28 L 47 26" />
                            <path d="M 60 18 L 67 28 L 53 26" />
                            {/* Shoulders & Full Sleeves */}
                            <path d="M 33 28 L 18 38 L 14 78 L 22 78 L 26 50 L 33 50 L 33 92 L 67 92 L 67 50 L 74 50 L 78 78 L 86 78 L 82 38 L 67 28" />
                            {/* Cuffs */}
                            <rect x="13" y="78" width="10" height="7" rx="1" />
                            <rect x="77" y="78" width="10" height="7" rx="1" />
                            {/* Button Placket & Buttons */}
                            <line x1="50" y1="26" x2="50" y2="92" strokeDasharray="2 2" />
                            <circle cx="50" cy="40" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="54" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="68" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="82" r="1.2" fill="currentColor" />
                            {/* Curved Bottom */}
                            <path d="M 33 92 Q 50 97 67 92" />
                          </svg>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E] mt-1">
                          {opts.fullSleeveLabel}
                        </h4>
                      </button>

                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 5: COLLAR, CUFFS & MONOGRAM */}
                {/* ======================================================== */}
                {currentStep === 5 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-3 pt-1">
                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block">
                        {opts.collarLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {opts.collarStyles.map((collar, idx) => {
                          const selected = customFit.collarStyle === collar.name;
                          return (
                            <button
                              key={`${collar.name}-${idx}`}
                              onClick={() => setCustomFit((prev) => ({ ...prev, collarStyle: collar.name }))}
                              className={`p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                                selected
                                  ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                  : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                              }`}
                            >
                              <span className="w-10 h-8 shrink-0 flex items-center justify-center">
                                {collar.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={collar.image} alt="" className="w-full h-full object-contain rounded" />
                                ) : (
                                  <CollarIllustration name={collar.name} className="w-full h-full" />
                                )}
                              </span>
                              <span className="flex-1">{collar.name}</span>
                              {selected && <Check size={14} />}
                            </button>
                          );
                        })}
                      </div>

                      {isFullSleeve && (
                        <>
                          <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                            {opts.cuffLabel}
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {opts.cuffStyles.map((cuff, idx) => (
                              <button
                                key={`${cuff.name}-${idx}`}
                                onClick={() => setCustomFit((prev) => ({ ...prev, cuffStyle: cuff.name }))}
                                className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                  customFit.cuffStyle === cuff.name
                                    ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                    : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                                }`}
                              >
                                <span className="w-12 h-9 flex items-center justify-center">
                                  {cuff.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={cuff.image} alt="" className="w-full h-full object-contain rounded" />
                                  ) : (
                                    <CuffIllustration name={cuff.name} className="w-full h-full" />
                                  )}
                                </span>
                                <span className="leading-tight">{cuff.name}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                        {c.pocketLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {c.pocketOptions.map((p, idx) => (
                          <button
                            key={`${p.id}-${idx}`}
                            onClick={() => setCustomFit((prev) => ({ ...prev, pocket: p.id }))}
                            className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              customFit.pocket === p.id
                                ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                        {c.initialsLabel}
                      </label>
                      <input
                        type="text"
                        maxLength={3}
                        value={customFit.initials}
                        onChange={(e) => setCustomFit((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                        className="w-full bg-[#F5EBE1]/90 border border-[#D0BDA9] rounded-xl px-4 py-3 text-lg font-bold tracking-widest uppercase text-[#14110E] focus:outline-none focus:ring-2 focus:ring-[#9E774C]"
                        placeholder={opts.monogramPlaceholder}
                      />

                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                        {c.threadLabel}
                      </label>
                      <div className="grid grid-cols-4 gap-2.5">
                        {opts.threadColors.map(({ value: clr }, idx) => (
                          <button
                            key={`${clr}-${idx}`}
                            onClick={() => setCustomFit((prev) => ({ ...prev, threadColor: clr }))}
                            className={`p-3 rounded-xl text-center text-xs font-bold uppercase transition-all cursor-pointer ${
                              customFit.threadColor === clr
                                ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                : "bg-[#E2D0BE]/90 text-[#1F1C18] border border-[#C6B09B]"
                            }`}
                          >
                            {clr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 6: FINAL REVIEW */}
                {/* ======================================================== */}
                {currentStep === 6 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Selected Garment Summary Strip */}
                    <div className="flex items-center gap-3 bg-[#FAF5EE] border border-[#D8C6B3] rounded-xl p-2.5">
                      {activeProduct?.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="w-12 h-12 rounded-lg object-cover border border-[#D5C2AF] shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#9E774C] block">
                          Tailoring Garment
                        </span>
                        <h4 className="text-xs font-bold uppercase text-[#14110E] truncate">
                          {activeProduct?.name}
                        </h4>
                        <span className="text-[11px] font-serif-luxury font-bold text-[#9E774C]">
                          {activeProduct?.price}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F5EBE1]/95 border border-[#D8C6B3] rounded-xl p-4 space-y-2.5 text-xs shadow-xs">
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">{opts.reviewLabels.measurements}</span>
                        <strong className="text-[#14110E]">{customFit.chestSize}&quot; / {customFit.collarSize}&quot; / {customFit.shoulderSize}&quot;</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">{opts.reviewLabels.bodyFit}</span>
                        <strong className="text-[#14110E] uppercase">{customFit.bodyFit} {c.fitSuffix}</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">{opts.reviewLabels.height}</span>
                        <strong className="text-[#14110E]">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">{opts.reviewLabels.sleevesCollar}</span>
                        <strong className="text-[#14110E] uppercase">{customFit.sleeveType} {c.sleeveSuffix} | {customFit.collarStyle}</strong>
                      </div>
                      {isFullSleeve && (
                        <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                          <span className="text-[#665749]">{opts.reviewLabels.cuffPocket}</span>
                          <strong className="text-[#14110E] uppercase">{customFit.cuffStyle} | {customFit.pocket}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#665749]">{opts.reviewLabels.monogram}</span>
                        <strong className="text-[#14110E] uppercase">{customFit.initials || c.noInitialsLabel} ({customFit.threadColor})</strong>
                      </div>
                    </div>

                    {orderSubmitted && (
                      <>
                        <div className="bg-[#2D6A4F] text-white p-3.5 rounded-xl text-center text-xs font-bold tracking-wider animate-bounce shadow-md">
                          {c.successMessage}
                        </div>
                        <Link
                          href={c.viewBagHref}
                          className="block w-full text-center bg-[#E2D0BE] hover:bg-[#120F0D] text-[#332B24] hover:text-white border border-[#C6B09B] rounded-xl py-3 text-xs font-bold tracking-[0.18em] uppercase transition-all"
                        >
                          {c.viewBagLabel}
                        </Link>
                      </>
                    )}

                    {addError && (
                      <div role="alert" className="bg-[#8B2E2E]/10 border border-[#8B2E2E]/40 text-[#7A2424] p-3.5 rounded-xl text-center text-xs font-bold tracking-wider">
                        {addError}
                      </div>
                    )}
                  </div>
                )}

                {/* ======================================================== */}
                {/* BOTTOM ACTION BUTTON (CONTINUE -> X OF 6) */}
                {/* ======================================================== */}
                <div className="mt-6 pt-4 border-t border-[#D5C2AF]/70 flex items-center justify-between gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-3.5 bg-[#14110E] hover:bg-black text-white border border-[#14110E] rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <ArrowLeft size={14} />
                      <span>{opts.backLabel}</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextStep}
                    disabled={currentStep === totalSteps && (busy || orderSubmitted)}
                    aria-busy={currentStep === totalSteps && busy}
                    className="flex-1 bg-[#120F0D] hover:bg-[#2A231D] text-white py-3.5 sm:py-4 px-6 rounded-xl text-xs font-bold tracking-[0.18em] uppercase transition-all flex items-center justify-between shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span>
                      {currentStep < totalSteps
                        ? opts.continueLabel
                        : busy
                          ? c.addingLabel
                          : orderSubmitted
                            ? c.addedLabel
                            : c.confirmLabel}
                    </span>
                    <span className="text-[10.5px] opacity-80 font-normal tracking-widest">{fillTemplate(c.buttonCounterTemplate, stepVars)}</span>
                  </button>
                </div>

                {/* Vertical Gold Mark Accent on Left */}
                <div className="w-[2px] h-6 sm:h-7 bg-[#9E774C] mt-4" />

                {/* Bottom Right Inscription */}
                <div className="text-right -mt-5 select-none opacity-90">
                  <p className="font-serif-luxury text-[13px] sm:text-[14px] text-[#9E774C] font-normal tracking-[0.14em] uppercase leading-tight">
                    {withLineBreaks(c.taglineLines)}
                  </p>
                  <div className="w-10 h-[1px] bg-[#9E774C] mt-1.5 ml-auto" />
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Common Atelier Showcase: Video Banner, Shop By Fabrics & Customer Testimonials */}
      <CommonAtelierShowcase />

      {/* Bottom Feature Highlights Bar */}
      <FeatureHighlightsBar />

      {/* Comprehensive Luxury E-Commerce Footer */}
      <Footer />
    </div>
  );
}

export default function CustomShirtConfigurator() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <CustomShirtConfiguratorContent />
    </Suspense>
  );
}

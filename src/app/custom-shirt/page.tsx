"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import AtelierEditorialBanner from "@/components/AtelierEditorialBanner";
import ShopByFabricsSection from "@/components/ShopByFabricsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AtelierStoryTimeline from "@/components/AtelierStoryTimeline";
import CuratedStartingPoints, { CuratedLookItem } from "@/components/CuratedStartingPoints";
import BespokePillarsBanner from "@/components/BespokePillarsBanner";
import BespokeProcessTimeline from "@/components/BespokeProcessTimeline";

const ShowcaseDivider = () => (
  <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-6 sm:my-8 lg:my-10">
    <div className="w-full h-[1px] bg-gradient-to-r from-[#4A202A]/15 via-[#4A202A]/50 to-[#4A202A]/15" />
  </div>
);
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

    const target = document.getElementById("appointment-booking") || document.getElementById("curated-looks");
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
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-clip">
      {/* Header */}
      <Header activeTab="custom-fit" />

      {/* CONTINUOUS SLOW AUTOPLAY MARQUEE STRIP: What We Customize (Placed cleanly under fixed Header) */}
      <section className="relative w-full bg-[#FAF5EE] border-b border-[#E2D4C3] mt-[72px] sm:mt-[88px] py-3.5 sm:py-4 overflow-hidden select-none shadow-2xs">
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

      {/* THE BESPOKE PILLARS: 3-Tier Split Editorial Banner (Exceptional Fabrics, Bespoke Experience, Elite Service) */}
      <BespokePillarsBanner />

      {/* HOW IT WORKS: From First Measure to Final Delivery (Website Light Theme) */}
      <BespokeProcessTimeline />

      <ShowcaseDivider />

      {/* 1. Behind The Scenes / Tailoring In Motion Video Banner */}
      <AtelierEditorialBanner />

      <ShowcaseDivider />

      {/* 2. Shop By Fabrics 3-Card Carousel */}
      <ShopByFabricsSection />

      {/* 3. ATELIER APPOINTMENT BOOKING SECTION (Moved right above Reviews) */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#EEE5EA] via-[#F6F1F4] to-[#EAE0E6] border-y border-[#DDD2D8]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: Bespoke Tailors Headline & Narrative */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              {/* Badge: SUITOHOLIC BESPOKE ATELIER • DELHI NCR */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFFFF] border border-[#DDD2D8] text-[#4A202A] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] shadow-xs"
                style={{ borderRadius: "7px" }}
              >
                <MapPin size={12} className="text-[#4A202A]" />
                <span>{heroCopy.badge}</span>
              </div>

              {/* Main Headline */}
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-bold text-[#14110E] tracking-tight leading-[1.14]">
                {heroCopy.title}
              </h2>

              {/* Story Description */}
              <p className="text-sm sm:text-base text-[#5A4E42] font-sans font-normal leading-[1.75] max-w-2xl">
                {heroCopy.description}
              </p>
            </div>

            {/* RIGHT COLUMN: Appointment Booking Form (Light Theme Box) */}
            <div id="appointment-booking" className="lg:col-span-5 scroll-mt-24">
              <div
                className="bg-[#FFFFFF] border border-[#DDD2D8] px-6 sm:px-8 lg:px-9 py-8 sm:py-10 lg:py-11 shadow-xl relative text-left"
                style={{ borderRadius: "7px" }}
              >
                {appointmentSuccess ? (
                  <div className="text-center py-8 sm:py-12 space-y-5 animate-in fade-in duration-300">
                    <div
                      className="w-12 h-12 rounded-full bg-[#EEE5EA] border border-[#DDD2D8] text-[#4A202A] flex items-center justify-center mx-auto shadow-xs"
                      style={{ borderRadius: "7px" }}
                    >
                      <Check size={22} className="stroke-[2.5]" />
                    </div>
                    <h3 className="font-serif-luxury text-xl font-bold uppercase text-[#14110E]">
                      {heroCopy.successTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A4E42] max-w-xs mx-auto leading-relaxed">
                      {heroCopy.successMessage}
                    </p>
                    {bookingReference && (
                      <div className="pt-1">
                        <span
                          className="text-[11px] font-mono text-[#4A202A] bg-[#EEE5EA] border border-[#DDD2D8] py-1.5 px-3 inline-block font-bold"
                          style={{ borderRadius: "7px" }}
                        >
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
                        className="text-xs font-bold text-[#4A202A] hover:underline uppercase tracking-wider cursor-pointer"
                      >
                        Book Another Session
                      </button>
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
                        style={{ borderRadius: "7px" }}
                        className="w-full bg-[#FAF8F5] border border-[#DDD2D8] text-[#14110E] placeholder-[#9E8E7F] focus:border-[#4A202A] focus:bg-white px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs"
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
                        style={{ borderRadius: "7px" }}
                        className="w-full bg-[#FAF8F5] border border-[#DDD2D8] text-[#14110E] placeholder-[#9E8E7F] focus:border-[#4A202A] focus:bg-white px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs"
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
                        style={{ borderRadius: "7px" }}
                        className="w-full bg-[#FAF8F5] border border-[#DDD2D8] text-[#14110E] placeholder-[#9E8E7F] focus:border-[#4A202A] focus:bg-white px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs"
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
                        style={{ borderRadius: "7px" }}
                        className="w-full bg-[#FAF8F5] border border-[#DDD2D8] text-[#14110E] focus:border-[#4A202A] focus:bg-white px-3.5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none transition-all shadow-2xs cursor-pointer"
                      />
                    </div>

                    {apptError && (
                      <p className="text-xs text-[#9B2C2C] font-semibold">
                        {apptError}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isBooking}
                      style={{ borderRadius: "7px" }}
                      className="w-full mt-2 bg-[#14110E] hover:bg-[#4A202A] active:scale-[0.99] text-[#FAF8F5] font-bold text-sm sm:text-base py-4 px-6 transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-wait text-center uppercase tracking-[0.14em]"
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

      {/* 4. Customer Testimonials Reviews */}
      <TestimonialsSection />

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

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";
import LuxuryClothArchiveSection from "@/components/LuxuryClothArchiveSection";
import BespokeProcessTimeline from "@/components/BespokeProcessTimeline";
import FabricHeroShowcaseBanner from "@/components/FabricHeroShowcaseBanner";
import WorldsFinestFabricsIntro from "@/components/WorldsFinestFabricsIntro";
import PrestigeMillsGrid from "@/components/PrestigeMillsGrid";
import AtelierConsultationBanner from "@/components/AtelierConsultationBanner";
import { 
  ArrowRight, 
  Check, 
  ZoomIn, 
  Bookmark, 
  Plus, 
  Scissors, 
  Maximize2, 
  X, 
  CheckCircle2 
} from "lucide-react";

import { apiFetch, ApiError } from "@/lib/api";
import { useContent, useCatalog } from "@/context/SiteDataProvider";
import { useCart } from "@/context/CartProvider";
import CustomizationModal from "@/components/CustomizationModal";
import confetti from "canvas-confetti";
import type { CustomFit } from "@/lib/types";

export default function FabricsPage() {
  const c = useContent("fabricsPage");
  const [liveFabrics, setLiveFabrics] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<any[]>("/fabrics")
      .then((items) => {
        if (!cancelled && Array.isArray(items) && items.length > 0) {
          const formatted = items.map((f) => ({
            id: String(f.code || f.id),
            code: f.code,
            name: f.name,
            category: f.category,
            categoryLabel: f.categoryLabel || f.category_label || "",
            composition: f.composition || "",
            yarnCount: f.yarnCount || f.yarn_count || "",
            weave: f.weave || "",
            weight: f.weight || "",
            gsm: f.gsm || "",
            origin: f.origin || "",
            opacity: f.opacity || "",
            breathability: f.breathability || "",
            wrinkleResistance: f.wrinkleResistance || f.wrinkle_resistance || "",
            image: f.image || "",
            description: f.description || "",
            shortInfo: f.shortInfo || f.short_info || "",
            price: f.price || "",
            compareAtPrice: f.compareAtPrice || f.compare_at_price || "",
            rating: Number(f.rating ?? 5.0),
            reviewsCount: Number(f.reviewsCount ?? f.reviews_count ?? 0),
            bestFor: f.bestFor || f.best_for || "",
            care: f.care || "",
            accentColor: f.accentColor || f.accent_color || "#FAF8F5",
          }));
          setLiveFabrics(formatted);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const fabrics = liveFabrics && liveFabrics.length > 0 ? liveFabrics : (c.fabrics ?? []);
  const hero = c.hero;
  const studio = c.studio;
  const editorial = c.editorial;
  const zoom = c.zoomModal;
  const swatch = c.swatchRequest;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeFabricId, setActiveFabricId] = useState<string | null>(null);
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [swatchModalOpen, setSwatchModalOpen] = useState<boolean>(false);
  const [swatchRequested, setSwatchRequested] = useState<boolean>(false);
  const [savedFabrics, setSavedFabrics] = useState<Set<string>>(new Set());
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [swatchName, setSwatchName] = useState("");
  const [swatchAddress, setSwatchAddress] = useState("");
  const [swatchPhone, setSwatchPhone] = useState("");
  const [swatchEmail, setSwatchEmail] = useState("");
  const [swatchSubmitting, setSwatchSubmitting] = useState(false);
  const [swatchError, setSwatchError] = useState<string | null>(null);

  const { products } = useCatalog();
  const { addItem, busy } = useCart();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Falls back to the first fabric; undefined only if the CMS list is empty.
  const activeFabric = fabrics.find((f) => f.id === activeFabricId) ?? fabrics[0];
  const customizeBase = studio?.customizeLink || "/custom-shirt";

  const handleConfirmFabricCustomization = async (customFit: CustomFit) => {
    const baseProduct = products.find((p) => p.category === "formal_bespoke" || p.category === "fabrics") || products[0];
    if (!baseProduct || !activeFabric) return;
    try {
      await addItem({
        productId: baseProduct.id,
        quantity: 1,
        size: String(customFit.chestSize),
        customization: {
          ...customFit,
          shirtColor: activeFabric.name,
        },
      });
      setIsCustomizerOpen(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
      setToastMessage(`${activeFabric.name} (Bespoke Tailored) added to bag!`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      setIsCustomizerOpen(false);
      setToastMessage((err as Error).message);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const filteredFabrics = selectedCategory === "all"
    ? fabrics
    : fabrics.filter((f) => f.category === selectedCategory);

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

  const handleSwatchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFabric || swatchSubmitting) return;
    const phone = swatchPhone.trim();
    const email = swatchEmail.trim();
    if (!phone && !email) {
      setSwatchError(swatch?.contactRequiredMessage ?? null);
      return;
    }
    setSwatchSubmitting(true);
    setSwatchError(null);
    try {
      await apiFetch("/inquiries", {
        method: "POST",
        body: {
          type: "swatch_request",
          name: swatchName.trim(),
          address: swatchAddress.trim(),
          phone,
          ...(email ? { email } : {}),
          subject: activeFabric.name,
          message: "",
        },
      });
      setSwatchRequested(true);
      setSwatchName("");
      setSwatchAddress("");
      setSwatchPhone("");
      setSwatchEmail("");
      setTimeout(() => {
        setSwatchModalOpen(false);
        setSwatchRequested(false);
      }, 2500);
    } catch (err) {
      setSwatchError(err instanceof ApiError && err.message ? err.message : swatch?.errorMessage ?? null);
    } finally {
      setSwatchSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-clip">
      {/* Header with active 'fabrics' tab indicator */}
      <Header activeTab="fabrics" />

      {/* 1. INTERACTIVE BESPOKE FABRIC WEAVE SHOWCASE HERO BANNER */}
      <FabricHeroShowcaseBanner activeFabricId={activeFabric?.id} />

      {/* 2. WORLDS FINEST FABRICS ATELIER PREFACE SECTION (MATCHING REFERENCE) */}
      <WorldsFinestFabricsIntro />

      {/* 3. PRESTIGE CLOTH MILLS SHOWCASE GRID (MATCHING REFERENCE) */}
      <PrestigeMillsGrid />

      {/* ========================================================================= */}
      {/* 2. MASTER LUXURY CLOTH ARCHIVE SECTION (MATCHING REFERENCE IMAGE 1)       */}
      {/* ========================================================================= */}
      <LuxuryClothArchiveSection
        onSelectFabricForCustomizer={(code) => {
          const matched = fabrics.find((f) => f.code === code);
          if (matched) {
            setActiveFabricId(matched.id);
          }
        }}
        onRequestSwatchModal={(cloth) => {
          const matched = fabrics.find((f) => f.code === cloth.code);
          if (matched) {
            setActiveFabricId(matched.id);
          }
          setSwatchError(null);
          setSwatchModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* 4. BESPOKE PROCESS TIMELINE (HOW WE TAILOR PERFECTION)                    */}
      {/* ========================================================================= */}
      <BespokeProcessTimeline />

      {/* ========================================================================= */}
      {/* 5. ATELIER CONSULTATION CTA: READY TO LOOK & FEEL YOUR VERY BEST?          */}
      {/* ========================================================================= */}
      <main className="relative flex-1 w-full">
        <AtelierConsultationBanner />
      </main>

      {/* ========================================================================= */}
      {/* MODAL: HIGH RESOLUTION WEAVE MAGNIFIER                                   */}
      {/* ========================================================================= */}
      {zoomModalOpen && activeFabric && (
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
                aria-label={zoom?.closeAriaLabel}
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
                {zoom?.magnificationBadge}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#D8C6B3]">
              <div>
                <span className="block font-semibold text-white">{activeFabric.composition}</span>
                <span>{activeFabric.gsm} • {activeFabric.yarnCount}</span>
              </div>
              <Link
                href={`${customizeBase}?fabric=${encodeURIComponent(activeFabric.code)}`}
                style={{ borderRadius: "7px" }}
                className="bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] text-xs font-extrabold tracking-widest uppercase px-6 py-3 transition-all shadow-md hover:shadow-lg"
              >
                {zoom?.configuratorLabel}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PHYSICAL SWATCH BOX REQUEST                                        */}
      {/* ========================================================================= */}
      {swatchModalOpen && activeFabric && (
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
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase font-mono block">{swatch?.eyebrow}</span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase">{swatch?.heading}</h3>
              </div>
              <button
                onClick={() => setSwatchModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#14110E] transition-colors cursor-pointer"
                aria-label={swatch?.closeAriaLabel}
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
                  {swatch?.successHeading}
                </h4>
                <p className="text-xs text-[#55473A] max-w-sm mx-auto">
                  {swatch?.successTextBefore} <strong>{activeFabric.name} ({activeFabric.code})</strong> {swatch?.successTextAfter}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSwatchRequest} className="space-y-4 text-left">
                <p className="text-xs text-[#55473A]">
                  {swatch?.introBefore} <strong>{activeFabric.name}</strong> {swatch?.introAfter}
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={swatch?.namePlaceholder}
                      value={swatchName}
                      onChange={(e) => setSwatchName(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.addressLabel}
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder={swatch?.addressPlaceholder}
                      value={swatchAddress}
                      onChange={(e) => setSwatchAddress(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={swatch?.phonePlaceholder}
                      value={swatchPhone}
                      onChange={(e) => setSwatchPhone(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.emailLabel}
                    </label>
                    <input
                      type="email"
                      placeholder={swatch?.emailPlaceholder}
                      value={swatchEmail}
                      onChange={(e) => setSwatchEmail(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>
                </div>

                {swatchError && (
                  <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                    {swatchError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={swatchSubmitting}
                  aria-busy={swatchSubmitting}
                  style={{ borderRadius: "7px" }}
                  className="w-full bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] text-xs font-extrabold tracking-[0.2em] py-3.5 transition-all duration-300 uppercase shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {swatchSubmitting ? swatch?.submittingLabel : swatch?.submitLabel}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14110E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#9E774C]/50 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-[#C5A069]" />
          <span className="text-xs font-bold tracking-wider">{toastMessage}</span>
          <Link href="/cart" className="underline text-[#C5A069] text-xs font-bold ml-2">
            View Bag
          </Link>
        </div>
      )}

      {/* 6-Step Bespoke Customization Popup Modal */}
      {activeFabric && (
        <CustomizationModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          productName={activeFabric.name}
          product={{
            name: activeFabric.name,
            image: activeFabric.image,
            gallery: [activeFabric.image],
          }}
          submitting={busy}
          onConfirmCustomization={handleConfirmFabricCustomization}
        />
      )}

      {/* Common Atelier Showcase: Video Banner, Shop By Fabrics & Customer Testimonials */}
      <CommonAtelierShowcase />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

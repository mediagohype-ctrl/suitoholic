"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import CustomizationModal, {
  CustomFitState,
  CustomizationModalProduct,
} from "@/components/CustomizationModal";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import { useCart } from "@/context/CartProvider";
import { useCatalog } from "@/context/SiteDataProvider";
import confetti from "canvas-confetti";
import type { ProductItem, CustomFit } from "@/lib/types";
import { X, ArrowRight, Scissors, Plus, RefreshCw } from "lucide-react";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";

interface CustomizerContextType {
  openCustomizer: (product: ProductItem | CustomizationModalProduct, forceStep1?: boolean) => void;
  closeCustomizer: () => void;
  isCustomizerOpen: boolean;
}

const CustomizerContext = createContext<CustomizerContextType>({
  openCustomizer: () => {},
  closeCustomizer: () => {},
  isCustomizerOpen: false,
});

export const useCustomizer = () => useContext(CustomizerContext);

export function CustomizerModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<CustomizationModalProduct | ProductItem | null>(null);
  const [choiceProduct, setChoiceProduct] = useState<ProductItem | CustomizationModalProduct | null>(null);
  const [addingChoice, setAddingChoice] = useState(false);
  const { products } = useCatalog();
  const { cart, addItem, busy } = useCart();

  const customizedItem = cart?.items?.find((i) => i.customization != null);

  const openCustomizer = useCallback(
    (prod: ProductItem | CustomizationModalProduct, forceStep1 = false) => {
      const hasExistingFit = cart?.items?.some((i) => i.customization != null);
      if (!forceStep1 && hasExistingFit) {
        setChoiceProduct(prod);
      } else {
        setActiveProduct(prod);
        setIsOpen(true);
      }
    },
    [cart?.items]
  );

  const closeCustomizer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAddWithCurrentSelection = async (prod: ProductItem | CustomizationModalProduct) => {
    const existingCustomItem = cart?.items?.find((i) => i.customization != null);
    const fitToApply: Partial<CustomFit> = existingCustomItem?.customization || {
      chestSize: 38,
      collarSize: 15,
      shoulderSize: 17.5,
      bodyFit: "lean",
      height: "tall",
      sleeveType: "full",
      collarStyle: "Cutaway Collar",
      cuffStyle: "Classic Cuff",
      pocket: "none",
      initials: "AK",
      threadColor: "black",
      shirtColor: prod.name,
    };

    try {
      setAddingChoice(true);
      await addItem({
        productId: Number(prod.id) || 1,
        quantity: 1,
        size: String(fitToApply.chestSize || 38),
        customization: {
          ...fitToApply,
          shirtColor: prod.name,
        },
      });
      setChoiceProduct(null);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Failed to add shirt with current bespoke fit:", err);
    } finally {
      setAddingChoice(false);
    }
  };

  const handleStartStep1 = (prod: ProductItem | CustomizationModalProduct) => {
    setChoiceProduct(null);
    setActiveProduct(prod);
    setIsOpen(true);
  };

  const handleConfirmCustomization = useCallback(
    async (customFit: CustomFitState, chosenProduct?: CustomizationModalProduct | ProductItem | null) => {
      const targetProduct =
        chosenProduct && chosenProduct.id
          ? products.find((p) => p.id === chosenProduct.id) || activeProduct
          : activeProduct;

      if (targetProduct && targetProduct.id) {
        try {
          await addItem({
            productId: Number(targetProduct.id) || 1,
            quantity: 1,
            size: String(customFit.chestSize),
            customization: customFit,
          });
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.7 },
          });
        } catch (err) {
          console.error("Failed to add customized item to bag:", err);
        }
      }
      setIsOpen(false);
    },
    [activeProduct, addItem, products]
  );

  const getProductImage = (p: ProductItem | CustomizationModalProduct) => {
    if ("gallery" in p && p.gallery && p.gallery.length > 0 && p.gallery[0]) {
      return p.gallery[0];
    }
    const full = getMatchingFullShirtImage(p as ProductItem);
    return full || (p as ProductItem).image || "/shirt_classic_white.jpg";
  };

  return (
    <CustomizerContext.Provider value={{ openCustomizer, closeCustomizer, isCustomizerOpen: isOpen }}>
      {children}

      {/* GLOBAL 2-OPTION TAILORING CHOICE POPUP MODAL (When user already has a saved bespoke fit) */}
      {choiceProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white border border-[#E5E3DD] rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setChoiceProduct(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F5F4F0] hover:bg-black text-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header With Product Info */}
            <div className="flex items-center gap-4 border-b border-[#E5E3DD] pb-5 pr-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#ECEAE5] border border-[#E5E3DD] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProductImage(choiceProduct)}
                  alt={choiceProduct.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#666666] uppercase block">
                  Add To Your Bag
                </span>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-black uppercase leading-tight truncate">
                  {choiceProduct.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {"price" in choiceProduct && choiceProduct.price && (
                    <span className="text-xs font-extrabold text-black">{choiceProduct.price}</span>
                  )}
                  {"fabric" in choiceProduct && choiceProduct.fabric && (
                    <span className="text-[11px] text-[#888888]">• {choiceProduct.fabric}</span>
                  )}
                </div>
              </div>
            </div>

            {/* The 2 Tailoring Options */}
            <div className="mt-5 space-y-3.5">
              <p className="text-xs font-semibold text-[#555555]">
                How would you like to tailor this shirt? Please select your preference:
              </p>

              {/* OPTION 1: Add With Current Customization (Direct To Bag) */}
              <div
                onClick={() => handleAddWithCurrentSelection(choiceProduct)}
                className="group relative p-4 sm:p-5 rounded-2xl border-2 border-black bg-[#F5F4F0] hover:bg-[#ECEAE5] transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="inline-block bg-black text-white text-[9px] font-bold uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full mb-1.5">
                      Option 1 • Current Selection
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide">
                      Add With Current Selection (Bespoke Fit)
                    </h4>
                  </div>
                  <ArrowRight size={18} className="text-black group-hover:translate-x-1 transition-transform mt-0.5 shrink-0" />
                </div>

                <p className="text-[11px] text-[#666666] mb-3">
                  Instantly apply your bag&apos;s saved bespoke measurements &amp; styling directly to this shirt:
                </p>

                {/* Live Current Fit Summary */}
                {customizedItem?.customization && (
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#E5E3DD]">
                    <CustomizationDetails customization={customizedItem.customization} />
                  </div>
                )}

                <button
                  type="button"
                  disabled={addingChoice}
                  className="mt-3.5 w-full bg-black hover:bg-neutral-800 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {addingChoice ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Adding to Bag...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="stroke-[2.5]" />
                      <span>Add With Current Selection (Direct To Bag)</span>
                    </>
                  )}
                </button>
              </div>

              {/* OPTION 2: New Customization (Start from Step 1) */}
              <div
                onClick={() => handleStartStep1(choiceProduct)}
                className="group relative p-4 sm:p-5 rounded-2xl border border-[#E5E3DD] hover:border-black bg-white hover:bg-[#F5F4F0]/60 transition-all cursor-pointer shadow-xs hover:shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="space-y-1">
                    <span className="inline-block bg-[#E5E3DD] text-black text-[9px] font-bold uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full mb-1">
                      Option 2 • Start From Step 1
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#ECEAE5] group-hover:bg-black text-black group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <Scissors size={14} />
                      </div>
                      <h4 className="text-sm font-bold text-black uppercase tracking-wide">
                        Customize A New Fit (Start From Step 1)
                      </h4>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#888888] group-hover:text-black group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                </div>

                <p className="text-[11px] text-[#666666] mb-3">
                  Start fresh in the 3D customizer from Step 1 to select custom chest size, body fit, height, sleeve, collar, cuff &amp; initials.
                </p>

                <button
                  type="button"
                  className="w-full bg-[#F5F4F0] group-hover:bg-black text-black group-hover:text-white border border-[#E5E3DD] group-hover:border-black py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Scissors size={13} />
                  <span>Start Step 1 Customization</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6-STEP BESPOKE CUSTOMIZATION MODAL */}
      {isOpen && activeProduct && (
        <CustomizationModal
          isOpen={isOpen}
          onClose={closeCustomizer}
          product={activeProduct}
          productName={activeProduct.name}
          submitting={busy}
          onConfirmCustomization={handleConfirmCustomization}
        />
      )}
    </CustomizerContext.Provider>
  );
}


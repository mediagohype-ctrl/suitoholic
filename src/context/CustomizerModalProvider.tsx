"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import CustomizationModal, {
  CustomFitState,
  CustomizationModalProduct,
} from "@/components/CustomizationModal";
import { useCart } from "@/context/CartProvider";
import { useCatalog } from "@/context/SiteDataProvider";
import confetti from "canvas-confetti";
import type { ProductItem } from "@/lib/types";

interface CustomizerContextType {
  openCustomizer: (product: ProductItem | CustomizationModalProduct) => void;
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
  const { products } = useCatalog();
  const { addItem, busy } = useCart();

  const openCustomizer = useCallback((prod: ProductItem | CustomizationModalProduct) => {
    setActiveProduct(prod);
    setIsOpen(true);
  }, []);

  const closeCustomizer = useCallback(() => {
    setIsOpen(false);
  }, []);

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

  return (
    <CustomizerContext.Provider value={{ openCustomizer, closeCustomizer, isCustomizerOpen: isOpen }}>
      {children}
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


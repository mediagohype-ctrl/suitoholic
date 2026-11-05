"use client";

import React from "react";
import ModernCollectionSection from "@/components/ModernCollectionSection";
import { useCatalog } from "@/context/SiteDataProvider";

export default function ShopByFabricsSection() {
  const { products, homeCollections } = useCatalog();

  const fabricCollection =
    homeCollections.find(
      (c) =>
        c.id === "formal_bespoke" ||
        c.id === "fabrics" ||
        (c.title && c.title.toLowerCase().includes("fabric"))
    ) || {
      id: "formal_bespoke",
      title: "SHOP BY FABRICS",
      subtitle: "Explore our curated bespoke luxury fabrics.",
      tag: "FABRICS",
      bgImage: "/new_shirts/shirt_19.jpg",
    };

  // Curate all bespoke fabric shirts across the atelier catalog
  let fabricProducts = products.filter(
    (p) =>
      p.category === "formal_bespoke" ||
      p.category === "fabrics" ||
      p.category === "formal_stripes" ||
      p.category === "formal_shirts"
  );

  if (fabricProducts.length === 0) {
    fabricProducts = products;
  }

  // Strictly only 8 images for the Shop by Fabrics section
  const displayFabrics = fabricProducts.slice(0, 8);

  return (
    <ModernCollectionSection
      collection={fabricCollection}
      products={displayFabrics}
      headerTitle="SHOP BY FABRICS"
      cardsPerView={3}
    />
  );
}

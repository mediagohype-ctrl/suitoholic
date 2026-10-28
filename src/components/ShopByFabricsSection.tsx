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
      bgImage: "/new_shirts/shirt_18.jpg",
    };

  const fabricProducts = products.filter(
    (p) => p.category === "formal_bespoke" || p.category === "fabrics"
  );

  return (
    <ModernCollectionSection
      collection={fabricCollection}
      products={fabricProducts}
      headerTitle="SHOP BY FABRICS"
      cardsPerView={3}
    />
  );
}

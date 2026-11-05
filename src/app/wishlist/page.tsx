"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import ModernProductCard from "@/components/ModernProductCard";
import { useWishlist } from "@/context/WishlistProvider";
import { useCatalog } from "@/context/SiteDataProvider";
import { allProducts, ProductItem } from "@/data/products";
import { DEFAULT_LOOKS } from "@/components/CuratedStartingPoints";
import { LUXURY_CLOTH_ITEMS } from "@/components/LuxuryClothArchiveSection";

export default function WishlistPage() {
  const { wishlistIds, clearWishlist } = useWishlist();
  const { products } = useCatalog();

  // Resolve all saved items against catalog, allProducts, curated looks, and luxury cloth items
  const savedProducts: ProductItem[] = useMemo(() => {
    const productMap = new Map<string, ProductItem>();

    // 1. Static allProducts
    allProducts.forEach((p) => {
      productMap.set(String(p.id), p);
      if (p.slug) productMap.set(p.slug.toLowerCase(), p);
    });

    // 2. Dynamic backend catalog products
    (products || []).forEach((p) => {
      productMap.set(String(p.id), p);
      if (p.slug) productMap.set(p.slug.toLowerCase(), p);
    });

    // 3. Curated starting points fallback
    DEFAULT_LOOKS.forEach((look, index) => {
      const p: ProductItem = {
        id: 1000 + index,
        slug: look.slug,
        name: look.title,
        category: "formal_bespoke",
        price: look.price,
        rawPrice: 2600,
        subtitle: look.subtitle,
        description: look.subtitle,
        fabric: look.subtitle || "Italian Luxury Cotton",
        threadCount: "140s",
        rating: 5,
        reviewsCount: 18,
        image: look.image,
        gallery: look.hoverImage ? [look.image, look.hoverImage] : [look.image],
      };
      productMap.set(String(look.id), p);
      productMap.set(look.slug.toLowerCase(), p);
    });

    // 4. Luxury cloth archive swatches fallback
    LUXURY_CLOTH_ITEMS.forEach((cloth, index) => {
      const p: ProductItem = {
        id: 2000 + index,
        slug: cloth.id,
        name: `${cloth.mill} ${cloth.code} Swatch`,
        category: "fabrics",
        price: cloth.formattedPrice,
        rawPrice: cloth.pricePerMetre,
        subtitle: `${cloth.mill} • ${cloth.fibre}`,
        description: cloth.description,
        fabric: `${cloth.mill} • ${cloth.fibre}`,
        threadCount: cloth.weightLabel || "135 GSM",
        rating: 5,
        reviewsCount: 12,
        image: cloth.image,
        gallery: [cloth.image],
      };
      productMap.set(String(cloth.id), p);
    });

    const result: ProductItem[] = [];
    const seen = new Set<string>();

    for (const rawId of wishlistIds) {
      const sId = String(rawId);
      if (seen.has(sId)) continue;

      let matched = productMap.get(sId);

      // Match cloth-prod-X -> X
      if (!matched && sId.startsWith("cloth-prod-")) {
        const numId = sId.replace("cloth-prod-", "");
        matched = productMap.get(numId);
      }

      // Match look-X
      if (!matched && sId.startsWith("look-")) {
        matched = productMap.get(sId);
      }

      if (matched) {
        seen.add(sId);
        seen.add(String(matched.id));
        result.push(matched);
      }
    }

    return result;
  }, [wishlistIds, products]);

  return (
    <PageShell eyebrow="PERSONAL COLLECTION" title="SAVED PIECES">
      {savedProducts.length === 0 ? (
        <div className="max-w-md mx-auto text-center bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center mx-auto text-[#8C7355]">
            <Heart size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl uppercase text-black font-bold">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              Explore our bespoke atelier shirts, heritage Italian weaves, and tailored fits to save your personal favourites.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-sm hover:shadow active:scale-98"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white border border-[#E5E3DD] rounded-[12px] px-5 sm:px-6 py-3.5 flex flex-wrap gap-3 items-center justify-between text-[11px] text-[#666666] font-medium shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-black uppercase tracking-wider">
                {savedProducts.length} {savedProducts.length === 1 ? "PIECE SAVED" : "PIECES SAVED"}
              </span>
              <span className="text-black/30">•</span>
              <span className="text-[#666666]">Saved to your private atelier browser storage</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C7355] hover:text-black font-semibold uppercase tracking-wider underline cursor-pointer transition-colors"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>

              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] bg-[#F5F4F0] hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Full-Page Products Grid (254:350 aspect ratio, 2px gap) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] w-full items-start">
            {savedProducts.map((product) => (
              <div key={product.id} className="w-full">
                <ModernProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

"use client";

import React, { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import ModernProductCard from "@/components/ModernProductCard";
import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";
import ShopNatureHeroBanner from "@/components/ShopNatureHeroBanner";
import { getShopCollectionId, shopCategoryHref, shopCollections } from "@/data/shopCollections";

function ShopContent() {
  const selectedCategory = useSearchParams().get("category") || "all";

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#ECEAE5] text-black antialiased selection:bg-black selection:text-white">
      <Header activeTab="shop" forceSolid />
      <ShopCatalog key={selectedCategory} selectedCategory={selectedCategory} />
      <CommonAtelierShowcase />
      <Footer />
    </div>
  );
}

function ShopCatalog({ selectedCategory }: { selectedCategory: string }) {
  const { products, categories } = useCatalog();
  const c = useContent("shopPage");
  const [visibleCount, setVisibleCount] = useState(14);
  const isShopAll = selectedCategory === "all";
  const isStripedCollection = selectedCategory === "stripe-cotton-shirts" || selectedCategory === "formal_stripes";
  const isHandcraftedCollection = selectedCategory === "handcrafted-shirts";
  const isLinenCollection = selectedCategory === "executive-linen-shirts" || selectedCategory === "linen_collection";
  const collection = shopCollections.find(({ id }) => id === selectedCategory);
  const legacyCategory = categories.find(({ id }) => id === selectedCategory);
  const currentCategoryName = collection?.title || legacyCategory?.title || c.allCategoryName;

  const categoryProducts = useMemo(() => {
    if (isShopAll) return products;
    return products.filter((product) =>
      collection ? getShopCollectionId(product) === collection.id : product.category === selectedCategory,
    );
  }, [products, isShopAll, collection, selectedCategory]);

  const displayProducts = useMemo(() => {
    return categoryProducts.slice(0, visibleCount);
  }, [categoryProducts, visibleCount]);
  const showCustomFit = isHandcraftedCollection && categoryProducts.length === 0;

  // Alternate four standard cards with rows whose third card spans two columns.
  const productRows = useMemo(() => {
    const rows: { type: 4 | 3; items: typeof displayProducts }[] = [];
    let i = 0;
    let targetCount: 4 | 3 = 4;
    while (i < displayProducts.length) {
      const chunk = displayProducts.slice(i, i + targetCount);
      rows.push({ type: targetCount, items: chunk });
      i += targetCount;
      targetCount = targetCount === 4 ? 3 : 4;
    }
    return rows;
  }, [displayProducts]);

  const heroCollectionId = isStripedCollection ? "stripe-cotton-shirts" : isLinenCollection ? "executive-linen-shirts" : selectedCategory;
  const heroCollection = shopCollections.find(({ id }) => id === heroCollectionId);
  const collectionHeroImage =
    heroCollection?.heroImage || legacyCategory?.bgImage || legacyCategory?.image ||
    "/banners/shop_hero_banner_hd.jpg";

  return (
    <main className="relative flex-1 pb-12 sm:pb-20">
      {isShopAll ? (
        <>
          <h1 className="sr-only">{c.allCategoryName}</h1>
          <ShopNatureHeroBanner />
        </>
      ) : isStripedCollection || isHandcraftedCollection || isLinenCollection || collection?.id === "plain-formal-shirts" ? (
        <section className="relative h-[100dvh] w-full overflow-hidden bg-[#211b16]">
          <h1 className="sr-only">{currentCategoryName}</h1>
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-65 blur-xl"
            style={{ backgroundImage: `url(${collectionHeroImage})` }}
          />
          <Link
            href={showCustomFit ? "/custom-shirt" : "#collection-products"}
            aria-label={isLinenCollection ? "Shop linen formal shirts" : isHandcraftedCollection ? (showCustomFit ? "Explore Custom Fit" : "Shop handcrafted shirts") : isStripedCollection ? "Shop striped formal shirts" : "Shop plain formal shirts"}
            className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={collectionHeroImage}
              alt={isLinenCollection ? "Two models wearing pink and cream linen shirts in a garden lounge" : isHandcraftedCollection ? "Tailor hand-stitching a striped shirt in a showroom" : isStripedCollection ? "Two models in red and blue striped formal shirts in a showroom" : "Two models wearing blue and white formal shirts"}
              className={`h-full w-full object-contain ${collection?.id === "plain-formal-shirts" ? "p-[2vmin]" : ""}`}
              fetchPriority="high"
            />
            {isHandcraftedCollection && (
              <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap border border-white bg-black/50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white">
                {showCustomFit ? "Explore Custom Fit" : "Shop now"}
              </span>
            )}
          </Link>
        </section>
      ) : (
        <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden bg-[#e7e7e4] sm:h-[65vh] lg:h-[70vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collectionHeroImage}
            alt={currentCategoryName}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-white tracking-[0.14em] uppercase leading-tight max-w-4xl">
              {currentCategoryName}
            </h1>
            <Link
              href={showCustomFit ? "/custom-shirt" : "#collection-products"}
              className="mt-6 sm:mt-8 inline-flex h-10 min-w-[150px] items-center justify-center border border-white bg-white/10 hover:bg-white hover:text-black px-8 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-[2px] transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
            >
              {showCustomFit ? "Explore Custom Fit" : "Shop now"}
            </Link>
          </div>
        </section>
      )}

      <div className="w-full pt-6 sm:pt-10">
        {!isShopAll && (
          <nav aria-label="Shop collections" className="mx-auto mb-6 flex w-full max-w-[1720px] flex-wrap items-center gap-3 px-4 sm:mb-8 sm:px-8 lg:px-12">
            <Link href="/shop" className="mr-2 text-xs font-bold uppercase tracking-widest text-[#555555] hover:text-black">
              Shop All
            </Link>
            {shopCollections.map(({ id, title }) => {
              const isActive = selectedCategory === id;
              return (
                <Link
                  key={id}
                  href={shopCategoryHref(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-[#E5E3DD] bg-white text-[#555555] hover:border-black hover:text-black"
                  }`}
                >
                  {title}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div id="collection-products" className="w-full scroll-mt-24 space-y-6 pt-2 mb-14 sm:mb-20">
        {/* Header with Title & Item Count */}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E3DD]">
          <div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
              {isShopAll ? "All Products" : currentCategoryName}
            </h2>
          </div>
          <span className="text-[12px] sm:text-[13px] font-medium tracking-[0.14em] uppercase text-black/60 shrink-0">
            {categoryProducts.length} ITEMS
          </span>
        </div>

        {displayProducts.length === 0 && (
          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-10 text-center space-y-4 shadow-sm">
              <p className="text-sm text-[#666666]">
                {showCustomFit ? "No handcrafted shirts are listed yet." : c.emptyText}
              </p>
              <Link
                href={showCustomFit ? "/custom-shirt" : "/shop"}
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800"
              >
                {showCustomFit ? "Explore Custom Fit" : "Shop All"}
              </Link>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-8 sm:gap-12 lg:gap-14">
          {productRows.map((row) => (
            <div
              key={row.items[0].id}
              className="grid w-full grid-cols-2 items-start gap-x-[15px] px-[7.5px] lg:grid-cols-4"
            >
              {row.items.map((product, index) => {
                const isWide = row.type === 3 && index === 2;
                return (
                  <div key={product.id} className={isWide ? "col-span-2" : "col-span-1"}>
                    <ModernProductCard product={product} isWideSpan={isWide} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Load More Button if remaining products exist */}
        {visibleCount < categoryProducts.length && (
          <div className="flex items-center justify-center pt-8 sm:pt-12 px-4">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 7)}
              className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.22em] px-10 sm:px-14 py-3.5 sm:py-4 rounded-full transition-all duration-300 uppercase shadow-sm cursor-pointer active:scale-98"
            >
              LOAD MORE ({categoryProducts.length - visibleCount} MORE)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function ShopLoading() {
  const c = useContent("shopPage");
  return (
    <div className="min-h-screen bg-[#ECEAE5] flex items-center justify-center text-sm font-semibold tracking-widest uppercase text-black">
      {c.loadingText}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}

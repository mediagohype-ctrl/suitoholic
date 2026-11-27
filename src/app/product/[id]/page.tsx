"use client";

import React, { useState, useEffect } from "react";
import Link from"next/link";
import { useParams, useRouter } from"next/navigation";
import Header from"@/components/Header";
import Footer from"@/components/Footer";
import YouMayAlsoLikeSection from "@/components/YouMayAlsoLikeSection";
import ModernProductCard from"@/components/ModernProductCard";
import { useCart } from"@/context/CartProvider";
import { useCatalog, useContent } from"@/context/SiteDataProvider";
import { useWishlist } from"@/context/WishlistProvider";
import { fillTemplate } from"@/content/merge";
import type { CustomFit, ProductItem } from"@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Heart,
  Star,
  ShoppingBag,
  Scissors,
  ShieldCheck,
  RefreshCw,
  Check,
  Sparkles,
  Layers,
  Share2,
  Truck,
  type LucideIcon,
} from"lucide-react";
import confetti from"canvas-confetti";
import CustomizationModal from "@/components/CustomizationModal";
import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";
import CatalogImage from "@/components/CatalogImage";
import ProductModelPreview, { getFabricBackground, productModelPhotos, useProductModelFabric } from "@/components/ProductModelPreview";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";

// Icon keys usable in the productPage.badges content
const BADGE_ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  scissors: Scissors,
  refresh: RefreshCw,
  sparkles: Sparkles,
  check: Check,
  star: Star,
  layers: Layers,
};

/** True for pale swatches that need a dark check mark. */
const isLightHex = (hex: string) => {
  const h = hex.replace("#","");
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return false;
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 186;
};

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.7 },
  });
};

export default function ProductDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;
  const { products, getProduct } = useCatalog();
  const c = useContent("productPage");
  const { addItem, busy } = useCart();
  const router = useRouter();

  const activeProduct = getProduct(idOrSlug);
  const { color: modelColor, stripeColor } = useProductModelFabric(activeProduct);
  const [photoSelection, setPhotoSelection] = useState({ productSlug: "", index: 0 });
  const selectedImageIndex = photoSelection.productSlug === activeProduct?.slug ? photoSelection.index : 0;

  const selectedSize = 38;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = activeProduct ? isInWishlist(activeProduct.id) : false;
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastError, setToastError] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [buyNowMode, setBuyNowMode] = useState<boolean>(false);

  // Guarantee product page always lands at the very top on load / navigation
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [idOrSlug]);

  if (!activeProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-hidden selection:bg-black selection:text-white">
        <Header activeTab="shop" />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-44 pb-20 space-y-5">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl uppercase tracking-wider">{c.notFoundTitle}</h1>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-sm"
          >
            <span>{c.notFoundCta}</span>
            <ArrowRight size={14} />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const colorways = activeProduct.colorways ?? [];
  const isSageBengal = /^(suitoholic-)?sage-green-bengal-striped-twill-shirt$/.test(activeProduct.slug);
  const matchingFull = isSageBengal ? "" : getMatchingFullShirtImage(activeProduct);
  const isCoralProduct = activeProduct.slug === "coral-red-bold-bengal-stripe-twill-shirt";
  const studioModelPhoto = isCoralProduct ? "/products/coral-bengal-stripe-model-studio.webp" : "";
  const armchairModelPhoto = isCoralProduct ? "/products/coral-bengal-stripe-model-armchair.webp" : "";
  const matchingPortraitPrefixes: Partial<Record<string, string>> = {
    "mustard-ochre-bengal-striped-twill-shirt": "mustard-ochre",
    "royal-blue-classic-bengal-stripe-twill-shirt": "royal-blue-bengal",
  };
  const matchingPortraitPrefix = matchingPortraitPrefixes[activeProduct.slug];
  const referenceModelPhoto = isSageBengal
    ? "/products/suitoholic-sage-green-bengal-striped-twill-shirt-model.webp"
    : activeProduct.slug === "crisp-executive-white-twill-shirt" || activeProduct.slug === "beige-textured-linen-cotton-shirt"
      ? `/products/${activeProduct.slug}-model.webp`
      : "";
  const matchingModelPhotos = matchingPortraitPrefix
    ? ["sofa", "garden", "studio", "armchair"].map((pose) => `/products/${matchingPortraitPrefix}-model-${pose}.webp`)
    : activeProduct.slug === "soft-ivory-white-egyptian-cotton-shirt"
      ? [1, 2, 3, 4].map((number) => `/generated/soft_ivory_models/character_${number}_soft_ivory.jpg`)
      : [];
  const excludedCoralGalleryPhotos = [
    "/customizer/shirt_model_coral_stripe.png",
    "/new_shirts/shirt_14.jpg",
    "/customizer/coral-step5-wide/cutaway-classic-reference-matched.webp",
  ];
  const onModelPhoto = isCoralProduct
    ? "/products/coral-bengal-stripe-on-model.webp"
    : activeProduct.slug === "soft-ivory-white-egyptian-cotton-shirt"
    ? "/generated/soft_ivory_models/character_1_soft_ivory.jpg"
    : "";
  const productPhotos = [...new Set([
    onModelPhoto,
    ...matchingModelPhotos,
    referenceModelPhoto,
    ...(activeProduct.gallery ?? []),
    studioModelPhoto,
    armchairModelPhoto,
    activeProduct.image,
    matchingFull,
  ].filter(Boolean).map((image) => {
    const path = image.trim().replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\/?/i, "/");
    return path === "/products/coral-bengal-stripe-model-garden.webp"
      ? "/products/coral-bengal-stripe-model-garden-v2.webp"
      : path;
  }).filter((path) => path && !(isCoralProduct && excludedCoralGalleryPhotos.includes(path))
    && !(isSageBengal && path === "/customizer/shirt_model_sage.png")))];
  const fabricModelPhotos = isCoralProduct
    ? [studioModelPhoto, armchairModelPhoto, "/products/coral-bengal-stripe-model-garden-v2.webp", "/products/coral-bengal-stripe-model-curly.webp"]
    : matchingModelPhotos;
  const gallery = [...new Set([
    productPhotos[0] ?? "/shirt_classic_white.jpg",
    ...(fabricModelPhotos.length ? fabricModelPhotos : productModelPhotos.map(({ src }) => src)),
    ...productPhotos.slice(1),
  ])];
  const selectedImage = gallery[selectedImageIndex] ?? gallery[0];
  const selectedModel = productModelPhotos.find(({ src }) => src === selectedImage);
  const modelPattern = getFabricBackground(activeProduct, modelColor, 1, stripeColor);
  const discount = activeProduct.compareAtPrice && activeProduct.rawPrice > 0
    ? Math.max(0, Math.round(100 * (1 - activeProduct.rawPrice / activeProduct.compareAtPrice)))
    : 0;
  const selectedColor = colorways.find((colorway) => colorway.productSlug === activeProduct.slug);
  const outOfStock = activeProduct.stock === 0;
  const lowStock = typeof activeProduct.stock ==="number" && activeProduct.stock > 0 && activeProduct.stock <= 5;

  const showToast = (message: string, isError = false, ms = 5000) => {
    setToastMessage(message);
    setToastError(isError);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), ms);
  };

  const handleOpenCustomizer = (buyNow: boolean) => {
    if (outOfStock) return;
    setBuyNowMode(buyNow);
    setIsCustomizerOpen(true);
  };

  const handleShareProduct = async () => {
    const url = new URL(`/product/${activeProduct.slug}`, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: activeProduct.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Product link copied");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        showToast("Could not share this product", true);
      }
    }
  };

  const handleConfirmCustomization = async (customFit: CustomFit, chosenProduct?: { id?: number | string; name?: string } | null) => {
    const targetProduct = (chosenProduct && chosenProduct.id) ? (products.find((p) => p.id === chosenProduct.id) || activeProduct) : activeProduct;
    try {
      await addItem({
        productId: targetProduct.id,
        quantity: 1,
        size: String(customFit.chestSize),
        customization: customFit,
      });
    } catch (err) {
      setIsCustomizerOpen(false);
      showToast((err as Error).message, true);
      return;
    }
    setIsCustomizerOpen(false);
    triggerConfetti();
    if (buyNowMode) {
      router.push("/checkout");
      return;
    }
    showToast(
      fillTemplate(c.addedToBagTemplate, {
        name: targetProduct.name,
        details: `CHEST ${customFit.chestSize}" • ${customFit.bodyFit.toUpperCase()} FIT • BESPOKE CUSTOMIZED`,
      }),
    );
  };

  const handleAddToOutfit = async (item: ProductItem) => {
    try {
      await addItem({ productId: item.id, quantity: 1, size: String(selectedSize) });
      showToast(fillTemplate(c.addedToOutfitTemplate, { name: item.name }), false, 3500);
      triggerConfetti();
    } catch (err) {
      showToast((err as Error).message, true);
    }
  };

  const completeLookItems = products
    .filter((p) => p.id !== activeProduct.id && p.category !== activeProduct.category)
    .slice(0, 4);
  const moreColorways = products
    .filter((p) => p.category === activeProduct.category && p.id !== activeProduct.id)
    .slice(0, 8);
  const macroProducts = products
    .filter((p) => p.category ==="formal_stripes")
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black antialiased relative overflow-x-hidden selection:bg-black selection:text-white">
      {/* Header */}
      <Header activeTab="shop" />

      {/* Main Studio Content */}
      <div className="relative flex-1 w-full">
        <main className="relative z-10 mx-auto w-full max-w-[1800px] space-y-4 px-4 pb-8 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pt-36">

          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/shop?category=${activeProduct.category}`}
              className="inline-flex items-center gap-2 py-2 text-xs font-semibold tracking-wide text-neutral-600 hover:text-black"
            >
              <ArrowLeft size={15} />
              <span>{c.backLabel}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">

            {/* LEFT COLUMN: Visual Showcase Gallery */}
            <div className={"grid min-w-0 items-start gap-4 lg:grid-cols-[88px_minmax(0,1fr)] xl:grid-cols-[112px_minmax(0,1fr)]"}>

              {/* Main Display Box */}
              <div
                className={"relative w-fit max-w-full justify-self-center overflow-hidden lg:col-start-2 lg:row-start-1"}
              >
                {selectedModel ? (
                  <figure>
                    <ProductModelPreview
                      photo={selectedModel}
                      color={modelColor}
                      pattern={modelPattern}
                      alt={selectedModel.label + " · " + (modelColor ? activeProduct.name + " color preview" : "fit reference")}
                    />
                    <figcaption className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-xs text-white">
                      {modelColor ? "Color preview" : "Fit reference"}
                    </figcaption>
                  </figure>
                ) : <CatalogImage
                  key={selectedImage}
                  src={selectedImage}
                  alt={selectedImage === armchairModelPhoto ? `${activeProduct.name} worn with rolled sleeves by a model in an armchair` : selectedImage === studioModelPhoto ? `${activeProduct.name} with a band collar, worn by a seated studio model` : selectedImage === onModelPhoto ? `${activeProduct.name} worn by a seated model` : selectedImage.includes("coral-bengal-stripe-model-garden") ? `${activeProduct.name} worn by model at an outdoor garden party` : activeProduct.name}
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="block h-auto max-h-[min(82svh,820px)] w-auto max-w-full"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.dataset.retried) {
                      target.dataset.retried = "1";
                      if (target.src.endsWith(".png")) target.src = target.src.replace(/\.png$/i, ".jpg");
                      else if (target.src.endsWith(".jpg")) target.src = target.src.replace(/\.jpg$/i, ".png");
                      else target.src = "/shirt_classic_white.jpg";
                    } else {
                      target.src = "/shirt_classic_white.jpg";
                    }
                  }}
                />}

                {/* Wishlist Button */}
                <button
                  onClick={() => activeProduct && toggleWishlist(activeProduct.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md cursor-pointer z-10"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={18}
                    className={isWishlisted ?"fill-[#E04B4B] text-[#E04B4B]" :"text-white"}
                  />
                </button>
                {activeProduct.customizable && (
                  <span className="absolute bottom-4 left-4 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800">
                    Customisable
                  </span>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div key={activeProduct.slug} role="group" aria-label="Product photos" data-lenis-prevent tabIndex={0} className="flex gap-3 overflow-x-auto p-1 lg:col-start-1 lg:row-start-1 lg:max-h-[min(82svh,820px)] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-y-contain">
                {gallery.map((imgUrl, idx) => {
                  const model = productModelPhotos.find(({ src }) => src === imgUrl);
                  return (
                  <button
                    key={imgUrl}
                    type="button"
                    aria-label={model ? "Show model preview · " + model.label : imgUrl === armchairModelPhoto ? "Show shirt on model in armchair" : imgUrl === studioModelPhoto ? "Show shirt on seated studio model" : imgUrl === onModelPhoto ? "Show shirt on model" : imgUrl.includes("coral-bengal-stripe-model-garden") ? "Show shirt on garden party model" : `Show product photo ${idx + 1} of ${gallery.length}`}
                    aria-pressed={selectedImageIndex === idx}
                    onClick={() => setPhotoSelection({ productSlug: activeProduct.slug, index: idx })}
                    className={`relative aspect-[4/5] w-16 shrink-0 cursor-pointer overflow-hidden border bg-[#f7f6f3] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 lg:w-full ${selectedImageIndex === idx
                      ?"border-black ring-1 ring-black"
                      :"border-[#E5E3DD] opacity-75 hover:opacity-100"
                      }`}
                  >
                    {model ? <ProductModelPreview photo={model} color={modelColor} pattern={modelPattern} alt="" thumbnail /> : <CatalogImage
                      src={imgUrl}
                      alt=""
                      sizes="112px"
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.dataset.retried) {
                          target.dataset.retried = "1";
                          if (target.src.endsWith(".png")) target.src = target.src.replace(/\.png$/i, ".jpg");
                          else if (target.src.endsWith(".jpg")) target.src = target.src.replace(/\.jpg$/i, ".png");
                          else target.src = "/shirt_classic_white.jpg";
                        } else {
                          target.src = "/shirt_classic_white.jpg";
                        }
                      }}
                    />}
                  </button>
                  );
                })}
              </div>

              {/* Visual Assurance Badges Strip */}
              <div className="col-span-full grid grid-cols-3 gap-2.5 pt-1 text-center">
                {c.badges.map((badge, i) => {
                  const Icon = BADGE_ICONS[badge.icon] ?? ShieldCheck;
                  return (
                    <div key={i} className="bg-white border border-[#E5E3DD] rounded-2xl p-3 shadow-sm">
                      <Icon size={18} className="mx-auto text-black mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-black">{badge.title}</span>
                      <span className="text-[9px] text-[#666666] block">{badge.subtitle}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Product Specs, Swatches & Action Buttons */}
            <div className="min-w-0 space-y-6 rounded-[24px] border border-[#E5E3DD] bg-white p-6 shadow-sm sm:rounded-[32px] sm:p-9">

              {/* Brand Title & Price */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="font-serif-luxury text-xl font-normal uppercase leading-tight tracking-tight text-black sm:text-2xl lg:text-[28px]">{activeProduct.name}</h1>
                  <button type="button" onClick={handleShareProduct} aria-label="Share product" className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-100 hover:bg-neutral-200">
                    <Share2 size={17} />
                  </button>
                </div>

                {/* Rating & Review Counter */}
                <div className="flex items-center space-x-2.5 mt-2.5">
                  <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className={i < Math.round(activeProduct.rating) ?"fill-current" :""} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-black">{activeProduct.rating} / 5.0</span>
                  <span className="text-xs text-[#666666] font-medium">({activeProduct.reviewsCount} {c.reviewsSuffix})</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[#E5E3DD] pt-3.5">
                  <span className="font-sans text-2xl sm:text-3xl font-bold text-black tracking-tight">
                    {activeProduct.price}
                  </span>
                  {activeProduct.compareAtPrice ? (
                    <span className="text-sm text-[#888888] line-through">
                      {activeProduct.price.replace(/[\d,.]+/, Number(activeProduct.compareAtPrice).toLocaleString("en-IN"))}
                    </span>
                  ) : null}
                  {discount > 0 && <span className="text-sm font-semibold text-[#29493d]">{discount}% off</span>}
                </div>
                <p className="mt-1.5 text-xs text-neutral-600">{c.taxNote}</p>
                {(outOfStock || lowStock) && (
                  <p className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${outOfStock ?"text-red-600" :"text-[#666666]"}`}>
                    {outOfStock ? c.outOfStockLabel : fillTemplate(c.lowStockTemplate, { stock: activeProduct.stock ?? 0 })}
                  </p>
                )}
              </div>

              {/* VISUAL COLORWAY / FABRIC SWATCH SELECTOR */}
              {colorways.length > 0 && (
                <div className="space-y-2.5 border-t border-[#E5E3DD] pt-3.5">
                  <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-black">{selectedColor ? `Style · ${selectedColor.name}` : c.colorwaysLabel}</h2>

                  <div className="flex flex-wrap items-center gap-3">
                    {colorways.map((cw, idx) => {
                      const target = getProduct(cw.productSlug);
                      const isSelected = target?.slug === activeProduct.slug;
                      const swatchColor = isSelected ? modelColor : undefined;
                      const swatchPattern = isSelected && target ? getFabricBackground(target, swatchColor, 10, stripeColor) : undefined;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (target) {
                              setPhotoSelection({ productSlug: target.slug, index: 0 });
                              router.replace(`/product/${target.slug}`, { scroll: false });
                            }
                          }}
                          type="button"
                          aria-pressed={isSelected}
                          disabled={!target}
                          className={`relative grid size-9 place-items-center overflow-hidden rounded-full border-2 shadow-sm transition-all disabled:cursor-default ${isSelected
                            ?"scale-110 border-black ring-2 ring-black"
                            :"border-[#E5E3DD] opacity-80 hover:opacity-100"
                            }`}
                          style={{ backgroundColor: swatchColor || "#eee7dd", backgroundImage: swatchPattern }}
                          title={cw.name}
                          aria-label={cw.name}
                        >
                          {!swatchColor && target?.image && (
                            <CatalogImage src={target.image} alt="" sizes="36px" className="absolute inset-0 size-full object-cover" />
                          )}
                          {isSelected && (
                            <Check size={14} className={isLightHex(swatchColor ?? "#eee7dd") ?"relative text-black" :"relative text-white"} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 divide-x divide-[#E5E3DD] overflow-hidden rounded-2xl border border-[#E5E3DD] bg-[#F5F4F0] text-center text-xs font-semibold">
                <div className="grid justify-items-center gap-2 p-4"><RefreshCw size={18} />30-Day Fit Guarantee</div>
                <div className="grid justify-items-center gap-2 p-4"><Truck size={18} />Complimentary shipping</div>
              </div>

              <div className="space-y-3 border-t border-[#E5E3DD] pt-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCustomizer(false)}
                    disabled={outOfStock || busy}
                    className="flex min-h-[58px] flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ShoppingBag size={16} />
                      <span>{outOfStock ? c.outOfStockLabel : c.addToBagLabel}</span>
                    </div>
                    {activeProduct.customizable && <span className="whitespace-nowrap text-[10px] tracking-wide text-white/70">{c.addToBagHint}</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCustomizer(true)}
                    disabled={outOfStock || busy}
                    className="flex min-h-[58px] flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>{c.buyNowLabel}</span>
                    {activeProduct.customizable && <span className="whitespace-nowrap text-[10px] tracking-wide text-white/70">{c.buyNowHint || c.addToBagHint}</span>}
                  </button>
                </div>

                {/* Toast Notification */}
                {toastVisible && (
                  <div
                    role="status"
                    className={`${toastError ?"bg-red-600" :"bg-black"} text-white p-3.5 rounded-full text-center text-xs font-bold tracking-wider animate-in slide-in-from-top-2 duration-300 shadow-lg flex flex-wrap items-center justify-center gap-2`}
                  >
                    {toastError ? <AlertCircle size={16} /> : <Check size={16} />}
                    <span>{toastMessage}</span>
                    {!toastError && (
                      <Link href="/cart" className="underline underline-offset-2 hover:text-white/80">
                        {c.viewBagLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {activeProduct.customizable && (
                <section className="rounded-2xl border border-[#E5E3DD] bg-[#F5F4F0] p-4" aria-label="Variant">
                  <h2 className="mb-3 text-base font-semibold">Variant</h2>
                  <div className="rounded-full border border-[#E5E3DD] bg-white px-4 py-2.5 text-center text-sm">Customisable</div>
                </section>
              )}

              {/* Specifications Card */}
              <section className="rounded-2xl border border-[#E5E3DD] bg-[#F5F4F0] p-4.5 shadow-xs">
                <h2 className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#666666]">Product Information</h2>
                <dl className="divide-y divide-neutral-200 text-sm">
                  {[
                    ["Brand", "Suitoholic"],
                    [c.specLabels.fabric, activeProduct.fabric],
                    [c.specLabels.threadCount, activeProduct.threadCount],
                    [c.specLabels.collar, activeProduct.collar],
                    [c.specLabels.cuff, activeProduct.cuff],
                  ].filter(([label, value]) => label && value).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 py-2.5">
                      <dt className="text-neutral-600">{(label || "").replace(/:$/, "")}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
                {activeProduct.description && (
                  <details className="mt-2 border-t border-neutral-200 pt-3 text-sm">
                    <summary className="cursor-pointer font-semibold">Read more</summary>
                    <p className="mt-3 whitespace-pre-line leading-relaxed text-neutral-600">{activeProduct.description}</p>
                  </details>
                )}
              </section>

            </div>

          </div>

        </main>

        {/* SECTION 2: BEST SELLERS / EXECUTIVE STRIPES (END TO END FULL WIDTH) */}
        <div className="w-full py-8 sm:py-12 border-t border-[#E5E3DD]">
          <div className="text-center max-w-4xl mx-auto px-4 mb-6 sm:mb-8">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
              {c.macroTitle || "BEST SELLERS"}
            </h2>
          </div>

          {/* 4-Column Product Cards Grid - END TO END (5px gap from screen) with Exact 2px Gap between cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] w-full items-start px-[5px]">
            {(macroProducts.length >= 4 ? macroProducts : products.slice(0, 4)).map((item) => (
              <div key={item.id} className="w-full">
                <ModernProductCard product={item} />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: "COMPLETE THE LOOK" E-COMMERCE OUTFIT GRID (END TO END FULL WIDTH) */}
        {completeLookItems.length > 0 && (
          <div className="w-full py-8 sm:py-12 border-t border-[#E5E3DD]">
            <div className="text-center max-w-4xl mx-auto px-4 mb-6 sm:mb-8">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                {c.completeLookTitle}
              </h2>
            </div>

            {/* 4-Column Product Cards Grid - END TO END (5px gap from screen) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] w-full items-start px-[5px]">
              {completeLookItems.map((item) => (
                <div key={item.id} className="w-full">
                  <ModernProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: DISCOVER OTHER BESPOKE COLORWAYS (END TO END FULL WIDTH) */}
        {moreColorways.length > 0 && (
          <div className="w-full py-8 sm:py-12 border-t border-[#E5E3DD]">
            <div className="w-full px-[5px] sm:px-3 mb-6 sm:mb-8 flex justify-between items-end gap-3">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                {c.moreTitle || "MORE BESPOKE SHIRT COLORWAYS"}
              </h2>
              <Link href="/shop" className="text-xs font-bold tracking-widest text-black hover:text-[#666666] uppercase flex items-center gap-1 shrink-0 transition-colors">
                <span>{c.viewAllLabel}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* 4-Column Product Cards Grid - END TO END (5px gap from screen) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] w-full items-start px-[5px]">
              {moreColorways.map((p) => (
                <div key={p.id} className="w-full">
                  <ModernProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: YOU MAY ALSO LIKE (FULL SCREEN WIDTH CONTINUOUS SLOW AUTOPLAY CAROUSEL) */}
        <YouMayAlsoLikeSection
          products={products}
          currentProductId={activeProduct.id}
        />
      </div>

      {/* Common Atelier Showcase: Video Banner, Shop By Fabrics & Customer Testimonials */}
      <CommonAtelierShowcase />

      {/* Comprehensive Luxury E-Commerce Footer */}
      <Footer />

      {/* 6-Step Bespoke Customization Popup Modal */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        buyNow={buyNowMode}
        onClose={() => setIsCustomizerOpen(false)}
        productName={activeProduct.name}
        product={{
          ...activeProduct,
          image: selectedModel ? activeProduct.image : selectedImage,
        }}
        initialChestSize={selectedSize}
        submitting={busy}
        onConfirmCustomization={handleConfirmCustomization}
      />
    </div>
  );
}

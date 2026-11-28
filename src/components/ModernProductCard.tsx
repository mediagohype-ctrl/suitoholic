"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductItem } from "@/data/products";
import { useWishlist } from "@/context/WishlistProvider";
import { useCustomizer } from "@/context/CustomizerModalProvider";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";
import CatalogImage from "@/components/CatalogImage";

interface ModernProductCardProps {
  product: ProductItem;
  cardImage?: string;
  isWideSpan?: boolean;
  onCardClick?: (product: ProductItem) => void;
  onCustomise?: (product: ProductItem) => void;
}

export default function ModernProductCard({
  product,
  cardImage,
  isWideSpan,
  onCardClick,
  onCustomise,
}: ModernProductCardProps) {
  const { openCustomizer } = useCustomizer();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  // Use gallery if available, or fallback to main image (clean any localhost URLs)
  const rawImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery 
    : [product.image];
  const cleanImages = rawImages
    .filter((img): img is string => Boolean(img && typeof img === "string" && img.trim().length > 0))
    .map(img => img.replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\/?/i, "/"));

  // When isWideSpan is true, prefer the secondary lookbook image if available for dramatic editorial width
  const wideMainImage = !cardImage && isWideSpan && (getMatchingFullShirtImage(product) || cleanImages[1]);
  const isBeigeLinen =
    product.slug === "beige-textured-linen-cotton-shirt" ||
    (product.name || "").toLowerCase().includes("beige textured linen");
  const baseImage = isBeigeLinen
    ? "/new_shirts/shirt_13.jpg"
    : (cleanImages[0] || product.image || "/new_shirts/shirt_13.jpg");
  const activeMainImage = cardImage || wideMainImage || baseImage;
  const imageAspect = cardImage ? "aspect-[529/646]" : isWideSpan ? "aspect-[508/350]" : "aspect-[254/350]";
  const imageSizes = isWideSpan ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 50vw, 25vw";

  const handleToggleSave = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Upper Rectangular Image Container - Full Column Width with 254:350 Aspect Ratio (or 508:350 for Wide Span) */}
      <div className={`relative w-full ${imageAspect} rounded-[10px] overflow-hidden bg-[#ECEAE5]`}>
        {/* Main Product Image Container */}
        <Link
          href={`/product/${product.slug}`}
          prefetch={!onCardClick}
          onClick={(e) => {
            if (onCardClick) {
              e.preventDefault();
              onCardClick(product);
            }
          }}
          className="block relative w-full h-full overflow-hidden rounded-[10px] bg-[#ECEAE5]"
        >
          {/* Default Image */}
          <CatalogImage
            src={activeMainImage}
            alt={product.name}
            sizes={imageSizes}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src.includes(".png")) {
                img.src = img.src.replace(/\.png(\?.*)?$/i, ".jpg$1");
              } else if (!img.dataset.failed) {
                img.dataset.failed = "true";
                img.src = "/shirt_classic_white.jpg";
              }
            }}
          />
        </Link>

        {/* Top Right: Floating Outline Heart Wishlist Icon */}
        <button
          onClick={handleToggleSave}
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 p-1 transition-transform duration-200 hover:scale-115 active:scale-90 cursor-pointer"
        >
          <Heart
            size={19}
            strokeWidth={1.5}
            className={`drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-colors ${
              isSaved
                ? "text-red-500 fill-red-500"
                : "text-white fill-transparent stroke-white"
            }`}
          />
        </button>
      </div>

      {/* Lower Details Strip: Product Name & Price on Left, Plus Icon on Right */}
      <div className="mt-2.5 sm:mt-3 flex items-start justify-between gap-2 px-1 pb-2">
        {/* Left: Product Name & Price */}
        <div className="min-w-0 flex-1 space-y-1">
          <Link
            href={`/product/${product.slug}`}
            prefetch={false}
            onClick={(e) => {
              if (onCardClick) {
                e.preventDefault();
                onCardClick(product);
              }
            }}
            className="block"
          >
            <h3 
              title={product.name}
              className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.16em] text-black uppercase truncate leading-snug"
            >
              {product.name}
            </h3>
          </Link>
          <div className="font-sans text-[10px] sm:text-[11px] font-medium text-[#666666] tracking-[0.08em] uppercase">
            RS. {product.rawPrice ? product.rawPrice.toLocaleString("en-IN") : product.price.replace("₹", "").trim()}
          </div>
        </div>

        {/* Right: Cart Button -> Opens Customizer Modal or triggers onCustomise */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onCustomise) {
              onCustomise(product);
            } else {
              openCustomizer(product);
            }
          }}
          aria-label={`Customise ${product.name}`}
          title="Customise Shirt (6 Steps)"
          className="shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5"
        >
          <ShoppingBag size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

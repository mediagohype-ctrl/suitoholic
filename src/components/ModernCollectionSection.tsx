"use client";

import React, { useRef, useMemo } from"react";
import Link from"next/link";
import { ChevronLeft, ChevronRight, Plus, Heart } from"lucide-react";
import { CollectionCategory, ProductItem } from"@/data/products";
import ModernProductCard from"./ModernProductCard";
import { useCustomizer } from"@/context/CustomizerModalProvider";
import { useWishlist } from"@/context/WishlistProvider";

interface ModernCollectionSectionProps {
  collection: CollectionCategory;
  products: ProductItem[];
  headerTitle?: string;
  cardsPerView?: number;
}

const FALLBACK_FABRIC_ITEMS: ProductItem[] = [
  {
    id: 51,
    slug:"dark-chocolate-brown-satin-twill-shirt",
    name:"Dark Chocolate Brown Satin Twill Shirt",
    category:"formal_shirts",
    price:"₹ 2,600",
    rawPrice: 2600,
    subtitle:"Luxurious silk-touch satin twill shirt with a rich lustrous finish",
    description:"Tailored from an ultra-fine cotton satin twill blend, this rich dark chocolate brown shirt exudes pure luxury and refinement.",
    fabric:"Ultra-Fine Cotton Satin Twill Blend",
    threadCount:"140s Silk-Touch Sateen",
    image:"/new_shirts/shirt_19.jpg",
    gallery: ["/new_shirts/shirt_19.jpg","/customizer/full_shirt_19.jpg"],
    rating: 5.0,
    reviewsCount: 114,
  },
  {
    id: 50,
    slug:"beige-textured-linen-cotton-shirt",
    name:"Beige Textured Linen Cotton Shirt",
    category:"formal_shirts",
    price:"₹ 2,600",
    rawPrice: 2600,
    subtitle:"Lightweight breathable textured shirt for effortless smart styling",
    description:"Woven from a premium linen-cotton blend, this subtle textured beige shirt combines breathable comfort with an understated elegance.",
    fabric:"Premium Linen-Cotton Blend",
    threadCount:"Breathable Melange Texture",
    image:"/new_shirts/shirt_13.jpg",
    gallery: ["/new_shirts/shirt_13.jpg","/customizer/full_shirt_13.jpg"],
    rating: 5.0,
    reviewsCount: 76,
  },
  {
    id: 52,
    slug:"royal-blue-classic-bengal-stripe-twill-shirt",
    name:"Royal Blue Classic Bengal Stripe Twill Shirt",
    category:"formal_stripes",
    price:"₹ 2,600",
    rawPrice: 2600,
    subtitle:"Sharp and timeless royal blue striped shirt in premium twill weave",
    description:"Woven from high-grade cotton in a diagonal twill weave, this shirt features vibrant royal blue and white Bengal stripes.",
    fabric:"100% High-Grade Cotton",
    threadCount:"Diagonal Twill Weave",
    image:"/new_shirts/shirt_21.jpg",
    gallery: ["/new_shirts/shirt_21.jpg","/customizer/full_shirt_21.jpg"],
    rating: 5.0,
    reviewsCount: 112,
  },
  {
    id: 49,
    slug:"coral-red-bold-bengal-stripe-twill-shirt",
    name:"Coral Red Bold Bengal Stripe Twill Shirt",
    category:"formal_stripes",
    price:"₹ 2,633",
    rawPrice: 2633,
    subtitle:"Premium twill weave striped shirt for a sharp, confident look",
    description:"Crafted with precision, this custom-made shirt features prominent coral red and white Bengal stripes woven in an ultra-smooth twill texture.",
    fabric:"100% Fine Twill Cotton",
    threadCount:"130s Luxury Twill",
    image:"/new_shirts/shirt_14.jpg",
    gallery: ["/new_shirts/shirt_14.jpg","/customizer/full_shirt_14.jpg"],
    rating: 5.0,
    reviewsCount: 65,
  },
];

export default function ModernCollectionSection({

  collection,
  products,
  headerTitle,
  cardsPerView,
}: ModernCollectionSectionProps) {
  const colId = collection.id || (collection as unknown as { key?: string })?.key;
  const isThreeCardMode =
    cardsPerView === 3 ||
    colId ==="formal_bespoke" ||
    (headerTitle && headerTitle.toLowerCase().includes("fabric"));

  const uniqueProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const seen = new Set<string | number>();
    return products.filter((p) => {
      const key = p?.id ?? p?.slug;
      if (key === undefined || key === null || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [products]);

  const displayProducts = useMemo(() => {
    let list = uniqueProducts;
    if (isThreeCardMode && list.length < 4) {
      const seen = new Set<string | number>();
      list.forEach((p) => {
        if (p.id) seen.add(p.id);
        if (p.slug) seen.add(p.slug);
      });
      const needed = FALLBACK_FABRIC_ITEMS.filter((p) => !seen.has(p.id) && !seen.has(p.slug));
      list = [...list, ...needed];
    }
    return list.length > 0 ? list : FALLBACK_FABRIC_ITEMS;
  }, [uniqueProducts, isThreeCardMode]);

  // Ensure 4-column grids never render an awkward incomplete trailing row with 1-3 empty spaces
  const gridProducts = useMemo(() => {
    if (uniqueProducts.length === 0) return [];
    const isFabrics = 
      headerTitle?.toLowerCase().includes("fabric") || 
      collection?.title?.toLowerCase().includes("fabric") ||
      collection?.id ==="formal_bespoke" ||
      collection?.id ==="fabrics";
    
    if (isFabrics) {
      return uniqueProducts.slice(0, 8);
    }

    const remainder = uniqueProducts.length % 4;
    return remainder === 0 ? uniqueProducts : uniqueProducts.slice(0, uniqueProducts.length - remainder);
  }, [uniqueProducts, headerTitle, collection]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { openCustomizer } = useCustomizer();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    if (scrollLeft <= 10) {
      scrollRef.current.scrollTo({ left: scrollWidth, behavior:"smooth" });
    } else {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const step = (card?.offsetWidth ?? 340) + 20;
      scrollRef.current.scrollBy({ left: -step, behavior:"smooth" });
    }
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 15) {
      scrollRef.current.scrollTo({ left: 0, behavior:"smooth" });
    } else {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const step = (card?.offsetWidth ?? 340) + 20;
      scrollRef.current.scrollBy({ left: step, behavior:"smooth" });
    }
  };

  return (
    <section
      id={collection.id}
      className="py-10 sm:py-14 lg:py-18 w-full relative z-10 flex flex-col justify-center px-0"
    >
      {/* Centered Heading matching luxury scale */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          {headerTitle || collection.title}
        </h2>
      </div>

      {/* 4-Column Product Cards Grid - END TO END (Full-Width Edge-to-Edge) with Exact 2px Gap */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] w-full items-start">
        {(gridProducts.length > 0 ? gridProducts : displayProducts).map((product, idx) => (
          <div key={`${product.id}-${product.slug || idx}`} className="w-full">
            <ModernProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Centered VIEW ALL Button */}
      <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12 px-4">
        <Link
          href={colId ==="all" ?"/shop" : `/shop?category=${colId ||"formal_bespoke"}`}
          className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white text-xs sm:text-[13px] font-bold tracking-[0.22em] px-10 sm:px-14 py-3 sm:py-3.5 rounded-full transition-all duration-300 uppercase shadow-sm hover:shadow-md active:scale-98"
        >
          VIEW ALL
        </Link>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { CollectionCategory, ProductItem } from "@/data/products";
import ModernProductCard from "./ModernProductCard";

interface ModernCollectionSectionProps {
  collection: CollectionCategory;
  products: ProductItem[];
  headerTitle?: string;
}

export default function ModernCollectionSection({
  collection,
  products,
  headerTitle,
}: ModernCollectionSectionProps) {

  return (
    <section
      id={collection.id}
      className="min-h-[100dvh] py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-10 w-full max-w-[1680px] mx-auto relative z-10 flex flex-col justify-center select-none"
    >
      {/* Centered Heading: LATEST DROP in serif luxury font */}
      <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-normal tracking-[0.08em] text-[#14110E] uppercase leading-tight">
          {headerTitle || collection.title}
        </h2>
      </div>

      {/* 4-Column Product Cards Grid with Tighter Gap */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4 xl:gap-4.5 w-full items-stretch"
      >
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="w-full">
            <ModernProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Centered VIEW ALL Button matching reference screenshot */}
      <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12">
        <Link
          href={collection.id === "all" ? "/shop" : `/shop?category=${collection.id}`}
          className="inline-flex items-center justify-center border border-[#4A202A] bg-transparent hover:bg-[#4A202A] text-[#4A202A] hover:text-[#FAF8F5] text-xs sm:text-sm font-semibold tracking-[0.22em] px-10 sm:px-14 py-2.5 sm:py-3 transition-all duration-300 uppercase shadow-xs hover:shadow-md rounded-2xl sm:rounded-full active:scale-98"
        >
          VIEW ALL
        </Link>
      </div>
    </section>
  );
}

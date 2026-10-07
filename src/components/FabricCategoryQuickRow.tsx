"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";

interface FabricCategoryQuickRowProps {
  onSelectCategory?: (categoryId: string) => void;
  activeCategoryId?: string;
}

export default function FabricCategoryQuickRow({
  onSelectCategory,
  activeCategoryId,
}: FabricCategoryQuickRowProps) {
  const c = useContent("fabricsPage");
  const categories = c.categoryQuickRow?.items ?? [];

  return (
    <section className="w-full py-8 sm:py-12 lg:py-14 my-2 sm:my-4 border-b border-[#D5C2AF]/60 bg-transparent select-none">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Horizontal Category Cards Scroll / Spread Row */}
        <div className="flex items-start gap-3.5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 overflow-x-auto pb-3 pt-1 scrollbar-none justify-start lg:justify-between">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;

            if (cat.isShopAll) {
              return (
                <Link
                  key={cat.id}
                  href={cat.link}
                  onClick={() => onSelectCategory && onSelectCategory("all")}
                  className="flex flex-col items-center group shrink-0 w-[84px] sm:w-[96px] md:w-[108px] lg:w-[118px] xl:w-[124px] cursor-pointer"
                >
                  {/* Shop All Outlined Square Box matching screenshot */}
                  <div className="w-full aspect-square rounded-[18px] sm:rounded-[22px] border-2 border-[#14110E] bg-white group-hover:bg-[#14110E] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:scale-105 active:scale-95">
                    <ArrowUpRight
                      size={28}
                      strokeWidth={1.75}
                      className="text-[#14110E] group-hover:text-white transition-colors duration-300"
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] sm:text-xs font-semibold text-[#14110E] group-hover:text-[#9E774C] transition-colors text-center mt-2.5 sm:mt-3 leading-snug">
                    {cat.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={cat.id}
                href={cat.link}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className="flex flex-col items-center group shrink-0 w-[84px] sm:w-[96px] md:w-[108px] lg:w-[118px] xl:w-[124px] cursor-pointer"
              >
                {/* Rounded Category Image Card */}
                <div
                  className={`relative w-full aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#E8DDD0] transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:scale-105 active:scale-95 ${
                    isActive
                      ? "ring-2 ring-[#9E774C] ring-offset-2 border-transparent"
                      : "border border-black/10 group-hover:border-black/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image || undefined}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle Gradient Shadow for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Category Label below image */}
                <span
                  className={`text-[11px] sm:text-xs text-center mt-2.5 sm:mt-3 leading-tight tracking-tight transition-colors ${
                    isActive
                      ? "font-bold text-[#9E774C]"
                      : "font-semibold text-[#14110E] group-hover:text-[#9E774C]"
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

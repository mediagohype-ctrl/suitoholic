"use client";

import React from "react";
import Link from "next/link";
import { useContent } from "@/context/SiteDataProvider";

export default function ShopByCategoryGrid() {
  const c = useContent("shopByCategory");
  const categoryItems = c.items ?? [];

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 my-10 sm:my-14 lg:my-18 select-none">
      {/* Title */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#14110E] tracking-[0.18em] uppercase">
          {c.heading}
        </h2>
        <div className="w-16 h-[1.5px] bg-[#9E774C] mx-auto mt-3" />
      </div>

      {/* 4-Column Editorial Portrait Grid (2 rows of 4 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {categoryItems.map((item, index) => (
          <Link
            key={`${index}-${item.title}`}
            href={item.href || "/shop"}
            className="group flex flex-col items-center cursor-pointer"
          >
            {/* Portrait Image Container */}
            <div className="relative w-full aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F2E8DF] shadow-xs group-hover:shadow-xl border border-black/5 transition-all duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>

            {/* Sub-label under card */}
            <span className="text-center font-bold text-[10.5px] sm:text-xs tracking-[0.2em] text-[#14110E] group-hover:text-[#9E774C] uppercase transition-colors pt-3.5 px-1">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

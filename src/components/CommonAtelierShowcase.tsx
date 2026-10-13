"use client";

import React from "react";
import AtelierEditorialBanner from "@/components/AtelierEditorialBanner";
import ShopByFabricsSection from "@/components/ShopByFabricsSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const ShowcaseDivider = () => (
  <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-6 sm:my-8 lg:my-10">
    <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
  </div>
);

export default function CommonAtelierShowcase() {
  return (
    <section className="w-full select-none" aria-label="Atelier Showcase & Reviews">
      <ShowcaseDivider />

      {/* 1. Behind The Scenes / Tailoring In Motion Video Banner */}
      <AtelierEditorialBanner />

      <ShowcaseDivider />

      {/* 2. Shop By Fabrics 3-Card Carousel */}
      <ShopByFabricsSection />

      <ShowcaseDivider />

      {/* 3. Customer Testimonials Reviews */}
      <TestimonialsSection />
    </section>
  );
}

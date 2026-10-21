"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface JourneyStep {
  stepNumber: string;
  romanNumeral?: string;
  title: string;
  description: string;
  tag: string;
  tagLink?: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    stepNumber: "1",
    romanNumeral: "I",
    title: "The Consultation",
    description:
      "We begin with a conversation — not measurements. Your occasion, your wardrobe, the way you move and the impression you intend to make. From this we shape the brief for your commission.",
    tag: "BY APPOINTMENT",
    tagLink: "#appointment-booking",
  },
  {
    stepNumber: "2",
    title: "Cloth Selection",
    description:
      "Handle the cloth in daylight. Choose from eighty-five exclusive weaves across Vitale Barberis Canonico, Pronto and GA.ZA.BA — then settle linings, buttons and every private detail.",
    tag: "THE COLLECTION",
    tagLink: "/fabrics",
  },
  {
    stepNumber: "3",
    title: "Measurement & Pattern",
    description:
      "Over twenty measurements are taken and a paper pattern is cut by hand — unique to you, kept on file, and refined with every garment you commission thereafter.",
    tag: "DRAFTED BY HAND",
  },
  {
    stepNumber: "4",
    title: "Cutting & Fittings",
    description:
      "The cloth is cut and basted, then shaped across a series of fittings. Full-canvas construction — never fused — allows the jacket to mould to you and improve with age.",
    tag: "TWO TO FOUR WEEKS",
  },
  {
    stepNumber: "5",
    title: "Delivery",
    description:
      "Your finished garment is pressed, inspected and presented. It remains in our care for life — alterations and pressing offered for as long as you wear it.",
    tag: "LIFETIME CARE",
  },
];

export default function BespokeJourneySection() {
  const handleScrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("appointment-booking");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="bespoke-journey"
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#ECEAE5] border-b border-[#E5E3DD] overflow-hidden select-none"
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header: Eyebrow + Luxury Serif Headline */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24 space-y-4">
          {/* Eyebrow with flanking delicate lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="w-8 sm:w-12 h-[1px] bg-[#8C7355]/50" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#726254]">
              THE JOURNEY
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[#8C7355]/50" />
          </div>

          {/* Headline */}
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-black leading-[1.12] tracking-tight">
            Five steps to a <span className="italic font-normal">singular</span> suit.
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-2xl sm:max-w-3xl mx-auto">
          {/* Continuous vertical timeline track running through node centers */}
          <div
            className="absolute left-[23.5px] sm:left-[27.5px] top-6 bottom-6 w-[1px] bg-[#D5D1C8]"
            aria-hidden="true"
          />

          {/* 5 Journey Steps */}
          {JOURNEY_STEPS.map((step) => {
            return (
              <div
                key={step.stepNumber}
                className="relative group pl-16 sm:pl-20 md:pl-24 pt-0.5 pb-12 sm:pb-16 lg:pb-20 last:pb-2 cursor-pointer transition-all duration-300"
              >
                {/* Circular Node centered on the vertical line */}
                <div
                  className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full text-base sm:text-lg font-serif-luxury bg-[#F7F5F0] text-black border border-[#D5D1C8] shadow-2xs group-hover:bg-black group-hover:text-white group-hover:border-black group-hover:scale-105 group-hover:shadow-md transition-all duration-300"
                >
                  <span className="select-none font-medium">
                    {step.romanNumeral || step.stepNumber}
                  </span>
                </div>

                {/* Step Content */}
                <div className="space-y-2.5 sm:space-y-3.5 pr-2 sm:pr-4">
                  {/* Title */}
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[32px] font-normal text-black group-hover:text-[#8C7355] transition-colors duration-300 leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs sm:text-[14.5px] lg:text-[15px] text-[#555555] font-normal leading-[1.8] max-w-xl">
                    {step.description}
                  </p>

                  {/* Sub-label / Tag */}
                  <div className="pt-1.5">
                    {step.tagLink ? (
                      step.tagLink.startsWith("#") ? (
                        <a
                          href={step.tagLink}
                          onClick={handleScrollToBooking}
                          className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#8C7355] hover:text-black transition-colors group/link cursor-pointer"
                        >
                          <span>{step.tag}</span>
                          <ArrowUpRight
                            size={12}
                            className="stroke-[2.2] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                          />
                        </a>
                      ) : (
                        <Link
                          href={step.tagLink}
                          className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#8C7355] hover:text-black transition-colors group/link cursor-pointer"
                        >
                          <span>{step.tag}</span>
                          <ArrowUpRight
                            size={12}
                            className="stroke-[2.2] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                          />
                        </Link>
                      )
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#8C7355]">
                        {step.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

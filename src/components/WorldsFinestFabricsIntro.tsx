"use client";

import React from "react";
import Link from "next/link";

export default function WorldsFinestFabricsIntro() {
  return (
    <section 
      aria-label="World's Finest Fabrics Atelier Preface"
      className="relative w-full bg-[#FFFFFF] text-[#14110E] py-14 sm:py-20 px-6 sm:px-10 lg:px-16 border-b border-[#DDD2D8]/70 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Right Breadcrumb Matching Reference */}
        <div className="flex justify-end">
          <nav aria-label="Breadcrumb" className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.26em] text-[#9E774C]">
            <Link href="/" className="hover:text-[#4A202A] transition-colors">
              SUITOHOLIC
            </Link>
            <span className="mx-2 text-[#DDD2D8]">&gt;</span>
            <span className="text-[#4A202A]">FABRICS</span>
          </nav>
        </div>

        {/* Centered Luxury Headline */}
        <div className="text-center pt-2 sm:pt-4">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-normal tracking-[0.16em] uppercase text-[#14110E] leading-tight">
            WORLDS FINEST FABRICS
          </h2>
        </div>

        {/* Centered Curated Editorial Narrative */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm sm:text-base md:text-[17px] text-[#55473A] leading-[1.85] sm:leading-[1.95] tracking-[0.015em] font-sans">
            We carry a hand-picked selection of the finest cloth like Wool, Cashmere, Linen, Cotton, Silk, Vicuna, Mohair, and their blends as well. These come from some of the best cloth mills in the world –{" "}
            <span className="font-semibold text-[#4A202A] tracking-wider">
              ERMENEGILDO ZEGNA, LORO PIANA, SCABAL, DORMEUIL, HOLLAND &amp; SHERRY, CERRUTI
            </span>{" "}
            and the likes. With an experience of more than 20 years in handling such variety of fabrics, team at Suitoholic is quite adept to guide you through the selection process. Latest trends in terms of color palettes, textures, weaves and blends are available to make sure that our range includes classic elegance as well as trendy styles from the ramps of Milan, London and New York.
          </p>
        </div>

        {/* Centered Hand-Drawn Atelier Fabric Roll & Tailoring Tools Illustration */}
        <div className="pt-4 sm:pt-6 flex justify-center items-center">
          <svg
            viewBox="0 0 180 84"
            className="w-28 sm:w-36 h-auto text-[#9E774C] opacity-90 transition-transform duration-300 hover:scale-105"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Fabric Bolt Core Left */}
            <ellipse cx="32" cy="38" rx="13" ry="20" stroke="#7A624E" />
            <ellipse cx="32" cy="38" rx="5" ry="8" stroke="#7A624E" />
            
            {/* Bolt Cylinder Horizontal Roll */}
            <line x1="32" y1="18" x2="116" y2="18" stroke="#7A624E" />
            <line x1="32" y1="58" x2="116" y2="58" stroke="#7A624E" />
            <path d="M 116 18 A 13 20 0 0 1 116 58" stroke="#7A624E" />
            
            {/* Draped Cloth Folds Unrolling Forward */}
            <path d="M 38 58 C 55 69, 102 75, 142 66 L 152 54 C 122 58, 85 52, 54 44" stroke="#9E774C" />
            <path d="M 64 61 C 92 68, 118 68, 138 63" stroke="#9E774C" strokeDasharray="1 2" />
            
            {/* Spool of Tailor's Thread Beside Roll */}
            <ellipse cx="72" cy="48" rx="7" ry="2.5" stroke="#4A202A" />
            <ellipse cx="72" cy="60" rx="7" ry="2.5" stroke="#4A202A" />
            <line x1="66" y1="48" x2="66" y2="60" stroke="#4A202A" />
            <line x1="78" y1="48" x2="78" y2="60" stroke="#4A202A" />
            <line x1="67" y1="51" x2="77" y2="51" stroke="#9E774C" />
            <line x1="67" y1="54" x2="77" y2="54" stroke="#9E774C" />
            <line x1="67" y1="57" x2="77" y2="57" stroke="#9E774C" />
            
            {/* Tailor's Needle Slanted Through Cloth */}
            <line x1="86" y1="36" x2="108" y2="64" stroke="#4A202A" strokeWidth="1.4" />
            {/* Needle Thread Looping Gently */}
            <path d="M 87 37 Q 84 30 92 28 Q 98 30 95 36" stroke="#9E774C" strokeWidth="0.9" />
          </svg>
        </div>

      </div>
    </section>
  );
}

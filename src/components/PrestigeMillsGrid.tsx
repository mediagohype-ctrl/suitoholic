"use client";

import React, { useState, useRef, useEffect } from "react";

interface MillItem {
  id: string;
  name: string;
  established?: string;
  origin: string;
  specialty: string;
  renderLogo: () => React.ReactNode;
}

const MILLS: MillItem[] = [
  // 1. SÖKTAŞ
  {
    id: "soktas",
    name: "SÖKTAŞ",
    established: "1971",
    origin: "Söke, Turkey",
    specialty: "Superfine Giza & Turkish Cotton",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <div className="flex items-center gap-1">
          <span className="font-serif italic text-2xl sm:text-3xl font-light text-[#14110E] leading-none transform -translate-y-0.5">
            S
          </span>
          <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-[0.24em] text-[#14110E] uppercase">
            ÖKTAŞ
          </span>
        </div>
        <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.22em] text-[#7A6B5D] uppercase font-sans mt-0.5">
          LUXURY SHIRTING COTTONS
        </span>
      </div>
    ),
  },

  // 2. ARISTON NAPOLI
  {
    id: "ariston",
    name: "ARISTON NAPOLI",
    established: "1920",
    origin: "Naples, Italy",
    specialty: "Neapolitan Sartorial Suiting",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#14110E] uppercase">
          ARISTON
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-[#9E774C] font-semibold uppercase font-sans mt-0.5">
          N A P O L I
        </span>
      </div>
    ),
  },

  // 3. THOMAS MASON
  {
    id: "thomas-mason",
    name: "THOMAS MASON",
    established: "1796",
    origin: "Lancashire, England",
    specialty: "British Royal Oxford & Twill",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <span className="font-sans text-sm sm:text-base font-extrabold tracking-[0.16em] text-[#14110E] uppercase">
          THOMAS MASON<sup className="text-[8px] font-normal">®</sup>
        </span>
        <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.2em] text-[#6B5A4D] uppercase font-mono mt-0.5">
          FOUNDED 1796
        </span>
        <span className="text-[7px] sm:text-[8px] tracking-[0.18em] text-[#8C7A6D] uppercase font-sans">
          NELSON LANCASHIRE ENGLAND
        </span>
      </div>
    ),
  },

  // 4. CACCIOPPOLI NAPOLI
  {
    id: "caccioppoli",
    name: "CACCIOPPOLI",
    established: "1920",
    origin: "Naples, Italy",
    specialty: "Artisanal Neapolitan Drape",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <span className="font-serif italic text-2xl sm:text-[28px] text-[#2C4866] font-normal leading-none tracking-wide">
          Caccioppoli
        </span>
        <span className="text-[8px] sm:text-[9px] italic text-[#5C728A] font-serif tracking-widest mt-1">
          a Napoli dal 1920
        </span>
      </div>
    ),
  },

  // 5. CERRUTI 1881
  {
    id: "cerruti",
    name: "CERRUTI 1881",
    established: "1881",
    origin: "Biella, Italy",
    specialty: "Prestige Wool & Cashmere",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.24em] text-[#14110E] uppercase">
          C E R R U T I
        </span>
        <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.26em] text-[#9E774C] font-semibold uppercase mt-0.5 font-sans">
          1881 • BIELLA
        </span>
      </div>
    ),
  },

  // 6. ALUMO SWISS
  {
    id: "alumo",
    name: "ALUMO",
    established: "1918",
    origin: "Appenzell, Switzerland",
    specialty: "Finest Swiss Two-Ply Cotton",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <div className="bg-[#4D6D85] text-white px-3 py-1.5 rounded-sm border border-[#3E5C72] shadow-2xs relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />
          <span className="relative z-10 font-mono text-xs sm:text-sm font-bold tracking-[0.38em] pl-1 uppercase text-[#FAF8F5]">
            ALUMO
          </span>
          <div className="border-t border-white/30 pt-0.5 mt-0.5">
            <span className="text-[6.5px] sm:text-[7.5px] tracking-[0.14em] uppercase text-white/90 font-sans block leading-none">
              MANUFACTURER OF FINEST SWISS COTTON
            </span>
          </div>
        </div>
      </div>
    ),
  },

  // 7. TESSITURA MONTI
  {
    id: "tessitura-monti",
    name: "TESSITURA MONTI",
    established: "1911",
    origin: "Treviso, Italy",
    specialty: "Italian Egyptian Giza Weaves",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <svg viewBox="0 0 60 22" className="w-12 h-auto text-[#8C6D47] mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 6 18 Q 15 2 24 16 Q 32 2 40 18 L 48 18 Q 54 8 56 12" />
        </svg>
        <span className="text-[9.5px] sm:text-[10.5px] font-sans font-bold tracking-[0.24em] text-[#14110E] uppercase">
          — TESSITURA MONTI —
        </span>
        <span className="text-[7.5px] sm:text-[8px] tracking-[0.22em] text-[#8C7A6D] uppercase font-mono mt-0.5">
          DAL 1911
        </span>
      </div>
    ),
  },

  // 8. REDA 1865
  {
    id: "reda",
    name: "REDA 1865",
    established: "1865",
    origin: "Biella, Italy",
    specialty: "Sustainable Merino Suiting",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <div className="flex items-center justify-center gap-0.5 text-[#14110E] mb-0.5">
          <svg viewBox="0 0 24 12" className="w-5 h-auto text-[#14110E]" fill="currentColor">
            <path d="M 2 10 L 4 3 L 8 7 L 12 2 L 16 7 L 20 3 L 22 10 Z" />
            <circle cx="4" cy="2" r="1.2" />
            <circle cx="12" cy="1" r="1.2" />
            <circle cx="20" cy="2" r="1.2" />
          </svg>
        </div>
        <span className="text-[8px] sm:text-[8.5px] tracking-[0.2em] font-serif text-[#6B5A4D]">
          1865
        </span>
        <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#14110E] uppercase leading-none">
          REDA
        </span>
      </div>
    ),
  },

  // 9. COTONIFICIO ALBINI
  {
    id: "albini",
    name: "COTONIFICIO ALBINI",
    established: "1876",
    origin: "Bergamo, Italy",
    specialty: "Sea Island & Royal Poplin",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <span className="font-serif italic text-base sm:text-lg text-[#14110E] font-medium leading-tight">
          Cotonificio Albini<sup className="text-[7px]">®</sup>
        </span>
        <span className="text-[7px] sm:text-[8px] text-[#9E774C] font-serif italic mb-0.5">
          1876
        </span>
        <span className="font-sans text-[9px] sm:text-[10px] font-extrabold tracking-[0.26em] text-[#14110E] uppercase">
          AMBASSADOR
        </span>
      </div>
    ),
  },

  // 10. MARZONI
  {
    id: "marzoni",
    name: "MARZONI",
    established: "1950",
    origin: "Biella, Italy",
    specialty: "Luxury Wool & Silk Blend",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <span className="font-sans text-base sm:text-lg lg:text-xl font-bold tracking-[0.24em] text-[#14110E] uppercase">
          MARZONI
        </span>
        <span className="text-[8px] sm:text-[9px] tracking-[0.28em] text-[#8C7A6D] uppercase font-sans mt-0.5">
          LANIFICIO IN BIELLA
        </span>
      </div>
    ),
  },

  // 11. VITALE BARBERIS CANONICO
  {
    id: "vitale-barberis-canonico",
    name: "VITALE BARBERIS CANONICO",
    established: "1663",
    origin: "Pratrivero, Italy",
    specialty: "World's Oldest Wool Mill",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <div className="flex items-center gap-1.5 text-[#9E774C] mb-0.5">
          <svg viewBox="0 0 36 8" className="w-8 h-auto" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M 0 4 Q 9 0 18 4 Q 27 8 36 4" />
          </svg>
        </div>
        <span className="font-serif-luxury text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.14em] text-[#14110E] uppercase leading-tight">
          VITALE BARBERIS CANONICO
        </span>
        <div className="flex items-center gap-2 text-[7.5px] sm:text-[8.5px] font-mono text-[#6B5A4D] mt-0.5">
          <span>X</span>
          <span>1663</span>
          <span>X</span>
        </div>
      </div>
    ),
  },

  // 12. HOLLAND & SHERRY
  {
    id: "holland-sherry",
    name: "HOLLAND & SHERRY",
    established: "1836",
    origin: "Savile Row, London",
    specialty: "Savile Row Bespoke Worsteds",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center select-none">
        <svg viewBox="0 0 30 14" className="w-6 h-auto text-[#14110E] mb-0.5" fill="currentColor">
          <path d="M 6 12 C 9 9, 15 8, 22 10 L 25 12 Z M 8 6 C 9 4, 12 3, 15 5 C 17 4, 21 5, 23 7 Z" />
        </svg>
        <span className="font-serif-luxury text-xs sm:text-sm lg:text-[15px] font-bold tracking-[0.16em] text-[#14110E] uppercase leading-tight">
          HOLLAND &amp; SHERRY
        </span>
        <span className="text-[7px] sm:text-[7.5px] tracking-[0.2em] text-[#8C7A6D] uppercase font-sans mt-0.5">
          THE FINEST CLOTHS IN THE WORLD
        </span>
      </div>
    ),
  },
];

interface ParallaxMillCardProps {
  mill: MillItem;
  index: number;
  scrollProgress: number;
}

function ParallaxMillCard({ mill, index, scrollProgress }: ParallaxMillCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  // Staggered column vertical parallax shift:
  // Each column glides at a distinct depth speed for authentic multi-layer 3D perspective
  const col = index % 4;
  const colSpeeds = [-36, 26, -22, 34];
  const colOffset = colSpeeds[col] * scrollProgress;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle 3D tilt (max +/- 8 degrees)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
    setSpotlight({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        transform: `translate3d(0, ${colOffset}px, 0)`,
        transition: isHovered ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      }}
      className="relative [perspective:1000px] z-10"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(18px) scale(1.02)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          boxShadow: isHovered
            ? "0 24px 48px -12px rgba(74, 32, 42, 0.16), 0 0 0 1px rgba(158, 119, 76, 0.45)"
            : "0 2px 10px -2px rgba(20, 17, 14, 0.05), 0 0 0 1px #DDD2D8",
        }}
        className="group relative bg-[#FAF6F8] hover:bg-white rounded-[6px] p-6 sm:p-8 min-h-[145px] sm:min-h-[165px] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 select-none border border-[#DDD2D8]/40"
      >
        {/* Dynamic Specular Spotlight Sheen */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[6px] transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 140px at ${spotlight.x}px ${spotlight.y}px, rgba(158, 119, 76, 0.18), transparent 80%)`,
            }}
          />
        )}

        {/* Ambient Top Glow Line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#9E774C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Mill Logo / Emblem with micro-elevation */}
        <div 
          style={{
            transform: isHovered ? "translateZ(24px)" : "translateZ(0px)",
            transition: "transform 0.2s ease-out",
          }}
          className="w-full flex items-center justify-center"
        >
          {mill.renderLogo()}
        </div>

        {/* Hover Provenance Badge */}
        <div className="absolute bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-[#9E774C] bg-white/95 px-2.5 py-0.5 rounded-full border border-[#DDD2D8] shadow-2xs">
            {mill.origin}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PrestigeMillsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!sectionRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          // Progress from -1 (entering viewport) to 1 (leaving viewport)
          const progress = ((windowHeight - rect.top) / (windowHeight + rect.height)) * 2 - 1;
          setScrollYProgress(Math.max(-1, Math.min(1, progress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({ x: relX * 20, y: relY * 20 });
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      aria-label="World-Renowned Textile Mills Partner Showcase"
      className="relative w-full bg-[#FFFFFF] py-14 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-[#DDD2D8]/70 select-none overflow-hidden"
    >
      {/* Background Floating Luxury Typography Parallax Stream (Layer 1) */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 sm:-top-12 left-0 w-full overflow-hidden opacity-[0.06] select-none"
        style={{
          transform: `translate3d(${scrollYProgress * -130 - mouseParallax.x * 1.5}px, ${scrollYProgress * 35 - mouseParallax.y}px, 0)`,
          willChange: "transform",
        }}
      >
        <span className="font-serif-luxury text-[130px] sm:text-[190px] lg:text-[230px] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-[#4A202A] block leading-none">
          SUITOHOLIC • SUITOHOLIC • SUITOHOLIC • SUITOHOLIC • SUITOHOLIC
        </span>
      </div>

      {/* Background Floating Luxury Monogram Stream (Layer 2 - Counter Parallax) */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 sm:-bottom-16 right-0 w-full overflow-hidden opacity-[0.05] select-none"
        style={{
          transform: `translate3d(${scrollYProgress * 130 + mouseParallax.x * 1.5}px, ${scrollYProgress * -35 + mouseParallax.y}px, 0)`,
          willChange: "transform",
        }}
      >
        <span className="font-serif-luxury text-[130px] sm:text-[190px] lg:text-[230px] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-[#9E774C] block leading-none">
          SUITOHOLIC • BESPOKE ATELIER • SUITOHOLIC • LUXURY FABRICS • SUITOHOLIC
        </span>
      </div>

      {/* Loom Thread Guide Lines (Parallax Depth Layer 3) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #9E774C 0, #9E774C 1px, transparent 1px, transparent 80px)",
          transform: `translate3d(${scrollYProgress * 20}px, 0, 0)`,
        }}
      />

      {/* Subtle Atmospheric Ambient Glow Orbs */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 bg-[#4A202A]/5 rounded-full blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseParallax.x * 1.2}px, ${scrollYProgress * 50 + mouseParallax.y}px, 0)`,
        }}
      />
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 bg-[#9E774C]/8 rounded-full blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${-mouseParallax.x * 1.2}px, ${scrollYProgress * -50 - mouseParallax.y}px, 0)`,
        }}
      />

      <div className="relative z-10 max-w-[1680px] mx-auto space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div 
          className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 px-4 transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(0, ${scrollYProgress * -10}px, 0)`,
          }}
        >
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold tracking-[0.14em] uppercase text-[#4A202A] leading-tight">
            OUR ESTEEMED TEXTILE PARTNERS
          </h2>

          <p className="text-sm sm:text-base md:text-[17px] text-[#55473A] font-normal leading-relaxed tracking-normal max-w-2xl mx-auto">
            Woven across historic centuries-old looms in Biella, Como, Lancashire, Naples &amp; Alexandria. Each mill represents the pinnacle of craftsmanship, yarn density, and timeless sartorial prestige.
          </p>
        </div>

        {/* 4-Column x 3-Row Grid with Column-Staggered Parallax & 3D Interactive Card Tilt */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-2 pb-4">
          {MILLS.map((mill, idx) => (
            <ParallaxMillCard
              key={mill.id}
              mill={mill}
              index={idx}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


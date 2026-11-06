"use client";

import React from"react";

interface TestimonialData {
  name: string;
  initials?: string;
  avatarColor: string;
  location: string;
  role: string;
  rating: number;
  date: string;
  text: string;
}

const TESTIMONIALS: TestimonialData[] = [
  {
    name:"Vikramaditya Singhania",
    initials:"VS",
    avatarColor:"#4285F4",
    location:"New Delhi",
    role:"Managing Partner, Singhania Capital",
    rating: 5,
    date:"4 days ago",
    text:"The fit around the shoulders and collar roll is unbelievable. Egyptian Giza 140s drape feels superior in every boardroom meeting. Hands down the finest bespoke tailoring experience in India.",
  },
  {
    name:"Devendra Kapoor",
    initials:"DK",
    avatarColor:"#EA4335",
    location:"Dubai, UAE",
    role:"Founder & CEO, Horizon Ventures",
    rating: 5,
    date:"1 week ago",
    text:"Ordered with French double cuffs and mother-of-pearl buttons. The split yoke, chest drape, and precision stitching are true hallmarks of master craftsmanship. Immaculate white-glove delivery.",
  },
  {
    name:"Arjun Mehta",
    initials:"AM",
    avatarColor:"#34A853",
    location:"Mumbai",
    role:"Senior Advocate, High Court",
    rating: 5,
    date:"2 weeks ago",
    text:"Finally a brand that understands sleeve pitch and waist tapering without multiple trial visits. The custom collar spread frames my tie knot like a painting. Outstanding quality.",
  },
  {
    name:"Callum MacLeod",
    initials:"CM",
    avatarColor:"#8C7355",
    location:"London, UK",
    role:"Director of Investment Strategy",
    rating: 5,
    date:"3 weeks ago",
    text:"Exceptional craftsmanship. The fabric texture in hand is vastly superior to Savile Row off-the-rack luxury houses. Calibrated my exact measurements flawlessly across continents.",
  },
  {
    name:"Aditi Verma",
    initials:"AV",
    avatarColor:"#8B5CF6",
    location:"Bengaluru",
    role:"Creative Director & Stylist",
    rating: 5,
    date:"1 month ago",
    text:"Honestly surprised by the fabric quality. It's lightweight, breathable, and gives that rich satin luster without looking loud. Perfect for executive meetings and evening dinners alike.",
  },
  {
    name:"Avni Singh",
    initials:"AS",
    avatarColor:"#0D9488",
    location:"Abu Dhabi",
    role:"Luxury Lifestyle Consultant",
    rating: 5,
    date:"1 month ago",
    text:"So flattering and comfortable! Wore it for an exclusive preview gala in Abu Dhabi and received endless compliments. The fit is on point and the cloth drape is truly world-class.",
  },
  {
    name:"Rajeshwar Malhotra",
    initials:"RM",
    avatarColor:"#1A365D",
    location:"New Delhi",
    role:"Executive Chairman, Malhotra Holdings",
    rating: 5,
    date:"1 month ago",
    text:"The paper pattern drafted specifically for my posture made all the difference. No pulling at the chest, no sagging at the shoulders. A genuine bespoke house upholding Savile Row standards.",
  },
  {
    name:"Priyanka Yadav",
    initials:"PY",
    avatarColor:"#EC4899",
    location:"Singapore",
    role:"Head of Private Wealth",
    rating: 5,
    date:"2 months ago",
    text:"The hand-feel of this bespoke fabric is divine. The print clarity, shoulder structure, and natural fall make it effortless to wear for long days across Asia. Simply unmatched.",
  },
  {
    name:"Rohan Oberoi",
    initials:"RO",
    avatarColor:"#2563EB",
    location:"Mumbai",
    role:"Managing Director, Equitas Partners",
    rating: 5,
    date:"2 months ago",
    text:"Tailored to absolute perfection. The attention given to the collar height, armhole comfort, and cuff closure proves their master cutters are among the best in the bespoke trade.",
  },
  {
    name:"Dia Ajmera",
    initials:"DA",
    avatarColor:"#D97706",
    location:"Hyderabad",
    role:"Architect & Design Principal",
    rating: 5,
    date:"2 months ago",
    text:"A total masterpiece. The geometric jacquard weave looks regal and the tailored fit sits perfectly on the shoulders. Unmatched attention to every single detail from cloth to finish.",
  },
  {
    name:"Siddharth Singhal",
    initials:"SS",
    avatarColor:"#059669",
    location:"Gurgaon, Delhi NCR",
    role:"VP of Global Product Strategy",
    rating: 5,
    date:"3 months ago",
    text:"I commissioned 5 bespoke dress shirts for my European conference tour. Each piece fits like second skin. Never going back to ready-to-wear shirts again.",
  },
  {
    name:"Kunal Varma",
    initials:"KV",
    avatarColor:"#7C3AED",
    location:"London, UK",
    role:"Partner, Varma & Co. Solicitors",
    rating: 5,
    date:"3 months ago",
    text:"Incredible attention to proportion and balance. The collar roll under a tailored suit jacket is pristine. White-glove doorstep delivery was swift and impeccably packaged.",
  },
];

// Helper to partition testimonials evenly into N columns
function getColumns(count: number) {
  return Array.from({ length: count }, (_, colIndex) =>
    TESTIMONIALS.filter((_, itemIndex) => itemIndex % count === colIndex)
  );
}

const layouts = [
  { className:"flex md:hidden", columns: getColumns(1), speeds: ["animate-vertical-fast"] },
  { className:"hidden md:flex lg:hidden", columns: getColumns(2), speeds: ["animate-vertical-medium","animate-vertical-slow"] },
  { className:"hidden lg:flex", columns: getColumns(3), speeds: ["animate-vertical-fast","animate-vertical-slow","animate-vertical-medium"] },
];

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function ReviewCard({ item }: { item: TestimonialData }) {
  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-[18px] border border-[#E8E5DF] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)] max-w-[370px] w-full flex flex-col gap-3.5 transition-all duration-300 hover:border-[#8C7355]/40 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(140,115,85,0.12),0_2px_8px_rgba(0,0,0,0.04)] text-left">
      {/* Top Star Rating & Date Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[#FBBC05]">
          {Array.from({ length: item.rating }).map((_, i) => (
            <span key={i} className="text-base leading-none">
              ★
            </span>
          ))}
        </div>
        <span className="text-[11px] sm:text-xs text-[#8B8D97] font-medium">
          {item.date}
        </span>
      </div>

      {/* Testimonial Quote */}
      <p className="text-[13.5px] sm:text-[14.5px] text-[#2D3139] leading-[1.62] font-normal m-0">
        “{item.text}”
      </p>

      {/* Reviewer Meta: Avatar + Google Badge + Name & Role */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#F0ECE6]">
        {/* Avatar with Google Verified Badge Overlay */}
        <div className="relative shrink-0">
          <div
            style={{ backgroundColor: item.avatarColor }}
            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm tracking-[0.02em] shadow-[0_2px_6px_rgba(0,0,0,0.12)] shrink-0"
          >
            {item.initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
            <GoogleIcon size={11} />
          </div>
        </div>

        {/* Name and Designation */}
        <div className="min-w-0 flex-1">
          <div className="font-bold text-[14px] sm:text-[15px] text-[#11121E] tracking-tight leading-snug truncate">
            {item.name}
          </div>
          <div className="text-[11.5px] sm:text-xs text-[#666666] leading-tight truncate mt-0.5">
            {item.role} · <span className="text-[#8C7355] font-medium">{item.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeColumn({
  items,
  speedClass,
}: {
  items: TestimonialData[];
  speedClass: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center overflow-hidden">
      <div className={`flex flex-col gap-5 pb-5 ${speedClass} hover:[animation-play-state:paused]`}>
        {/* Render twice for seamless continuous infinite loop */}
        {items.map((item, idx) => (
          <ReviewCard key={`col1-${idx}-${item.name}`} item={item} />
        ))}
        {items.map((item, idx) => (
          <ReviewCard key={`col2-${idx}-${item.name}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] overflow-hidden border-t border-b border-[#E8E5DF]"
    >
      {/* Ambient Radial Glow in Center */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(140,115,85,0.07)_0%,transparent_70%)] blur-[120px] pointer-events-none z-0"
      />

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Clean Minimalist Title */}
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-10 sm:mb-14 text-center">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight m-0">
            The Trust We Have Earned
          </h2>
        </div>

        {/* Multi-Column Vertical Infinite Scrolling Wall with Smooth Fade Masks */}
        <div
          className="relative flex justify-center gap-6 max-h-[720px] max-sm:max-h-[380px] overflow-hidden"
          style={{
            maskImage:"linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:"linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {layouts.map((layout, lIdx) => (
            <div
              key={lIdx}
              className={`w-full justify-center gap-6 ${layout.className}`}
            >
              {layout.columns.map((colItems, cIdx) => (
                <MarqueeColumn
                  key={cIdx}
                  items={colItems}
                  speedClass={layout.speeds[cIdx % layout.speeds.length]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

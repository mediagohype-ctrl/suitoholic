"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How does the custom fit and sizing algorithm work?",
    answer:
      "We utilize an intelligent 40-point measurement calibration algorithm. Simply select your chest size, height, and fit silhouette (Slim, Tailored, or Classic), and our master tailors draft an individualized digital pattern tailored to your posture, shoulder slope, and collar preference without needing a tape measure.",
  },
  {
    question: "Can I customize collar styles, cuffs, and personalized monograms?",
    answer:
      "Absolutely. For every shirt, you can select your preferred collar spread (Cutaway, Classic English Spread, Button-Down), cuff style (French Double Cuff or Single Mitred), genuine Australian Mother-of-Pearl buttons, and add complimentary personalized cuff monogram embroidery with your initials.",
  },
  {
    question: "What fabrics and yarn thread-counts do you use?",
    answer:
      "We source exclusively from world-renowned heritage mills. Our lineup features pure 100% Egyptian Giza 140s/2-ply long-staple cotton, rare West Indian Sea Island cotton, 100% pure European linens, and high-lustre royal dobby weaves that offer unmatched breathability, drape, and enduring crispness.",
  },
  {
    question: "How long does bespoke tailoring and delivery take?",
    answer:
      "Each shirt is individualized and handcrafted in our master atelier. Crafting takes 3–5 business days, followed by complimentary insured express delivery (2–4 days across all major pin-codes in India). You receive live tracking updates via WhatsApp and email upon dispatch.",
  },
  {
    question: "What is Suitoholic's 100% Perfect Fit Guarantee?",
    answer:
      "Your confidence is our highest priority. If your first bespoke garment does not fit exactly as expected, our concierge team will arrange a complimentary adjustment or a full remake at zero additional cost within 30 days of delivery.",
  },
  {
    question: "Do you offer Cash on Delivery (COD) and international shipping?",
    answer:
      "Yes! Cash on Delivery (COD) is available across all eligible pin codes in India alongside UPI, Credit/Debit cards, and Net Banking. We also ship worldwide via DHL Express with duties prepaid options.",
  },
  {
    question: "How should I care for and wash my bespoke shirts?",
    answer:
      "We recommend cold machine wash or hand wash with mild luxury detergent. Always remove the removable brass collar stays prior to laundering. Hang dry in shade and iron while the fabric is slightly damp for a pristine, crisp finish.",
  },
  {
    question: "Can I alter or change my order details after placing it?",
    answer:
      "Yes, you may modify collar, monogram, or measurement details within 24 hours of placing your order by connecting with our WhatsApp Concierge before fabric cutting begins.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<{ [key: number]: boolean }>({});
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el: HTMLDivElement | null, index: number) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({ ...prev, [index]: true }));
            observer.unobserve(el);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 xl:px-14 w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center select-none overflow-x-clip">
      {/* Header: Title Only (Single Line) */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 w-full max-w-5xl mx-auto px-2">
        <h2 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-bold tracking-[0.10em] sm:tracking-[0.16em] lg:tracking-[0.18em] text-[#4A202A] uppercase leading-tight whitespace-nowrap">
          FREQUENTLY ASKED QUESTIONS
        </h2>
      </div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto w-full space-y-3.5 sm:space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          const isFromLeft = index % 2 === 0;
          const isVisible = !!visibleItems[index];

          return (
            <div
              key={`${faq.question}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              style={{
                transitionDelay: isVisible ? `${(index % 4) * 90}ms` : "0ms",
              }}
              className={`bg-white rounded-[6px] border overflow-hidden transform transition-[transform,opacity,border-color,box-shadow] duration-700 ease-out ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : isFromLeft
                  ? "-translate-x-20 sm:-translate-x-32 opacity-0"
                  : "translate-x-20 sm:translate-x-32 opacity-0"
              } ${
                isOpen
                  ? "border-[#4A202A]/40 shadow-md ring-1 ring-[#4A202A]/10"
                  : "border-[#E8DFD5] hover:border-[#D5C6B7] shadow-2xs"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between text-left gap-4 cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span
                  className={`text-sm sm:text-base font-semibold tracking-tight transition-colors duration-300 ${
                    isOpen
                      ? "text-[#4A202A]"
                      : "text-[#1C1815] group-hover:text-[#4A202A]"
                  }`}
                >
                  {faq.question}
                </span>

                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ease-out ${
                    isOpen
                      ? "bg-[#4A202A] text-white rotate-180"
                      : "bg-[#F7F2EC] text-[#665749] group-hover:bg-[#ECE3D8]"
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {/* Smooth & Slow Height + Opacity Transition */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-7 pb-5 sm:pb-6 text-xs sm:text-sm text-[#5C4F44] leading-relaxed border-t border-[#F2ECE5] pt-3.5 font-normal">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Concierge Assistance Card */}
      <div className="mt-12 sm:mt-16 max-w-4xl mx-auto w-full bg-[#FAF5EE] border border-[#E5DDD2] rounded-[8px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xs">
        <div className="space-y-1">
          <div className="text-[#9E774C] text-xs font-bold tracking-widest uppercase">
            <span>PERSONAL ATELIER STYLIST</span>
          </div>
          <h4 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#4A202A] tracking-wide">
            Still Have Questions About Your Bespoke Fit?
          </h4>
          <p className="text-xs sm:text-sm text-[#6E5D4F]">
            Our master tailors and concierge are ready to assist you via WhatsApp or Email.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <a
            href="https://wa.me/919999999999?text=Hello%20Suitoholic%20team,%20I%20have%20a%20question%20about%20bespoke%20sizing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BE5B] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:scale-103 active:scale-97 cursor-pointer"
          >
            <MessageCircle size={15} />
            <span>WHATSAPP CONCIERGE</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F3ECE4] text-[#4A202A] border border-[#E0D5C7] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-2xs cursor-pointer"
          >
            <Mail size={15} />
            <span>CONTACT US</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

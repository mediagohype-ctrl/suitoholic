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
    question: "What is Suitoholic?",
    answer: "Suitoholic is a clothing and tailoring brand focused on premium fabrics, craftsmanship, and fit, with online shopping and fitting options available through suitoholic.shop.",
  },
  {
    question: "How do I choose my size?",
    answer: "Simply select your favourite shirt on Suitoholic.shop and follow our simple 6-step sizing process to find the perfect fit according to your body type, height and preferences.",
  },
  {
    question: "Can I customize my fit?",
    answer: "Where customization is offered, follow the options available on the product page and submit the requested details carefully.",
  },
  {
    question: "How long does delivery take?",
    answer: "Proposed estimates: ready-made orders dispatch in 2–5 business days, customized orders in 7–15 business days, followed by estimated courier delivery of 3–7 business days.",
  },
  {
    question: "Can I return or exchange an item?",
    answer: "Returns or exchanges are accepted only for wrong products delivered or eligible size issues, within 7 days of delivery, subject to the conditions in our Return & Exchange Policy. Customized products may have different conditions. Please read the full policy and contact us for assistance.",
  },
  {
    question: "What if my order is damaged or incorrect?",
    answer: "Contact us as soon as possible with your order details and clear photos. Our team will review the issue and guide you through the appropriate resolution, subject to applicable law.",
  },
  {
    question: "How do I track my order?",
    answer: "Tracking details will be shared once your order is dispatched, when tracking is available.",
  },
  {
    question: "Do you deliver across India?",
    answer: "Delivery availability is shown during checkout or confirmed by our team, depending on the destination.",
  },
  {
    question: "Will product colours look exactly the same?",
    answer: "Colours may look slightly different due to screen display, lighting, or photography.",
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
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 xl:px-14 w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center overflow-x-clip">
      {/* Header: Title */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 w-full max-w-5xl mx-auto px-4">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
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
              className={`bg-white rounded-[12px] border overflow-hidden transform transition-[transform,opacity,border-color,box-shadow] duration-700 ease-out ${isVisible
                  ? "translate-x-0 opacity-100"
                  : isFromLeft
                    ? "-translate-x-20 sm:-translate-x-32 opacity-0"
                    : "translate-x-20 sm:translate-x-32 opacity-0"
                } ${isOpen
                  ? "border-black/40 shadow-sm ring-1 ring-black/10"
                  : "border-[#E5E3DD] hover:border-black/30 shadow-2xs"
                }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between text-left gap-4 cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span
                  className={`text-sm sm:text-base font-semibold tracking-tight transition-colors duration-300 ${isOpen
                      ? "text-black"
                      : "text-black group-hover:opacity-75"
                    }`}
                >
                  {faq.question}
                </span>

                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ease-out ${isOpen
                      ? "bg-black text-white rotate-180"
                      : "bg-[#F5F4F0] text-black group-hover:bg-[#EBE9E4]"
                    }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {/* Smooth & Slow Height + Opacity Transition */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out overflow-hidden ${isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-7 pb-5 sm:pb-6 text-xs sm:text-sm text-[#666666] leading-relaxed border-t border-[#E5E3DD] pt-3.5 font-normal">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Concierge Assistance Card */}
      <div className="mt-12 sm:mt-16 max-w-4xl mx-auto w-full bg-white border border-[#E5E3DD] rounded-[16px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
        <div className="space-y-1">
          <div className="text-black text-xs font-bold tracking-widest uppercase">
            <span>PERSONAL ATELIER STYLIST</span>
          </div>
          <h4 className="font-serif-luxury text-lg sm:text-xl font-bold text-black tracking-wide">
            Still Have Questions About Your Bespoke Fit?
          </h4>
          <p className="text-xs sm:text-sm text-[#666666]">
            Our master tailors and concierge are ready to assist you via WhatsApp or Email.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <a
            href="https://wa.me/919979938022?text=Hello%20Suitoholic%20team,%20I%20have%20a%20question%20about%20bespoke%20sizing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BE5B] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:scale-103 active:scale-97 cursor-pointer"
          >
            <MessageCircle size={15} />
            <span>WHATSAPP CONCIERGE</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-black text-black hover:text-white border border-[#E5E3DD] hover:border-black px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-2xs cursor-pointer"
          >
            <Mail size={15} />
            <span>CONTACT US</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

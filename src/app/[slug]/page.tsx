"use client";

import React, { useState, useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { AlertCircle, CheckCircle2, ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import { useContent } from "@/context/SiteDataProvider";
import { apiFetch } from "@/lib/api";

/** Renders the lightweight "## heading / - bullet / paragraph" format used by info pages. */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-sm leading-relaxed text-[#444444]">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        return (
          <div key={i} className="space-y-2">
            {lines.map((line, j) => {
              if (line.startsWith("## "))
                return (
                  <h2 key={j} className="font-serif-luxury text-xl text-black uppercase tracking-wide pt-2 font-bold">
                    {line.slice(3)}
                  </h2>
                );
              if (line.startsWith("- "))
                return (
                  <p key={j} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-black font-medium">
                    {line.slice(2)}
                  </p>
                );
              return <p key={j}>{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function FaqAccordion({ text }: { text: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Parse questions from markdown body (## Question\nAnswer)
  const parsedSections = useMemo(() => {
    const rawBlocks = text.split(/\n\s*##\s+/).filter(Boolean);
    const list: { q: string; a: string }[] = [];

    rawBlocks.forEach((b) => {
      const clean = b.startsWith("## ") ? b.slice(3) : b;
      const parts = clean.split("\n");
      const question = parts[0]?.trim();
      const answer = parts.slice(1).join("\n").trim();
      if (question && answer) {
        list.push({ q: question, a: answer });
      }
    });

    // Curated bespoke concierge FAQs
    const defaultCurated = [
      {
        q: "How does the 30-Day Perfect Fit Guarantee work?",
        a: "If your custom garment doesn't fit flawlessly upon arrival, our master tailors provide complimentary alterations or a remake within 30 days of delivery. Reach out to concierge@suitoholic.com with photos.",
      },
      {
        q: "What payment methods are supported?",
        a: "We accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM), Net Banking, and Partial Cash on Delivery (a 25% advance commitment with the balance settled upon doorstep delivery).",
      },
      {
        q: "What fabrics do you use?",
        a: "We curate 100% certified Egyptian Giza Cotton, American Supima Cotton, Normandy Linen, and Australian Merino wool sourced from heritage mills including Albini, Thomas Mason, and Monti.",
      },
      {
        q: "Can I customize the collar, cuffs, and monogram?",
        a: "Yes. Every shirt can be customized with 8 collar variants, 4 cuff profiles, placket styles, back darts, and personalized monogram embroidery in gold, white, or tonal silk thread.",
      },
      {
        q: "How long does tailoring and delivery take?",
        a: "Each bespoke piece is precision cut and handcrafted individually. Standard dispatch takes 7–10 business days, followed by complimentary insured courier delivery across India.",
      },
    ];

    // Merge without duplicates
    const combined = [...list];
    defaultCurated.forEach((c) => {
      if (!combined.some((item) => item.q.toLowerCase() === c.q.toLowerCase())) {
        combined.push(c);
      }
    });

    return combined;
  }, [text]);

  return (
    <div className="space-y-3">
      {parsedSections.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen ? "bg-white border-black/40 shadow-sm" : "bg-white/90 border-[#E5E3DD] hover:border-black/20"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full text-left px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FAF9F6] border border-[#E5E3DD] text-[#8C7355] text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-serif-luxury text-base sm:text-lg font-bold text-black tracking-wide">
                  {item.q}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-black shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-[#555555] leading-relaxed border-t border-[#F5F4F0] animate-in fade-in duration-150">
                <p className="whitespace-pre-line">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const inputClass =
  "w-full bg-[#F5F4F0] border border-[#E5E3DD] rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-black placeholder:text-[#999999]";

function ContactForm() {
  const { contactForm: c } = useContent("infoPages");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      await apiFetch("/inquiries", { method: "POST", body: { type: "contact", ...form } });
      setState("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <div className="flex items-center gap-2 bg-emerald-800 text-white rounded-2xl p-4 text-sm font-semibold">
        <CheckCircle2 size={18} /> {c.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 space-y-5 shadow-sm">
      <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase text-black">{c.heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">{c.nameLabel}</span>
          <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">{c.emailLabel}</span>
          <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">{c.phoneLabel}</span>
        <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">{c.messageLabel}</span>
        <textarea required rows={5} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </label>
      {error && (
        <p role="alert" className="flex items-center gap-2 text-xs font-semibold text-rose-600">
          <AlertCircle size={14} /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-white py-4 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-sm hover:shadow cursor-pointer"
      >
        {state === "sending" ? c.sendingLabel : c.submitLabel}
      </button>
    </form>
  );
}

export default function InfoPage() {
  const params = useParams();
  const slug = String(params?.slug ?? "");
  const { pages } = useContent("infoPages");
  const page = pages.find((p) => p.slug === slug);
  if (!page) notFound();

  const isFaq = slug === "faq";

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title}>
      <div className="max-w-3xl mx-auto space-y-8">
        {page.intro && <p className="text-center text-base text-[#666666]">{page.intro}</p>}

        {isFaq ? (
          <FaqAccordion text={page.body} />
        ) : (
          <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-sm">
            <RichText text={page.body} />
          </div>
        )}

        {page.showContactForm && <ContactForm />}
      </div>
    </PageShell>
  );
}

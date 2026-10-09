"use client";

import React, { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import { useContent } from "@/context/SiteDataProvider";
import { apiFetch } from "@/lib/api";

/** Renders the lightweight "## heading / - bullet / paragraph" format used by info pages. */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-sm leading-relaxed text-[#3D332A]">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        return (
          <div key={i} className="space-y-2">
            {lines.map((line, j) => {
              if (line.startsWith("## "))
                return (
                  <h2 key={j} className="font-serif-luxury text-xl text-[#14110E] uppercase tracking-wide pt-2">
                    {line.slice(3)}
                  </h2>
                );
              if (line.startsWith("- "))
                return (
                  <p key={j} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[#9E774C]">
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

const inputClass =
  "w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-sm text-[#14110E] focus:outline-none focus:ring-2 focus:ring-[#9E774C]";

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
      <div className="flex items-center gap-2 bg-[#2D6A4F] text-white rounded-xl p-4 text-sm font-semibold">
        <CheckCircle2 size={18} /> {c.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase">{c.heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{c.nameLabel}</span>
          <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{c.emailLabel}</span>
          <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{c.phoneLabel}</span>
        <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </label>
      <label className="block space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{c.messageLabel}</span>
        <textarea required rows={5} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </label>
      {error && (
        <p role="alert" className="flex items-center gap-2 text-xs font-semibold text-[#B23B3B]">
          <AlertCircle size={14} /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full bg-[#14110E] hover:bg-[#2A231D] disabled:opacity-60 text-white py-3.5 rounded-xl text-xs font-bold tracking-[0.16em] uppercase"
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

  return (
    <PageShell eyebrow={page.eyebrow} title={page.title}>
      <div className="max-w-3xl mx-auto space-y-8">
        {page.intro && <p className="text-center text-base text-[#55473B]">{page.intro}</p>}
        <RichText text={page.body} />
        {page.showContactForm && <ContactForm />}
      </div>
    </PageShell>
  );
}

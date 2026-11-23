import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

const THREAD_COLORS = [
  { value: "burgundy", label: "Red", color: "#9F1025", swatch: "#99061B" },
  { value: "dark_blue", label: "Dark Blue", color: "#102D59", swatch: "#12274D" },
  { value: "black", label: "Black", color: "#171719", swatch: "#222127" },
  { value: "silver", label: "Grey", color: "#77777A", swatch: "#737273" },
  { value: "gold", label: "Golden", color: "#B87922", swatch: "#B67B2E" },
  { value: "white", label: "White", color: "#FFFFFF", swatch: "#DADAE0" },
];

export const DEFAULT_INITIALS_THREAD = "dark_blue";

function getThreadColor(value: string) {
  return THREAD_COLORS.find((thread) => thread.value === (value || DEFAULT_INITIALS_THREAD)) ?? THREAD_COLORS[1];
}

export function getInitialsThreadLabel(value: string) {
  return getThreadColor(value).label;
}

export function InitialsCuffPreview({ initials, threadColor, cuffId, className = "" }: { initials: string; threadColor: string; cuffId: string; className?: string }) {
  const cufflink = cuffId === "cufflink";
  const thread = getThreadColor(threadColor);

  return (
    <div className={`@container relative isolate aspect-[3.25] overflow-hidden bg-[#AD927A] ${className}`}>
      <Image key={cuffId} src={`/customizer/initials/${cufflink ? "cufflink" : "classic"}-preview.webp`} alt={cufflink ? "White double-fold cuff with a black and gold cufflink" : "White classic cuff with a single button"} fill loading="eager" unoptimized className="object-cover" />
      <span className={`font-playfair absolute top-[48%] left-[42%] -translate-1/2 rotate-[20deg] leading-none font-extrabold tracking-[0.035em] ${initials.length > 2 ? "text-[5.1cqw]" : "text-[6.4cqw]"}`} style={{ color: thread.color, textShadow: "0 0.55px 0.65px #3F2F2866, 0 -0.3px 0.65px #4C403866" }}>
        {initials}
      </span>
    </div>
  );
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-playfair flex items-center gap-2 font-bold tracking-[0.105em] text-[#FFF7EC] uppercase before:h-px before:flex-1 before:bg-[#B5A47A] after:h-px after:flex-1 after:bg-[#B5A47A]">
      <span className="rounded-full bg-linear-to-b from-[#BC8236] to-[#92591B] px-4 py-1 text-[10px] leading-tight shadow-[inset_0_1px_1px_#FAD7A854,0_1px_2px_#74451426] sm:px-6 sm:text-xs">
        {children}
      </span>
    </div>
  );
}

interface InitialsPanelProps {
  id: string;
  initials: string;
  threadColor: string;
  cuff: { title: string; id: string };
  cuffOptions: readonly { title: string; id: string }[];
  onCuffChange: (cuffStyle: string) => void;
  onInitialsChange: (initials: string) => void;
  onThreadChange: (color: string) => void;
}

export default function InitialsPanel({ id, initials, threadColor, cuff, cuffOptions, onCuffChange, onInitialsChange, onThreadChange }: InitialsPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const selectedThread = getThreadColor(threadColor);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <section ref={panelRef} id={`${id}-panel`} aria-labelledby={`${id}-heading`} className="space-y-2 rounded-[19px] border border-[#E9D6C5] bg-[radial-gradient(ellipse_at_top,#FFF9F3,#FAEDE1)] px-2.5 py-2.5 shadow-[inset_0_1px_1px_#FFFFFF,0_2px_8px_#70472A10] sm:px-3.5">
      <header className="text-center">
        <p className="font-playfair flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.3em] text-[#23180E] before:h-px before:w-8 before:bg-[#AD9D77] after:h-px after:w-8 after:bg-[#AD9D77] sm:text-xs">
          SUITOHOLIC™
        </p>
        <h4 id={`${id}-heading`} className="font-playfair text-2xl leading-tight font-bold text-[#21170F] sm:text-[32px]">
          Add Your <span className="font-script ml-1 text-[1.45em] leading-none font-normal text-[#9A611E]">Initials</span>
        </h4>
        <p className="font-playfair mt-0.5 text-[11px] font-semibold text-[#382820] italic sm:text-[13px]">
          Personalize your shirt with your initials on the cuff.
        </p>
      </header>

      <div className="space-y-1">
        <SectionDivider><label htmlFor={`${id}-monogram`}>Enter Your Initials</label></SectionDivider>
        <div className="mx-1 flex items-center rounded-xl border border-[#AE9C80] bg-linear-to-b from-[#FEF8F1] to-[#F9EDE1] shadow-[inset_0_1px_2px_#FFFFFF,0_2px_4px_#7B53332E] focus-within:border-[#806749] focus-within:ring-1 focus-within:ring-[#B88243]/45 sm:mx-2">
          <input
            id={`${id}-monogram`}
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={4}
            value={initials}
            onChange={(event) => onInitialsChange(event.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4))}
            aria-describedby={`${id}-limit`}
            className="font-playfair h-10 min-w-0 flex-1 bg-transparent px-3 text-xl font-bold tracking-[0.2em] text-[#1F1A17] outline-none sm:h-11 sm:px-5 sm:text-2xl"
          />
          <span id={`${id}-limit`} className="font-playfair shrink-0 pr-2.5 text-[10px] text-[#67574D] italic sm:pr-3.5 sm:text-xs">(Max 4 Letters)</span>
        </div>
      </div>

      <div className="space-y-1" role="radiogroup" aria-labelledby={`${id}-thread`}>
        <SectionDivider><span id={`${id}-thread`}>Choose Thread Color</span></SectionDivider>
        <div className="mx-1 grid grid-cols-6 gap-1 sm:mx-2 sm:gap-1.5">
          {THREAD_COLORS.map((thread) => (
            <label key={thread.value} className="font-playfair flex min-w-0 cursor-pointer flex-col items-center gap-1 rounded-[10px] border border-[#EAD8C8] bg-linear-to-b from-[#FFF9F4] to-[#F5E4D4] px-0.5 py-1 text-center text-[8px] leading-tight font-bold tracking-wide text-[#2B1A12] uppercase shadow-[inset_0_1px_1px_#FFFFFF,0_2px_4px_#70472A23] has-checked:border-[#522922] has-checked:ring-1 has-checked:ring-[#522922] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#A76C36] sm:gap-1.5 sm:px-1.5 sm:py-1.5 sm:text-[10px]">
              <input type="radio" name={`${id}-thread-colors`} value={thread.value} checked={selectedThread.value === thread.value} onChange={() => onThreadChange(thread.value)} className="sr-only" />
              <span aria-hidden="true" className="relative isolate aspect-[1.5] w-full overflow-hidden rounded-md border border-black/10 shadow-inner sm:rounded-lg" style={{ backgroundColor: thread.swatch }}>
                <Image src="/customizer/initials/thread-texture.webp" alt="" fill unoptimized className="object-cover mix-blend-overlay" />
              </span>
              <span className="flex flex-1 items-center">{thread.label}</span>
            </label>
          ))}
        </div>
      </div>

      <figure>
        <SectionDivider>Preview</SectionDivider>
        <InitialsCuffPreview initials={initials} threadColor={threadColor} cuffId={cuff.id} className="mt-1 rounded-[14px] sm:rounded-[17px]" />
        <figcaption className="font-playfair relative mx-auto -mt-2.5 w-fit max-w-full rounded-full bg-linear-to-b from-[#FDF0E4] to-[#F4E0CD] px-3 py-0.5 text-[9px] font-bold tracking-wider text-[#2F2117] shadow-[0_1px_3px_#50321926] focus-within:ring-2 focus-within:ring-[#A76C36] sm:px-5 sm:text-[10px]">
          <span aria-hidden="true" className="flex items-center justify-center gap-1.5 text-center">
            {cuff.title}
            <ChevronDown className="size-3 shrink-0" />
          </span>
          <select aria-label="Cuff style" value={cuff.title} onChange={(event) => onCuffChange(event.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0">
            {cuffOptions.map((option) => <option key={option.id} value={option.title}>{option.title}</option>)}
          </select>
        </figcaption>
      </figure>
    </section>
  );
}

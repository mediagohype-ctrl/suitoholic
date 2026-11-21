import Image from "next/image";
import Link from "next/link";
import { shopCategoryHref, shopCollections } from "@/data/shopCollections";

export default function ShopCollectionsOverview({ onSelect }: { onSelect?: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,629fr)_minmax(0,644fr)]">
      {shopCollections.map(({ id, title }, index) => (
        <Link
          key={id}
          href={shopCategoryHref(id)}
          onClick={onSelect}
          aria-label={title}
          style={{ aspectRatio: `${index % 2 === 0 ? 629 : 644} / ${index < 2 ? 295 : 283}` }}
          className="@container group relative block overflow-hidden bg-[#3e321e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <Image
            src={`/banners/shop/${id}-photo.webp`}
            alt=""
            fill
            sizes="(min-width: 1720px) 760px, (min-width: 1024px) 43vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-[filter] duration-200 group-hover:brightness-110"
          />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-l from-black/35 via-transparent to-transparent" />
          <span className="pointer-events-none absolute top-[42%] right-[2.5%] flex w-[35%] -translate-y-1/2 flex-col items-center text-center text-[#fff8eb]" aria-hidden="true">
            <span className="font-serif-luxury text-[clamp(0.8125rem,4.55cqi,2.375rem)] leading-[1.05] font-medium uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              {title.split(" ").map((word) => (
                <span key={word} className={word === "Handcrafted" ? "block text-[min(0.86em,3.85cqi)]" : "block"}>
                  {word}
                </span>
              ))}
            </span>
            <span className="mt-[2.3cqi] h-0.5 w-2/5 bg-[#d8ab65]" />
          </span>
        </Link>
      ))}
    </div>
  );
}

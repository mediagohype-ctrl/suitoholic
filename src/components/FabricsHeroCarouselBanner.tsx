"use client";

import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import CatalogImage from "@/components/CatalogImage";
import type { ProductItem } from "@/lib/types";

type FabricPhoto = { name: string; image: string };

const SWATCHES_PER_PAGE = 8;
const FEATURED_MEDIA = [6, 5, 23, 49, 65, 8, 7, 45];

function getMediaId(image: string) {
  return Number(image.match(/^\/api\/media\/(\d+)\//)?.[1]);
}

function getFabricPhotos(fabrics: FabricPhoto[], products: ProductItem[]) {
  const shirts = products.filter(({ name, category }) =>
    category === "fabrics" || /^formal_|-shirts$/i.test(category) || /\bshirts?\b/i.test(name) && !/\bt[ -]?shirts?\b/i.test(name),
  );
  const photos = new Map<string, FabricPhoto>();

  for (const fabric of [...shirts, ...fabrics]) {
    const image = fabric.image?.trim().replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, "");
    if (image?.startsWith("/") && !image.startsWith("//") && !photos.has(image)) {
      photos.set(image, { name: fabric.name, image });
    }
  }

  const sorted = [...photos.values()];
  const rank = (image: string) => {
    const index = FEATURED_MEDIA.indexOf(getMediaId(image));
    return index < 0 ? FEATURED_MEDIA.length : index;
  };
  return sorted.sort((a, b) => rank(a.image) - rank(b.image));
}

export default function FabricsHeroCarouselBanner({ fabrics, products, ctaLabel }: {
  fabrics: FabricPhoto[];
  products: ProductItem[];
  ctaLabel: string;
}) {
  const [page, setPage] = useState(0);
  const photos = getFabricPhotos(fabrics, products);
  const lastPage = Math.max(0, Math.ceil(photos.length / SWATCHES_PER_PAGE) - 1);
  const activePage = Math.min(page, lastPage);
  const first = activePage * SWATCHES_PER_PAGE;
  const visible = photos.slice(first, first + SWATCHES_PER_PAGE);

  return (
    <section aria-labelledby="fabric-banner-heading" className="flex min-h-[min(100svh,850px)] w-full items-center bg-[radial-gradient(ellipse_at_75%_10%,#F6EFE5,#D6C4AE)] px-6 pt-24 pb-9 sm:px-12 sm:pt-28 sm:pb-12 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1510px] items-center gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)] lg:gap-12 xl:gap-16">
        <div>
          <h1 id="fabric-banner-heading" className="font-serif-luxury max-w-[12ch] text-[clamp(2.9rem,6.3vw,6.65rem)] leading-[0.88] font-bold text-[#302319]">
            The World&apos;s Finest Fabrics
          </h1>
          <p className="mt-4 font-serif-luxury text-lg font-semibold text-[#634B37] italic sm:mt-6 sm:text-2xl">Tailored for you</p>
          <a href="#swatches-studio" className="mt-5 inline-flex min-h-11 items-center gap-4 border-b border-[#6B4D34] py-2 text-xs font-semibold tracking-[0.16em] text-[#37271B] uppercase hover:text-[#7F4F2B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B4D34] sm:mt-7">
            {ctaLabel}<ArrowDown aria-hidden="true" size={15} />
          </a>
        </div>

        {visible.length > 0 && (
          <div>
            <ul aria-label="Catalog fabric swatches" className="grid grid-cols-4 gap-x-1 gap-y-3 bg-[radial-gradient(ellipse_at_30%_0%,#E9D9C5,transparent_66%),linear-gradient(122deg,#DDCCB8,#C6AC93)] px-3 py-5 shadow-[inset_0_1px_0_#FFF8EF,0_16px_38px_#51372224] sm:gap-x-2 sm:gap-y-5 sm:px-7 sm:py-8 lg:gap-y-7 lg:px-9 lg:py-10">
              {visible.map(({ image, name }) => {
                const mediaId = getMediaId(image);
                const hasInset = mediaId >= 5 && mediaId <= 65;
                const insetY = mediaId === 65 ? "-translate-y-[79%]" : "-translate-y-[76%]";

                return (
                  <li key={image} title={name} className="relative aspect-[0.88] min-w-0 rotate-[2deg] overflow-hidden rounded-[2px] bg-[#D8C7B2] shadow-[2px_5px_7px_#47301D66,0_1px_1px_#34251980] odd:-rotate-[2deg] sm:aspect-[1.12] sm:shadow-[3px_9px_13px_#47301D66,0_2px_2px_#34251975]">
                    <CatalogImage
                      src={image}
                      alt={name}
                      sizes={hasInset ? "(min-width: 1440px) 960px, (min-width: 1024px) 61vw, 100vw" : "(min-width: 1024px) 18vw, 25vw"}
                      loading="eager"
                      decoding="async"
                      className={hasInset
                        ? `absolute top-1/2 left-1/2 h-auto w-[490%] max-w-none -translate-x-[23%] ${insetY}`
                        : "h-full w-full object-cover"}
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 border border-[#FFF5E040] shadow-[inset_0_-3px_4px_#2F201D30]" />
                  </li>
                );
              })}
            </ul>
            {lastPage > 0 && (
              <div className="mt-3 flex items-center justify-end gap-2 text-[#49392B] sm:mt-4">
                <span aria-live="polite" className="mr-1 text-xs tabular-nums">{first + 1}–{first + visible.length} of {photos.length}</span>
                <button type="button" aria-label="Previous fabrics" onClick={() => setPage(activePage - 1)} disabled={activePage === 0} className="grid size-10 place-items-center rounded-full border border-[#92775D] hover:bg-[#F7EBDD] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40">
                  <ArrowLeft aria-hidden="true" size={17} />
                </button>
                <button type="button" aria-label="Next fabrics" onClick={() => setPage(activePage + 1)} disabled={activePage === lastPage} className="grid size-10 place-items-center rounded-full border border-[#92775D] hover:bg-[#F7EBDD] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40">
                  <ArrowRight aria-hidden="true" size={17} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

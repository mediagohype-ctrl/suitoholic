"use client";

import { getImageProps } from "next/image";
import type { ImgHTMLAttributes } from "react";

type CatalogImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "alt" | "sizes"> & {
  src: string;
  alt: string;
  sizes: string;
};

export default function CatalogImage({ src, alt, sizes, onError, ...props }: CatalogImageProps) {
  const canOptimize = src.startsWith("/") && !src.startsWith("//") && /\.(jpe?g|png|webp|avif)(\?|$)/i.test(src);
  const optimized = canOptimize ? getImageProps({ src, alt, width: 1200, height: 1200, sizes }).props : undefined;

  // eslint-disable-next-line @next/next/no-img-element
  return <img
    {...props}
    alt={alt}
    sizes={optimized?.sizes}
    srcSet={optimized?.srcSet}
    src={optimized?.src ?? src}
    onError={(event) => {
      const image = event.currentTarget;
      if (image.hasAttribute("srcset")) {
        image.removeAttribute("srcset");
        image.src = src;
        return;
      }
      onError?.(event);
    }}
  />;
}

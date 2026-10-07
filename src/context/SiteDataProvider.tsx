"use client";

import React, { createContext, useContext, useMemo } from "react";
import { mergeContent } from "@/content/merge";
import { contentDefaults, type ContentKey, type ContentOf } from "@/content/registry";
import type { Category, CollectionCategory, ProductItem, SiteBundle } from "@/lib/types";

const SiteDataContext = createContext<SiteBundle | null>(null);

export function SiteDataProvider({ value, children }: { value: SiteBundle; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteBundle {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used inside <SiteDataProvider>");
  return ctx;
}

/** Page copy for a section: the built-in defaults with any admin edits merged on top. */
export function useContent<K extends ContentKey>(key: K): ContentOf<K> {
  const { content } = useSiteData();
  const override = content[key];
  return useMemo(() => mergeContent(contentDefaults[key], override), [key, override]);
}

export function useSettings() {
  return useSiteData().settings;
}

export interface Catalog {
  products: ProductItem[];
  categories: Category[];
  /** Categories shown as homepage collection carousels, shaped for ModernCollectionSection. */
  homeCollections: CollectionCategory[];
  getProduct: (idOrSlug: string | number) => ProductItem | undefined;
  getCategory: (id: string) => Category | undefined;
}

export function useCatalog(): Catalog {
  const { products, categories } = useSiteData();
  return useMemo(() => {
    const byKey = new Map(categories.map((c) => [c.id, c]));
    return {
      products,
      categories,
      homeCollections: categories
        .filter((c) => c.showOnHome)
        .map((c) => ({ id: c.id, title: c.homeTitle || c.title, subtitle: c.description || c.subtitle, tag: c.tag, bgImage: c.bgImage || c.image })),
      getProduct: (idOrSlug) => products.find((p) => String(p.id) === String(idOrSlug) || p.slug === idOrSlug),
      getCategory: (id) => byKey.get(id),
    };
  }, [products, categories]);
}

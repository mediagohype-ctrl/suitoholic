// Every editable content section of the storefront. The objects imported here are the
// built-in defaults (the original site copy); the admin "Page Content" editor stores
// overrides per key in Postgres, which are merged over these defaults at render time.
import { aboutPage } from "./sections/aboutPage";
import { atelierBanner } from "./sections/atelierBanner";
import { bag } from "./sections/bag";
import { categoriesShowcase } from "./sections/categoriesShowcase";
import { customizer } from "./sections/customizer";
import { customShirtPage } from "./sections/customShirtPage";
import { fabricsPage } from "./sections/fabricsPage";
import { featureHighlights } from "./sections/featureHighlights";
import { footer } from "./sections/footer";
import { header } from "./sections/header";
import { infoPages } from "./sections/infoPages";
import { homeHero } from "./sections/homeHero";
import { homePage } from "./sections/homePage";
import { newsletter } from "./sections/newsletter";
import { productPage } from "./sections/productPage";
import { seo } from "./sections/seo";
import { shopByCategory } from "./sections/shopByCategory";
import { shopPage } from "./sections/shopPage";

export const contentDefaults = {
  seo,
  header,
  footer,
  featureHighlights,
  newsletter,
  homeHero,
  homePage,
  categoriesShowcase,
  shopByCategory,
  atelierBanner,
  shopPage,
  productPage,
  customizer,
  bag,
  aboutPage,
  customShirtPage,
  fabricsPage,
  infoPages,
};

export type ContentKey = keyof typeof contentDefaults;
export type ContentOf<K extends ContentKey> = (typeof contentDefaults)[K];

export type ContentGroup = "Global" | "Home Page" | "Shop & Product" | "Bag & Checkout" | "Pages";

export interface ContentSectionMeta {
  key: ContentKey;
  label: string;
  group: ContentGroup;
  description: string;
  /** Storefront path to preview the section on. */
  previewPath: string;
}

export const contentSections: ContentSectionMeta[] = [
  { key: "seo", label: "SEO & Metadata", group: "Global", description: "Browser tab title and search engine description.", previewPath: "/" },
  { key: "header", label: "Header & Navigation", group: "Global", description: "Logo, announcement bar, top links and main menu.", previewPath: "/" },
  { key: "footer", label: "Footer", group: "Global", description: "Footer columns, links, contact details and social links.", previewPath: "/" },
  { key: "featureHighlights", label: "Feature Highlights Bar", group: "Global", description: "The full-width strip of brand promises shown on most pages.", previewPath: "/" },
  { key: "newsletter", label: "Newsletter Signup", group: "Global", description: "Newsletter section copy. Signups appear under Subscribers.", previewPath: "/" },
  { key: "homeHero", label: "Hero Banner", group: "Home Page", description: "The top hero banner of the homepage.", previewPath: "/" },
  { key: "homePage", label: "Feature Banners", group: "Home Page", description: "Premium Fabrics / Custom Fit cards and collection headings.", previewPath: "/" },
  { key: "categoriesShowcase", label: "Rotating Categories Showcase", group: "Home Page", description: "The 3D revolving categories carousel.", previewPath: "/" },
  { key: "shopByCategory", label: "Shop by Category Grid", group: "Home Page", description: "Category tiles grid (also shown on product pages).", previewPath: "/" },
  { key: "atelierBanner", label: "Atelier Editorial Banner", group: "Home Page", description: "Full-width editorial banner on the homepage.", previewPath: "/" },
  { key: "shopPage", label: "Shop Page", group: "Shop & Product", description: "Shop headings, filters and sort labels.", previewPath: "/shop" },
  { key: "productPage", label: "Product Page", group: "Shop & Product", description: "Product page labels, assurance badges and detail gallery.", previewPath: "/shop" },
  { key: "customizer", label: "Bespoke Customizer (Add to Bag)", group: "Bag & Checkout", description: "Steps and options of the 6-step customizer: chest sizes, body types, heights, collars, cuffs, threads.", previewPath: "/shop" },
  { key: "bag", label: "Bag, Checkout & Tracking", group: "Bag & Checkout", description: "Copy for the bag, checkout, confirmation and order tracking pages.", previewPath: "/cart" },
  { key: "aboutPage", label: "About Us Page", group: "Pages", description: "All sections of the About page.", previewPath: "/about" },
  { key: "customShirtPage", label: "Custom Fit Page", group: "Pages", description: "All sections of the Custom Fit configurator page.", previewPath: "/custom-shirt" },
  { key: "fabricsPage", label: "Fabrics Page", group: "Pages", description: "All sections of the Fabrics page.", previewPath: "/fabrics" },
  { key: "infoPages", label: "Info Pages (Contact, Policies, FAQ)", group: "Pages", description: "Text pages served at /<slug>: contact, returns, shipping, privacy, terms, fabric care, FAQ. Add a page here to create a new URL.", previewPath: "/contact" },
];

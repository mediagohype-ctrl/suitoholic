// Built-in catalog. The live catalog is served by the Express API (server/) and edited in /admin;
// this copy is the fallback used when the API is unreachable and the source of the initial seed.

export interface Colorway {
  name: string;
  hex: string;
  productSlug: string;
}

export interface ProductItem {
  id: number;
  slug: string;
  name: string;
  category: string;
  /** Formatted price label, e.g. "₹ 2,499". */
  price: string;
  rawPrice: number;
  compareAtPrice?: number | null;
  subtitle: string;
  description: string;
  fabric: string;
  threadCount: string;
  collar?: string;
  cuff?: string;
  fit?: string;
  image: string;
  gallery: string[];
  colorways?: Colorway[];
  rating: number;
  reviewsCount: number;
  tag?: string;
  stock?: number | null;
  customizable?: boolean;
  featured?: boolean;
}

/** Homepage collection section (derived from a Category with showOnHome). */
export interface CollectionCategory {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bgImage: string;
}

export const collectionCategories: CollectionCategory[] = [
  {
    id: "formal_shirts",
    title: "Exclusive Formal Shirts",
    subtitle: "",
    tag: "COLLECTION 01 • PURE FORMAL DRESS SHIRTS",
    bgImage: "/new_shirts/shirt_21.jpg",
  },
  {
    id: "formal_stripes",
    title: "Best Sellers",
    subtitle: "",
    tag: "COLLECTION 02 • BEST SELLERS",
    bgImage: "/new_shirts/shirt_14.jpg",
  },
  {
    id: "formal_bespoke",
    title: "SHOP BY FABRICS",
    subtitle: "",
    tag: "COLLECTION 03 • SARTORIAL FORMAL SHIRTS",
    bgImage: "/new_shirts/shirt_19.jpg",
  },
  {
    id: "trousers",
    title: "Tailored Trousers & Pants",
    subtitle: "Italian pleated wool dress pants, sartorial Gurkha trousers, and premium stretch chinos.",
    tag: "COLLECTION 04 • TAILORED PANTS",
    bgImage: "/pant_pleated_beige.jpg",
  },
  {
    id: "tshirts",
    title: "Premium Polos & T-Shirts",
    subtitle: "Heavyweight Supima cotton tees, silk-blend knit polos, and fine-gauge textured casuals.",
    tag: "COLLECTION 05 • LUXURY CASUALS",
    bgImage: "/tshirt_knit_navy_polo.jpg",
  },
];

/** Exactly 8 unique canonical sister shirts matching the user's authentic catalog imagery */
export const USER_CATALOG_SHIRTS: ProductItem[] = [
  {
    id: 52,
    slug: "royal-blue-classic-bengal-stripe-twill-shirt",
    name: "ROYAL STEEL BLUE SOVEREIGN SHIRT",
    category: "formal_stripes",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Sharp and timeless royal blue striped shirt in premium twill weave",
    description: "Woven from high-grade cotton in a diagonal twill weave, this shirt features vibrant royal blue and white Bengal stripes. Designed for business executives and modern professionals, it delivers structured elegance, exceptional breathability, and all-day comfort.",
    fabric: "100% High-Grade Cotton",
    threadCount: "Diagonal Twill Weave",
    collar: "Classic English Spread Collar",
    cuff: "Dual-Use Mitred Cuff",
    image: "/new_shirts/shirt_21.jpg",
    gallery: ["/new_shirts/shirt_21.jpg", "/customizer/full_shirt_21.jpg"],
    rating: 5.0,
    reviewsCount: 112,
    tag: "BESTSELLER",
    customizable: true,
    featured: true,
  },
  {
    id: 51,
    slug: "dark-chocolate-brown-satin-twill-shirt",
    name: "BOARDROOM CHARCOAL OXFORD DRESS SHIRT",
    category: "formal_shirts",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Luxurious silk-touch satin twill shirt with a rich lustrous finish",
    description: "Tailored from an ultra-fine cotton satin twill blend, this rich dark chocolate brown shirt exudes pure luxury and refinement. Featuring an opulent silky sheen, smooth drape, and crisp detailing, it is the perfect statement piece for black-tie gatherings, cocktail parties, and sophisticated formal events.",
    fabric: "Ultra-Fine Cotton Satin Twill Blend",
    threadCount: "140s Silk-Touch Sateen",
    collar: "English Spread Collar",
    cuff: "French Double Cuff",
    image: "/new_shirts/shirt_19.jpg",
    gallery: ["/new_shirts/shirt_19.jpg", "/customizer/full_shirt_19.jpg"],
    rating: 5.0,
    reviewsCount: 114,
    tag: "SIGNATURE ESPRESSO",
    customizable: true,
    featured: true,
  },
  {
    id: 49,
    slug: "coral-red-bold-bengal-stripe-twill-shirt",
    name: "BRITISH BANKER FINE PINSTRIPE DRESS SHIRT",
    category: "formal_stripes",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Premium twill weave striped shirt for a sharp, confident look",
    description: "Crafted with precision, this custom-made shirt features prominent coral red and white Bengal stripes woven in an ultra-smooth twill texture. Ideal for formal meetings and sophisticated evening wear, it offers a refined drape, all-day comfort, and a crisp tailored finish.",
    fabric: "100% Fine Twill Cotton",
    threadCount: "130s Luxury Twill",
    collar: "Semi-Spread Formal Collar",
    cuff: "Rounded Single-Button Cuff",
    image: "/new_shirts/shirt_14.jpg",
    gallery: ["/new_shirts/shirt_14.jpg", "/customizer/full_shirt_14.jpg"],
    rating: 5.0,
    reviewsCount: 65,
    tag: "HERITAGE STRIPE",
    customizable: true,
    featured: true,
  },
  {
    id: 50,
    slug: "beige-textured-linen-cotton-shirt",
    name: "SAVILE ROW PURE WHITE POPLIN SHIRT",
    category: "formal_shirts",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Lightweight breathable textured shirt for effortless smart styling",
    description: "Woven from a premium linen-cotton blend, this subtle textured beige shirt combines breathable comfort with an understated elegance. Designed with a natural melange texture and tailored finish, it is perfect for smart-casual outings, summer events, and laid-back office days.",
    fabric: "Premium Linen-Cotton Blend",
    threadCount: "Breathable Melange Texture",
    collar: "Milano Cutaway Collar",
    cuff: "Two-Button Mitred Cuff",
    image: "/new_shirts/shirt_13.jpg",
    gallery: ["/new_shirts/shirt_13.jpg", "/customizer/full_shirt_13.jpg"],
    rating: 5.0,
    reviewsCount: 76,
    tag: "CONTEMPORARY LINEN",
    customizable: true,
    featured: true,
  },
  {
    id: 53,
    slug: "pure-white-executive-pinpoint-oxford-shirt",
    name: "CRISP EXECUTIVE WHITE TWILL SHIRT",
    category: "formal_shirts",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Immaculate pure white pinpoint Oxford weave shirt for executive power",
    description: "Crafted from long-staple Egyptian cotton, this essential white shirt offers unparalleled softness, a subtle lustrous weave, and crisp collar structure.",
    fabric: "100% Giza Egyptian Cotton",
    threadCount: "120s Two-Ply Pinpoint",
    collar: "Classic English Spread Collar",
    cuff: "Classic Mitred Single Cuff",
    image: "/new_shirts/shirt_15.jpg",
    gallery: ["/new_shirts/shirt_15.jpg", "/customizer/full_shirt_15.jpg"],
    rating: 5.0,
    reviewsCount: 98,
    tag: "ESSENTIAL LUXURY",
    customizable: true,
    featured: true,
  },
  {
    id: 54,
    slug: "navy-blue-fine-pinstripe-formal-shirt",
    name: "CLASSIC FRENCH CUFF SKY BLUE STRIPE",
    category: "formal_stripes",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Distinguished Savile Row fine stripe shirt for boardroom elegance",
    description: "Woven with precision in an alternating fine stripe pattern, offering breathability and timeless commanding style.",
    fabric: "100% Superfine Cotton",
    threadCount: "130s High-Twist Twill",
    collar: "Semi-Spread Cutaway Collar",
    cuff: "French Double Fold Cuff",
    image: "/new_shirts/shirt_16.jpg",
    gallery: ["/new_shirts/shirt_16.jpg", "/customizer/full_shirt_16.jpg"],
    rating: 4.9,
    reviewsCount: 84,
    tag: "SARTORIAL HERITAGE",
    customizable: true,
    featured: true,
  },
  {
    id: 55,
    slug: "sage-mint-sartorial-stripe-shirt",
    name: "SAGE MINT SARTORIAL STRIPE SHIRT",
    category: "formal_stripes",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Understated sage green stripe shirt woven from premium breathable yarn",
    description: "A refreshing modern take on corporate tailoring, delivering a subtle pale green hue with crisp white ground.",
    fabric: "100% Breathable Fine Cotton",
    threadCount: "120s Poplin Stripe",
    collar: "Modern Spread Collar",
    cuff: "Two-Button Mitred Cuff",
    image: "/new_shirts/shirt_18.jpg",
    gallery: ["/new_shirts/shirt_18.jpg", "/customizer/full_shirt_18.jpg"],
    rating: 5.0,
    reviewsCount: 71,
    tag: "MODERN ATELIER",
    customizable: true,
    featured: true,
  },
  {
    id: 56,
    slug: "imperial-charcoal-executive-twill-shirt",
    name: "IMPERIAL CHARCOAL EXECUTIVE TWILL SHIRT",
    category: "formal_shirts",
    price: "₹ 2,600",
    rawPrice: 2600,
    compareAtPrice: 2800,
    subtitle: "Deep charcoal dress shirt with an opulent subtle sheen and structured drape",
    description: "Deep, commanding anthracite charcoal tailored for evening galas, high-stakes negotiations, and formal banquets.",
    fabric: "Ultra-Fine Cotton Twill Blend",
    threadCount: "140s Sateen Twill",
    collar: "English Spread Collar",
    cuff: "French Double Cuff",
    image: "/new_shirts/shirt_20.jpg",
    gallery: ["/new_shirts/shirt_20.jpg", "/customizer/full_shirt_20.jpg"],
    rating: 5.0,
    reviewsCount: 89,
    tag: "EVENING BESPOKE",
    customizable: true,
    featured: true,
  },
];

export const EIGHT_CANONICAL_SISTER_SHIRTS: ProductItem[] = USER_CATALOG_SHIRTS;

export const allProducts: ProductItem[] = [
  // ==========================================
  // 1. EXCLUSIVE FORMAL SHIRTS (8 CANONICAL SHIRTS)
  // ==========================================
  ...USER_CATALOG_SHIRTS,
  // ==========================================
  // 4. BESPOKE SUITS & BLAZERS (5 ITEMS)
  // ==========================================
  {
    id: 24,
    slug: "italian-wool-navy-blazer",
    name: "ROYAL NAVY TAILORED BLAZER",
    category: "blazers",
    price: "₹ 6,999",
    rawPrice: 6999,
    subtitle: "Super 130s Vitale Barberis Canonico Wool",
    description: "Crafted with floating horsehair half-canvas construction for a natural chest roll. Features classic notch lapels, horn buttons, and Bemberg cupro lining.",
    fabric: "100% Super 130s Italian Wool",
    threadCount: "280 GSM Structured Weave",
    fit: "Tailored Neapolitan Cut",
    image: "/blazer_navy_wool.jpg",
    gallery: ["/blazer_navy_wool.jpg"],
    rating: 5.0,
    reviewsCount: 215,
    tag: "ICONIC SARTORIAL",
  },
  {
    id: 25,
    slug: "british-houndstooth-sports-jacket",
    name: "BRITISH HOUNDSTOOTH JACKET",
    category: "blazers",
    price: "₹ 7,499",
    rawPrice: 7499,
    subtitle: "Shetland Wool Micro-Houndstooth Weave",
    description: "Traditional Savile Row-inspired tailoring with modern soft shoulders, patch pockets, ticket pocket, and double back vents.",
    fabric: "100% Pure British Shetland Wool",
    threadCount: "340 GSM Heritage Weave",
    fit: "Modern Tailored Cut",
    image: "/blazer_houndstooth.jpg",
    gallery: ["/blazer_houndstooth.jpg"],
    rating: 4.9,
    reviewsCount: 134,
    tag: "HERITAGE",
  },
  {
    id: 26,
    slug: "midnight-charcoal-dinner-jacket",
    name: "MIDNIGHT CHARCOAL DINNER JACKET",
    category: "blazers",
    price: "₹ 8,499",
    rawPrice: 8499,
    subtitle: "Black-Tie Gala Tuxedo with Silk Grosgrain Lapels",
    description: "The pinnacle of formal evening wear. Cut from deep midnight charcoal barathea wool with sweeping silk grosgrain shawl lapels and jetted pockets.",
    fabric: "100% Fine Barathea Worsted Wool",
    threadCount: "300 GSM Tuxedo Barathea",
    fit: "Sleek Black-Tie Tailored",
    image: "/blazer_charcoal_tux.jpg",
    gallery: ["/blazer_charcoal_tux.jpg"],
    rating: 5.0,
    reviewsCount: 92,
    tag: "BLACK TIE LUXURY",
  },
  {
    id: 27,
    slug: "sand-unstructured-linen-blazer",
    name: "SAND UNSTRUCTURED LINEN BLAZER",
    category: "blazers",
    price: "₹ 6,499",
    rawPrice: 6499,
    subtitle: "Pure Irish Linen with Zero Padding",
    description: "The ultimate warm-weather jacket. Tailored with completely unstructured shoulders, butterfly lining, and open patch pockets for breathable luxury.",
    fabric: "100% Heavy Irish Spun Linen",
    threadCount: "280 GSM Summer Linen",
    fit: "Soft Unstructured Fit",
    image: "/blazer_sand_linen.jpg",
    gallery: ["/blazer_sand_linen.jpg"],
    rating: 4.8,
    reviewsCount: 108,
    tag: "SUMMER ATELIER",
  },
  {
    id: 28,
    slug: "camel-double-breasted-suit-jacket",
    name: "CAMEL DOUBLE-BREASTED BLAZER",
    category: "blazers",
    price: "₹ 7,999",
    rawPrice: 7999,
    subtitle: "6x2 Button Stance in Camel Hair & Wool",
    description: "Powerhouse tailoring. Wide sweeping peak lapels, roped shoulders, and brass crest buttons deliver commanding sartorial presence.",
    fabric: "60% Baby Camel Hair, 40% Virgin Wool",
    threadCount: "360 GSM Heavy Sartorial",
    fit: "Structured Double-Breasted",
    image: "/blazer_double_breasted.jpg",
    gallery: ["/blazer_double_breasted.jpg"],
    rating: 4.9,
    reviewsCount: 64,
    tag: "SARTORIAL POWER",
  },

  // ==========================================
  // 5. ETHNIC & CEREMONIAL LUXURY (5 ITEMS)
  // ==========================================
  {
    id: 29,
    slug: "royal-silk-mulberry-kurta",
    name: "BESPOKE MULBERRY SILK KURTA",
    category: "ceremonial",
    price: "₹ 4,499",
    rawPrice: 4499,
    subtitle: "100% Pure Mulberry Raw Silk",
    description: "Handcrafted festive luxury featuring delicate tone-on-tone thread embroidery along the placket and mandarin collar with concealed buttoning.",
    fabric: "100% Hand-Woven Mulberry Raw Silk",
    threadCount: "Artisanal Handloom Silk",
    collar: "Royal Mandarin Collar",
    cuff: "Straight Embroidered Cuff",
    image: "/ceremonial_kurta_silk.jpg",
    gallery: ["/ceremonial_kurta_silk.jpg"],
    rating: 4.9,
    reviewsCount: 165,
    tag: "FESTIVE ROYAL",
  },
  {
    id: 30,
    slug: "royal-bandhgala-nehru-jacket",
    name: "ROYAL NAVY BANDHGALA JACKET",
    category: "ceremonial",
    price: "₹ 5,999",
    rawPrice: 5999,
    subtitle: "Structured Cashmere-Wool Blend",
    description: "Regal Indian silhouette tailored with a sharp high stand collar, antique embossed gold buttons, and custom brocade silk lining.",
    fabric: "70% Virgin Wool, 30% Cashmere",
    threadCount: "350 GSM Regal Blend",
    collar: "High Bandhgala Stand Collar",
    image: "/ceremonial_bandhgala.jpg",
    gallery: ["/ceremonial_bandhgala.jpg"],
    rating: 5.0,
    reviewsCount: 198,
    tag: "REGAL MASTERPIECE",
  },
  {
    id: 32,
    slug: "gold-raw-silk-celebration-attire",
    name: "GOLD RAW SILK SARTORIAL SUIT",
    category: "ceremonial",
    price: "₹ 6,499",
    rawPrice: 6499,
    subtitle: "Artisanal Hand-Spun Matka Silk",
    description: "Subtle textured shimmer with unparalleled cultural heritage. Designed for luxury weddings, receptions, and red-carpet ceremonies.",
    fabric: "100% Hand-Spun Matka Silk",
    threadCount: "Handloom Luxury Weave",
    image: "/ceremonial_silk_blend.jpg",
    gallery: ["/ceremonial_silk_blend.jpg"],
    rating: 4.8,
    reviewsCount: 82,
    tag: "WEDDING ATELIER",
  },
  {
    id: 33,
    slug: "burgundy-velvet-smoking-jacket",
    name: "BURGUNDY VELVET SMOKING JACKET",
    category: "ceremonial",
    price: "₹ 7,999",
    rawPrice: 7999,
    subtitle: "Italian Cotton Velvet with Quilted Satin Collar",
    description: "Decadent evening luxury. Deep ruby burgundy cotton velvet with quilted black satin shawl lapels and silk-braided frogging closure.",
    fabric: "100% Italian Cotton Velvet",
    threadCount: "420 GSM Rich Pile Velvet",
    image: "/ceremonial_velvet.jpg",
    gallery: ["/ceremonial_velvet.jpg"],
    rating: 5.0,
    reviewsCount: 112,
    tag: "LIMITED EDITION",
  },
];

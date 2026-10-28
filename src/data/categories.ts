// Fallback copy of the seeded categories (server/src/seed/data/categories.json), used when the API is unreachable.
import type { Category } from "@/lib/types";

export const fallbackCategories: Category[] = [
  {
    "id": "formal_shirts",
    "title": "EXCLUSIVE FORMAL SHIRTS",
    "shortTitle": "FORMAL SHIRTS",
    "mobileTitle": [
      "EXCLUSIVE",
      "FORMAL SHIRTS"
    ],
    "subtitle": "",
    "image": "/new_shirts/shirt_21.jpg",
    "homeTitle": "Exclusive Formal Shirts",
    "description": "",
    "tag": "COLLECTION 01 • PURE FORMAL DRESS SHIRTS",
    "bgImage": "/new_shirts/shirt_21.jpg",
    "showOnHome": true,
    "sortOrder": 1,
    "active": true
  },
  {
    "id": "formal_stripes",
    "title": "BEST SELLERS",
    "shortTitle": "BEST SELLERS",
    "mobileTitle": [
      "BEST",
      "SELLERS"
    ],
    "subtitle": "",
    "image": "/new_shirts/shirt_20.jpg",
    "homeTitle": "Best Sellers",
    "description": "",
    "tag": "COLLECTION 02 • BEST SELLERS",
    "bgImage": "/new_shirts/shirt_20.jpg",
    "showOnHome": true,
    "sortOrder": 2,
    "active": true
  },
  {
    "id": "formal_bespoke",
    "title": "LUXURY TEXTURED & TWILL SHIRTS",
    "shortTitle": "TEXTURED & TWILL SHIRTS",
    "mobileTitle": [
      "TEXTURED &",
      "TWILL SHIRTS"
    ],
    "subtitle": "",
    "image": "/new_shirts/shirt_18.jpg",
    "homeTitle": "SHOP BY FABRICS",
    "description": "",
    "tag": "COLLECTION 03 • SARTORIAL FORMAL SHIRTS",
    "bgImage": "/new_shirts/shirt_18.jpg",
    "showOnHome": true,
    "sortOrder": 3,
    "active": true
  },
  {
    "id": "trousers",
    "title": "TAILORED TROUSERS & PANTS",
    "shortTitle": "TAILORED TROUSERS & PANTS",
    "mobileTitle": [
      "TAILORED",
      "TROUSERS"
    ],
    "subtitle": "Italian pleated wool dress pants & Gurkha trousers.",
    "image": "/pant_pleated_beige.jpg",
    "homeTitle": "Tailored Trousers & Pants",
    "description": "Italian pleated wool dress pants, sartorial Gurkha trousers, and premium stretch chinos.",
    "tag": "COLLECTION 04 • TAILORED PANTS",
    "bgImage": "/pant_pleated_beige.jpg",
    "showOnHome": false,
    "sortOrder": 4,
    "active": true
  },
  {
    "id": "tshirts",
    "title": "PREMIUM POLOS & T-SHIRTS",
    "shortTitle": "POLOS & T-SHIRTS",
    "mobileTitle": [
      "POLOS &",
      "T-SHIRTS"
    ],
    "subtitle": "Heavyweight Supima tees & silk-blend knit polos.",
    "image": "/tshirt_knit_navy_polo.jpg",
    "homeTitle": "Premium Polos & T-Shirts",
    "description": "Heavyweight Supima cotton tees, silk-blend knit polos, and fine-gauge textured casuals.",
    "tag": "COLLECTION 05 • LUXURY CASUALS",
    "bgImage": "/tshirt_knit_navy_polo.jpg",
    "showOnHome": false,
    "sortOrder": 5,
    "active": true
  },
  {
    "id": "blazers",
    "title": "BESPOKE SUITS & BLAZERS",
    "shortTitle": "SUITS & BLAZERS",
    "mobileTitle": [
      "SUITS &",
      "BLAZERS"
    ],
    "subtitle": "Super 130s Italian wool jackets & dinner tuxedos.",
    "image": "/blazer_navy_wool.jpg",
    "homeTitle": "",
    "description": "",
    "tag": "",
    "bgImage": "/blazer_navy_wool.jpg",
    "showOnHome": false,
    "sortOrder": 6,
    "active": true
  },
  {
    "id": "ceremonial",
    "title": "ETHNIC & CEREMONIAL LUXURY",
    "shortTitle": "CEREMONIAL LUXURY",
    "mobileTitle": [
      "CEREMONIAL &",
      "ROYAL ATELIER"
    ],
    "subtitle": "Silk bandhgalas, wedding kurtas & smoking jackets.",
    "image": "/ceremonial_bandhgala.jpg",
    "homeTitle": "",
    "description": "",
    "tag": "",
    "bgImage": "/ceremonial_bandhgala.jpg",
    "showOnHome": false,
    "sortOrder": 7,
    "active": true
  }
];

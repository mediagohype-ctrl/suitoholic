// Rotating 3D "CATEGORIES" carousel on the homepage.
// defaultActiveIndex: which card (0-based) is centered on load.
// dotAriaLabelTemplate: "{n}" is replaced with the card number.
export interface CategoryShowcaseItem {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
}

export const categoriesShowcase: {
  heading: string;
  defaultActiveIndex: number;
  previousAriaLabel: string;
  nextAriaLabel: string;
  dotAriaLabelTemplate: string;
  items: CategoryShowcaseItem[];
} = {
  heading: "CATEGORIES",
  defaultActiveIndex: 1,
  previousAriaLabel: "Rotate Anti-Clockwise (Previous Category)",
  nextAriaLabel: "Rotate Clockwise (Next Category)",
  dotAriaLabelTemplate: "Go to category {n}",
  items: [
    {
      title: "FORMAL SHIRTS",
      subtitle: "Egyptian Giza Twill & Royal Blue Bengal Stripe",
      image: "/new_shirts/shirt_21.jpg",
      href: "/shop?category=formal_shirts",
    },
    {
      title: "LUXURY SHIRTS",
      subtitle: "Dark Chocolate Brown Satin Twill & Evening Suiting",
      image: "/new_shirts/shirt_19.jpg",
      href: "/shop?category=formal_bespoke",
    },
    {
      title: "LINEN COLLECTION",
      subtitle: "Pure French Flax & Breathable Sand Beige Linen",
      image: "/new_shirts/shirt_13.jpg",
      href: "/shop?category=linen_collection",
    },
    {
      title: "STRIPED FORMAL SHIRTS",
      subtitle: "Savile Row Bengal Stripes & Architectural Patterns",
      image: "/new_shirts/shirt_15.jpg",
      href: "/shop?category=formal_stripes",
    },
    {
      title: "EXECUTIVE WHITE TWILL",
      subtitle: "Crisp Snow White Twill & Pure Luxury Cotton",
      image: "/new_shirts/shirt_16.jpg",
      href: "/shop?category=formal_shirts",
    },
  ],
};

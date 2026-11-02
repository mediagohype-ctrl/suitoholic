// Rotating 3D "CATEGORIES" carousel on the homepage.
// defaultActiveIndex: which card (0-based) is centered on load.
// dotAriaLabelTemplate: "{n}" is replaced with the card number.
export const categoriesShowcase = {
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
      title: "CEREMONIAL SUITS",
      subtitle: "Royal Bandhgalas & Velvet Smoking Jackets",
      image: "/ceremonial_bandhgala.jpg",
      href: "/shop?category=ceremonial",
    },
    {
      title: "BENGAL STRIPES",
      subtitle: "Savile Row Twill Stripes & Executive Tailoring",
      image: "/new_shirts/shirt_14.jpg",
      href: "/shop?category=formal_stripes",
    },
  ],
};

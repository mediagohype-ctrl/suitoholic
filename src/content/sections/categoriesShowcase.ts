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
      subtitle: "Egyptian Giza Twill & Sea Island Poplins",
      image: "/shop_bespoke_shirt.jpg",
      href: "/shop?category=formal_shirts",
    },
    {
      title: "LUXURY SHIRTS",
      subtitle: "Italian Super 130s Worsted Wool & Double-Breasted",
      image: "/fabric_cat_coord_sets.jpg",
      href: "/shop?category=co_ord_sets",
    },
    {
      title: "LINEN COLLECTION",
      subtitle: "Pure French Flax & Breathable Summer Weaves",
      image: "/shirt_linen_french.jpg",
      href: "/shop?category=linen_collection",
    },
    {
      title: "CEREMONIAL SUITS",
      subtitle: "Royal Bandhgalas & Velvet Smoking Jackets",
      image: "/ceremonial_bandhgala.jpg",
      href: "/shop?category=ceremonial",
    },
    {
      title: "TROUSERS & PANTS",
      subtitle: "Sartorial Pleated Gurkha & Wool Dress Pants",
      image: "/pant_pleated_beige.jpg",
      href: "/shop?category=trousers",
    },
    {
      title: "KNIT POLOS & TEES",
      subtitle: "Silk-Blend Knitwear & Pima Cotton Essentials",
      image: "/tshirt_knit_navy_polo.jpg",
      href: "/shop?category=tshirts",
    },
  ],
};

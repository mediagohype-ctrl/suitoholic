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
      title: "SHIRTS",
      subtitle: "Egyptian Giza Twill & Sea Island Poplins",
      image: "/shop_bespoke_shirt.jpg",
      href: "/shop?category=formal_shirts",
    },
    {
      title: "CO-ORD SETS",
      subtitle: "Italian Super 130s Worsted Wool & Double-Breasted",
      image: "/blazer_navy_wool.jpg",
      href: "/shop?category=blazers",
    },
    {
      title: "DENIM EDIT & PANTS",
      subtitle: "Sartorial Pleated Gurkha & Wool Dress Pants",
      image: "/pant_pleated_beige.jpg",
      href: "/shop?category=trousers",
    },
    {
      title: "CEREMONIAL ATELIER",
      subtitle: "Royal Bandhgalas & Italian Velvet Smoking Jackets",
      image: "/ceremonial_bandhgala.jpg",
      href: "/shop?category=ceremonial",
    },
    {
      title: "LUXURY KNIT POLOS",
      subtitle: "Silk-Blend Knitwear & Pima Cotton Essentials",
      image: "/tshirt_knit_navy_polo.jpg",
      href: "/shop?category=tshirts",
    },
    {
      title: "BESPOKE CONFIGURATOR",
      subtitle: "Tailored to Your Exact Body Measurements & Monogram",
      image: "/tailoring_tools.jpg",
      href: "/custom-shirt",
    },
  ],
};

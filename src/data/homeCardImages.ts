export const HOME_CARD_IMAGES: Readonly<Record<string, string>> = {
  "soft-ivory-white-egyptian-cotton-shirt": "/generated/soft_ivory_models/character_1_soft_ivory.jpg",
  "d-116-pastel-lavender-mist-bespoke-shirt": "/banners/shop/home-folded-lavender.webp",
  "d-120-imperial-royal-plum-bespoke-shirt": "/banners/shop/home-folded-plum.webp",
  "d-121-desert-khaki-bespoke-twill-shirt": "/banners/shop/home-folded-khaki.webp",
  "d-122-warm-apricot-sienna-bespoke-shirt": "/banners/shop/home-folded-apricot.webp",
};

export const LATEST_DROP_CARD_IMAGES: Readonly<Record<string, string>> = {
  ...HOME_CARD_IMAGES,
  "lsp-378-13-arctic-frost-ice-blue-bespoke-shirt": "/banners/shop/home-folded-arctic-ice-blue.webp",
  "lsp-029-37-deep-ink-indigo-bespoke-shirt": "/banners/shop/home-folded-deep-ink-indigo.webp",
  "lsp-014-09-shadow-abyss-navy-bespoke-shirt": "/banners/shop/home-folded-shadow-abyss-navy.webp",
  "lsp-014-07-lilac-whisper-bespoke-shirt": "/banners/shop/home-folded-lilac-whisper.webp",
};

const executiveStripedSlugs = [
  "suitoholic-sage-green-bengal-striped-twill-shirt",
  "suitoholic-french-blue-bengal-striped-twill-shirt",
  "mustard-ochre-bengal-striped-twill-shirt",
  "suitoholic-berry-pink-bengal-striped-twill-shirt",
  "suitoholic-pastel-pink-striped-jacquard-shirt",
  "suitoholic-navy-blue-bengal-striped-twill-shirt",
  "suitoholic-classic-black-white-bengal-striped-twill-shirt",
  "suitoholic-charcoal-grey-bengal-striped-twill-shirt",
  "suitoholic-lavender-purple-bengal-striped-twill-shirt",
  "suitoholic-baby-pink-bengal-striped-twill-shirt",
  "royal-blue-classic-bengal-stripe-twill-shirt",
  "suitoholic-light-grey-bengal-striped-twill-shirt",
  "suitoholic-deep-burgundy-bengal-striped-twill-shirt",
  "suitoholic-forest-green-bengal-striped-twill-shirt",
  "coral-red-bold-bengal-stripe-twill-shirt",
  "suitoholic-wine-purple-bengal-striped-twill-shirt",
  "suitoholic-khaki-brown-bengal-striped-twill-shirt",
  "suitoholic-bottle-green-bengal-striped-twill-shirt",
  "suitoholic-cornflower-blue-bengal-striped-twill-shirt",
  "suitoholic-sky-blue-bengal-striped-twill-shirt",
  "suitoholic-caramel-brown-bengal-striped-twill-shirt",
  "suitoholic-olive-green-bengal-striped-twill-shirt",
  "suitoholic-ice-blue-bengal-striped-twill-shirt",
  "suitoholic-beige-cream-bengal-striped-twill-shirt",
];

export const EXECUTIVE_STRIPED_CARD_IMAGES: Readonly<Partial<Record<string, string>>> = Object.fromEntries(
  executiveStripedSlugs.map(slug => [slug, `/banners/executive-striped/${slug}.webp`]),
);

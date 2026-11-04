// Content configuration for "Your fabric, as a finished look" / "See Before You Stitch" carousel.

export interface FinishedLookSlide {
  id: string;
  fabricImage: string;
  lookImage: string;
  title: string;
  description: string;
  fabricName?: string;
  active?: boolean;
}

export interface FinishedLooksContent {
  sectionTitle: string;
  footerNote: string;
  slides: FinishedLookSlide[];
}

export const finishedLooks: FinishedLooksContent = {
  sectionTitle: "Your fabric, as a finished look",
  footerNote: "Visualise your dream look — tailored to your exact measurements in store & online.",
  slides: [
    {
      id: "look-linen-shirt",
      fabricImage: "/new_shirts/shirt_13.jpg",
      lookImage: "/customizer/full_shirt_13.jpg",
      title: "Fabric to bespoke natural linen shirt",
      description: "Shown to you in minutes, in store & online",
      fabricName: "Beige Textured Linen Cotton",
      active: true,
    },
    {
      id: "look-chocolate-shirt",
      fabricImage: "/new_shirts/shirt_19.jpg",
      lookImage: "/customizer/full_shirt_19.jpg",
      title: "Fabric to bespoke Italian chocolate luxury shirt",
      description: "Shown to you in minutes, in store & online",
      fabricName: "Dark Chocolate Brown Satin Twill",
      active: true,
    },
    {
      id: "look-banker-shirt",
      fabricImage: "/new_shirts/shirt_21.jpg",
      lookImage: "/customizer/full_shirt_21.jpg",
      title: "Fabric to Italian bespoke banker stripe shirt",
      description: "Shown to you in minutes, in store & online",
      fabricName: "Royal Blue Classic Bengal Stripe Twill",
      active: true,
    },
    {
      id: "look-terracotta-shirt",
      fabricImage: "/new_shirts/shirt_14.jpg",
      lookImage: "/customizer/full_shirt_14.jpg",
      title: "Fabric to bespoke coral bengal stripe shirt",
      description: "Shown to you in minutes, in store & online",
      fabricName: "Coral Red Bold Bengal Stripe Twill",
      active: true,
    },
    {
      id: "look-sage-shirt",
      fabricImage: "/new_shirts/shirt_18.jpg",
      lookImage: "/customizer/full_shirt_18.jpg",
      title: "Fabric to bespoke sage green striped shirt",
      description: "Shown to you in minutes, in store & online",
      fabricName: "Sage Green Bengal Striped Twill",
      active: true,
    },
  ],
};


// Homepage hero: a muted, looping background video with shirt colour swatches.
// variants[].startTime is the second in the video where that shirt appears; clicking a swatch
// jumps there, and the active swatch follows the video. Keep variants ordered by startTime.
// swatchFrom / swatchTo are the two colours of the swatch gradient.
export const homeHero = {
  video: "/video/latest_video.mp4",
  eyebrow: "EFFORTLESSLY ELEGANT",
  headingLine1: "NOT EVERY BODY",
  headingLine2: "IS THE SAME SIZE.",
  primaryCtaLabel: "SHOP SHIRTS",
  primaryCtaHref: "/shop",
  secondaryCtaLabel: "CUSTOM FIT",
  secondaryCtaHref: "/custom-shirt",
  scrollLabel: "SCROLL DOWN",
  trackerStartLabel: "01",
  trackerEndLabel: "04",
  variants: [
    { name: "Royal Steel Blue Stripe", shortLabel: "Royal Blue Stripe", swatchFrom: "#2E456A", swatchTo: "#4F6A8F", startTime: 0 },
    { name: "Terracotta Rust Stripe", shortLabel: "Terracotta Stripe", swatchFrom: "#8E4434", swatchTo: "#B86755", startTime: 3.5 },
    { name: "Dark Espresso Brown", shortLabel: "Espresso Brown", swatchFrom: "#251712", swatchTo: "#4D3329", startTime: 7.0 },
    { name: "Sand Beige Linen", shortLabel: "Sand Linen", swatchFrom: "#B5A28E", swatchTo: "#D4C4B3", startTime: 10.5 },
  ],
};

// Options and copy for the 6-step bespoke "Add to Bag" customizer.
// Text tokens: {chest} is replaced with the chosen chest size; {chest+2} / {chest-4} add or subtract.
//
// The preview on the left changes with every step:
//   steps 1–3  mannequin shirt (visuals.fullSleeveImage / halfSleeveImage) morphing with fit & height,
//              with the selected product's photo shown as the "fabric" chip
//   step 4     mannequin switches between full and half sleeve
//   step 5     the product's own photo with collar, cuff and monogram previews
//   step 6     the product's photo with the complete selection summary
// collarStyles[].image / cuffStyles[].image are optional photos; when empty a line illustration is drawn.
export const customizer = {
  eyebrow: "SUITOHOLIC BESPOKE ATELIER",
  titlePrefix: "CUSTOMIZE",
  breadcrumbRoot: "BESPOKE CUSTOMIZER",
  studioTitleLines: ["BESPOKE", "TAILORING", "STUDIO."],
  selectionTitle: "Your Selection",
  steps: [
    { breadcrumb: "CHEST SIZE", title: "SELECT YOUR CHEST SIZE", subtitle: "Choose your chest size for the perfect fit." },
    { breadcrumb: "BODY TYPE", title: "CHOOSE YOUR BODY TYPE", subtitle: "Find the fit that matches your body shape and comfort preference." },
    { breadcrumb: "HEIGHT", title: "SELECT YOUR HEIGHT", subtitle: "Choose the height option that fits you." },
    { breadcrumb: "SLEEVES", title: "SELECT YOUR SLEEVES", subtitle: "Choose the sleeve type that you prefer." },
    {
      breadcrumb: "COLLAR & DETAILS",
      title: "COLLAR, CUFFS & DETAILS",
      subtitle: "Customize collar style, wrist cuffs, and personalized monogram initials.",
    },
    { breadcrumb: "REVIEW & ADD TO BAG", title: "REVIEW & CONFIRM BESPOKE FIT", subtitle: "Verify your bespoke specifications before adding to bag." },
  ],
  chestLabel: "CHEST SIZE (IN INCHES)",
  chestSizes: [
    { size: 38, collar: 15, shoulder: 17.5 },
    { size: 39, collar: 15.25, shoulder: 17.75 },
    { size: 40, collar: 15.5, shoulder: 18 },
    { size: 41, collar: 15.75, shoulder: 18.25 },
    { size: 42, collar: 16, shoulder: 18.5 },
    { size: 44, collar: 16.5, shoulder: 19 },
    { size: 46, collar: 17, shoulder: 19.5 },
    { size: 48, collar: 17.5, shoulder: 20 },
  ],
  // The id must stay one of lean / regular / tummy — the 3D mannequin is drawn for these shapes.
  bodyFits: [
    { id: "lean", title: "LEAN FIT", description: 'Chest is {chest}" and stomach is {chest-4}".' },
    { id: "regular", title: "REGULAR FIT", description: 'Chest is {chest}" and stomach is {chest-2}".' },
    { id: "tummy", title: "TUMMY COMFORT FIT", description: 'Chest is {chest}", Stomach size is {chest+1}" – {chest+2}".' },
  ],
  // The id should contain REGULAR, TALL or EXTRA so the mannequin can scale its length.
  heights: [
    {
      id: 'REGULAR HEIGHT (5.5 - 5.7")',
      title: "REGULAR HEIGHT",
      shortTitle: "Regular Height",
      heightRange: 'Height: 5.5 – 5.7"',
      details: 'Shirt Length: 27.5" | Sleeve: 23.75"',
    },
    {
      id: 'TALL HEIGHT (5.8 - 5.10")',
      title: "TALL HEIGHT",
      shortTitle: "Tall Height",
      heightRange: 'Height: 5.8 – 5.10"',
      details: 'Shirt Length: 29" | Sleeve: 24.5"',
    },
    {
      id: 'EXTRA TALL (5.11" & ABOVE)',
      title: "EXTRA TALL HEIGHT",
      shortTitle: "Extra Tall",
      heightRange: 'Height: 5.11 – 6.2"',
      details: 'Shirt Length: 30.5" | Sleeve: 26.5"',
    },
  ],
  halfSleeveLabel: "HALF SLEEVE",
  fullSleeveLabel: "FULL SLEEVE",
  collarLabel: "COLLAR STYLE",
  // Illustration is picked from the name: cutaway, spread, mandarin/band, button down. Upload an image to replace it.
  collarStyles: [
    { name: "CUTAWAY COLLAR", description: "Wide, modern points for larger tie knots", image: "" },
    { name: "CLASSIC SPREAD", description: "The versatile boardroom standard", image: "" },
    { name: "MANDARIN / BAND", description: "Minimal stand collar, no points", image: "" },
    { name: "BUTTON DOWN", description: "Points fastened with buttons, smart-casual", image: "" },
  ],
  cuffLabel: "CUFF DESIGN",
  // Illustration is picked from the name: classic/barrel, french/double, rounded. Upload an image to replace it.
  cuffStyles: [
    { name: "CLASSIC CUFF", description: "Single-button barrel cuff", image: "" },
    { name: "FRENCH DOUBLE", description: "Folded double cuff for cufflinks", image: "" },
    { name: "ROUNDED CUFF", description: "Barrel cuff with softened corners", image: "" },
  ],
  monogramLabel: "MONOGRAM INITIALS",
  monogramPlaceholder: "E.G. A K",
  threadLabel: "THREAD COLOR",
  // hex is used to preview the embroidered initials.
  threadColors: [
    { value: "black", label: "BLACK THREAD", hex: "#14110E" },
    { value: "gold", label: "GOLD THREAD", hex: "#B8860B" },
    { value: "navy", label: "NAVY THREAD", hex: "#1F3A5F" },
    { value: "maroon", label: "MAROON THREAD", hex: "#6B1F2A" },
  ],
  visuals: {
    fullSleeveImage: "/customizer/mannequin_full_sleeve.png",
    halfSleeveImage: "/customizer/mannequin_half_sleeve.jpg",
    // Shown on the detail steps when no product photo is available (e.g. the Custom Fit page).
    fallbackDetailImage: "/customizer/detail_cuff_collar.jpg",
    fabricChipLabel: "YOUR FABRIC",
    collarPreviewLabel: "COLLAR",
    cuffPreviewLabel: "CUFF",
    monogramPreviewLabel: "MONOGRAM",
    reviewLabel: "YOUR BESPOKE SHIRT",
  },
  defaults: {
    chestSize: 38,
    bodyFit: "lean",
    height: 'TALL HEIGHT (5.8 - 5.10")',
    sleeveType: "full",
    collarStyle: "CUTAWAY COLLAR",
    cuffStyle: "CLASSIC CUFF",
    initials: "A K",
    threadColor: "black",
  },
  reviewLabels: {
    measurements: "Chest / Collar / Shoulder:",
    bodyFit: "Body Fit:",
    height: "Height:",
    sleevesCollar: "Sleeves & Collar:",
    cuffPocket: "Cuff & Pocket:",
    monogram: "Bespoke Monogram:",
    customizationFee: "Bespoke Tailoring Fee:",
  },
  backLabel: "BACK",
  continueLabel: "CONTINUE →",
  confirmLabel: "ADD TO BAG WITH CUSTOMIZATION ✓",
  addingLabel: "ADDING TO BAG…",
};

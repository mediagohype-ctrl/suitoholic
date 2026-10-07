// Page-specific copy for the Custom Fit configurator (/custom-shirt).
// The configurator OPTIONS (chest sizes, body fits, heights, sleeve labels, collar/cuff styles,
// thread colours, review labels, Back/Continue labels) come from the "customizer" section,
// so they are edited once for both the product-page customizer and this page.
// Template tokens: {step}, {total}, {breadcrumb}.
export const customShirtPage = {
  // The catalog product (slug or id) used as the base for custom-fit orders added to the bag.
  bagProductSlug: "royal-formal-crisp-white-shirt",

  // Left column inscription, one entry per line
  inscriptionLines: ["A SHIRT", "MADE", "FOR YOU."],
  // Bottom-right inscription of the configurator card, one entry per line
  taglineLines: ["TAILORED", "FOR A BETTER", "YOU."],

  // "Your Selection" panel labels
  selectionLabels: {
    chestSize: "Chest Size",
    bodyType: "Body Type",
    height: "Height",
    sleeve: "Sleeve",
    collar: "Collar",
    cuff: "Cuff",
    monogram: "Monogram",
    halfSleeve: "Half Sleeve",
    fullSleeve: "Full Sleeve",
  },
  // Appended after the body-fit id (e.g. "lean Fit") and sleeve id (e.g. "full Sleeve")
  fitSuffix: "Fit",
  sleeveSuffix: "Sleeve",

  mobileStepTemplate: "Step {step} of {total}: {breadcrumb}",
  stepCounterTemplate: "STEP {step} OF {total}",
  buttonCounterTemplate: "{step} OF {total}",

  // This page's own wording for the 6 steps (in order). In a subtitle, the
  // "subtitleHighlight" phrase is shown in a lighter colour (leave empty for none).
  steps: [
    { breadcrumb: "CHEST SIZE", title: "SELECT YOUR CHEST SIZE", subtitle: "Choose your chest size for the perfect fit.", subtitleHighlight: "" },
    {
      breadcrumb: "BODY TYPE",
      title: "CHOOSE YOUR BODY TYPE",
      subtitle: "Find the fit that matches your body shape and comfort preference.",
      subtitleHighlight: "",
    },
    { breadcrumb: "HEIGHT", title: "SELECT YOUR HEIGHT", subtitle: "Choose the height option that fits you.", subtitleHighlight: "" },
    { breadcrumb: "SLEEVES", title: "SELECT YOUR SLEEVES", subtitle: "Choose the sleeve type that you prefer.", subtitleHighlight: "the sleeve type" },
    {
      breadcrumb: "COLLAR & DETAILS",
      title: "COLLAR, CUFFS & DETAILS",
      subtitle: "Customize collar style, wrist cuffs, and personalized monogram initials.",
      subtitleHighlight: "",
    },
    { breadcrumb: "REVIEW", title: "FINAL FIT REVIEW", subtitle: "Verify your bespoke specifications before tailor dispatch.", subtitleHighlight: "" },
  ],

  // Measurement box under the chest sizes
  measurementLabels: {
    chest: "Chest Size",
    collar: "Collar Size",
    shoulder: "Shoulder",
  },

  // Step 5 labels that differ from the customizer section
  pocketLabel: "CHEST POCKET",
  pocketOptions: [
    { id: "pocket", label: "WITH POCKET" },
    { id: "no-pocket", label: "NO POCKET" },
  ],
  initialsLabel: "YOUR INITIALS (MAX 3 CHARACTERS)",
  threadLabel: "EMBROIDERY THREAD COLOR",

  // Initial values not covered by the customizer defaults
  defaults: {
    pocket: "pocket",
    shirtColor: "white",
  },

  noInitialsLabel: "None",

  // Final step / add to bag
  confirmLabel: "ADD TO BAG ✓",
  addingLabel: "ADDING TO BAG…",
  addedLabel: "ADDED TO BAG ✓",
  successMessage: "BESPOKE SHIRT ADDED TO YOUR BAG!",
  viewBagLabel: "VIEW BAG",
  viewBagHref: "/cart",
  productNotFoundError: "The custom-fit base shirt is currently unavailable. Please try again later.",
  addToBagError: "We couldn't add your bespoke shirt to the bag. Please try again.",
};

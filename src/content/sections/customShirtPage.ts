// Page-specific copy for the Custom Fit configurator (/custom-shirt).
// The configurator OPTIONS (chest sizes, body fits, heights, sleeve labels, collar/cuff styles,
// thread colours, review labels, Back/Continue labels) come from the "customizer" section,
// so they are edited once for both the product-page customizer and this page.
// Template tokens: {step}, {total}, {breadcrumb}.
export const customShirtPage = {
  hero: {
    badge: "PREET VIHAR, DELHI NCR",
    title: "Best Bespoke Tailors in Delhi NCR",
    description: "Founded in Sindh in the 1930s by Kailash Ji's grandfather. Established in Daryaganj as Sindh Punjab Tailors after Partition. Continuing in today as Suit Up by Kailash Talreja where every garment is still cut by hand, fitted in person, and made to last.",
    nameLabel: "Name",
    namePlaceholder: "Enter your name",
    phoneLabel: "Phone",
    phonePlaceholder: "Enter your phone number",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    dateLabel: "Preferred Date",
    buttonLabel: "Book An Appointment",
    successTitle: "Appointment Requested!",
    successMessage: "Thank you! Our master tailor will contact you shortly to confirm your private fitting session.",
    jumpToConfiguratorLabel: "Or Configure 3D Shirt Online",
  },

  stripEyebrow: "BESPOKE SERVICES",
  customOfferings: [
    { title: "Bespoke Shirts", detail: "Formal, Casual & Tuxedo" },
    { title: "Handcrafted Suits", detail: "Two-Piece & Three-Piece" },
    { title: "Luxury Overcoats", detail: "Cashmere & Merino Wool" },
    { title: "Tailored Blazers", detail: "Italian Poplins & Twills" },
    { title: "Royal Bandhgalas", detail: "Heritage Silhouette" },
    { title: "Tuxedos & Dinner Jackets", detail: "Silk Satin Lapels" },
    { title: "Custom Trousers", detail: "Pleated & Gurkha Waist" },
    { title: "Bespoke Waistcoats", detail: "Double & Single Breasted" },
    { title: "Nehru Jackets", detail: "Raw Silk & Linen" },
    { title: "Jodhpuri Suits", detail: "Royal Ceremonial Edit" },
    { title: "Monogrammed Accents", detail: "Custom Embroidery on Cuffs" },
  ],

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

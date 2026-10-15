// Page-specific copy for the Custom Fit configurator (/custom-shirt).
// The configurator OPTIONS (chest sizes, body fits, heights, sleeve labels, collar/cuff styles,
// thread colours, review labels, Back/Continue labels) come from the "customizer" section,
// so they are edited once for both the product-page customizer and this page.
// Template tokens: {step}, {total}, {breadcrumb}.
export const customShirtPage = {
  hero: {
    badge: "SUITOHOLIC BESPOKE ATELIER • DELHI NCR",
    title: "The Art of Bespoke Tailoring in Delhi NCR",
    description: "Founded in New Delhi by master bespoke cutters dedicated to heritage craftsmanship. Reclaiming the art of individual pattern drafting, Suitoholic crafts every garment from a hand-cut paper pattern engineered to your unique posture. Tailored from 140s Egyptian Giza cottons and Italian worsted wools, fitted in person, and made to last a lifetime.",
    nameLabel: "Name",
    namePlaceholder: "Enter your full name",
    phoneLabel: "Phone",
    phonePlaceholder: "Enter your phone number",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email address",
    dateLabel: "Preferred Fitting Date",
    buttonLabel: "Book Atelier Appointment",
    successTitle: "Fitting Session Requested!",
    successMessage: "Thank you! A Suitoholic master bespoke consultant will reach out shortly to confirm your private fitting in Delhi NCR.",
    jumpToConfiguratorLabel: "Or Design Your Shirt with 3D Mannequin Online",
    pillars: [
      "Hand-Drafted Paper Pattern",
      "1-on-1 Master Fitting",
      "100% Fit Guarantee",
    ],
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

  timelineStory: {
    eyebrow: "OUR STORY",
    titlePrefix: "Two Decades of Craft in ",
    titleAccent: "Delhi NCR.",
    description:
      "Founded in New Delhi by master bespoke cutters dedicated to heritage craftsmanship. Reclaiming the uncompromising art of individual pattern drafting, Suitoholic crafts every single garment from a fresh paper pattern engineered to your unique posture, drape, and silhouette.",
    image: "/master_tailor_story.jpg",
    imageCaption: "Master Bespoke Cutter • New Delhi Atelier Bench",
    milestones: [
      {
        period: "ESTD. 2026",
        title: "Founded In New Delhi Atelier",
        story:
          "Suitoholic begins with master bespoke cutters committed to pure bespoke tailoring. Every garment drafted from a hand-cut paper pattern, upholding individual craft standards across two decades of devoted practice.",
      },
      {
        period: "PROVENANCE & CRAFT",
        title: "Direct Textile Mill Alliances, Biella & Giza",
        story:
          "Bypassing industrial middlemen, establishing direct partnerships with heritage looms in Biella, Italy for Super 150s worsted wool and Egypt's Nile Delta for authentic 140s Extra-Long Staple Giza cottons.",
      },
      {
        period: "TODAY & BEYOND",
        title: "Suitoholic Bespoke Atelier, Delhi NCR",
        story:
          "Dressing corporate leaders, dignitaries, and connoisseurs across 42 countries. The same timeless belief: that a garment made well — to your body, for your occasion — is never just clothing.",
      },
    ],
  },

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

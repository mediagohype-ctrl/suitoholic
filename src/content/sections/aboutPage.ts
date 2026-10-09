// Copy, images and links for the About page (/about).
// Headings are split into a plain first line and an italic gold "accent" second line.
// Template tokens: {step} (process phase badge), {metric} (anatomy standard), {label} (archive benchmark).
// Concierge "icon" keys: scissors, crown, shieldCheck, ruler, award, globe, truck, layers, shirt,
// clock, phone, mail, calendar, mapPin, check (unknown keys fall back to scissors).
export const aboutPage = {
  // 1. Hero: brand mission
  hero: {
    titleLine: "BESPOKE TAILORING.",
    titleAccent: "ENGINEERED FOR YOUR INDIVIDUAL SILHOUETTE.",
    summary:
      "Suitoholic is an authentic bespoke and made-to-measure tailoring house. We craft custom dress shirts, canvas-constructed suits, precision trousers, and ceremonial wear—cut from pure natural fibers and individually drafted to your exact measurements with a 100% Fit Guarantee.",
    // This phrase inside the summary is shown in bold (leave empty for none).
    summaryHighlight: "100% Fit Guarantee",
    stats: [
      { value: "40+", label: "Fit Data Vectors" },
      { value: "100%", label: "Fit Guarantee" },
      { value: "140s", label: "Egyptian Giza" },
      { value: "22 SPI", label: "Single-Needle" },
    ],
    primaryButtonLabel: "3D CUSTOM FIT CONFIGURATOR",
    primaryButtonHref: "/custom-shirt",
    secondaryButtonLabel: "READY-TO-WEAR",
    secondaryButtonHref: "/shop",
    image: "/about_hero_cutting_table.jpg",
    imageAlt: "Suitoholic Master Bespoke Cutting Table",
  },

  // 2. What we craft: garment categories / services
  services: {
    titleLine: "WHAT WE CRAFT",
    titleAccent: "FOR DISCERNING GENTLEMEN.",
    items: [
      {
        id: "custom-shirts",
        title: "Bespoke & Custom Shirts",
        tagline: "100% Egyptian Giza 140s Cotton",
        description:
          "Individually cut to your posture with 22 stitches per inch, split yoke construction, and hand-shanked Australian mother-of-pearl buttons. Choose from over 15 collar, cuff, and monogram styles.",
        image: "/prod_classic_white.jpg",
        link: "/custom-shirt",
        buttonText: "CUSTOMIZE SHIRT",
        highlights: ["Split 45° Yoke", "Mother-of-Pearl", "22 SPI Single-Needle"],
      },
      {
        id: "tailored-suits",
        title: "Made-to-Measure Suits & Blazers",
        tagline: "Biella Super 130s–150s Worsted Wool",
        description:
          "Hand-crafted with natural floating horsehair canvas that molds to your chest. Available in single-breasted, double-breasted, and formal tuxedo silhouettes with full custom linings.",
        image: "/blazer_navy_wool.jpg",
        link: "/shop",
        buttonText: "VIEW SUITS",
        highlights: ["Floating Canvas", "Italian Worsted Wool", "Hand-Rolled Lapels"],
      },
      {
        id: "sartorial-trousers",
        title: "Sartorial Trousers & Gurkhas",
        tagline: "Pure Linen, Wool & Cotton Twill",
        description:
          "Engineered with classic Gurkha waistband tabs, side adjusters, deep pleats, and clean straight drapes. Cut to eliminate waistband pinching and provide all-day comfort.",
        image: "/pant_gurkha_olive.jpg",
        link: "/shop",
        buttonText: "VIEW TROUSERS",
        highlights: ["Gurkha Waistbands", "Side Adjusters", "Reinforced Crotch"],
      },
      {
        id: "ceremonial-wear",
        title: "Ceremonial & Evening Wear",
        tagline: "Bandhgalas, Tuxedos & Silk Ensembles",
        description:
          "Exquisite ceremonial garments for black-tie galas, weddings, and formal banquets. Features structured stand collars, satin lapels, and opulent silk-blend textures.",
        image: "/ceremonial_bandhgala.jpg",
        link: "/shop",
        buttonText: "EXPLORE CEREMONIAL",
        highlights: ["Stand Collar Structure", "Silk-Blend Luster", "Bespoke Finishing"],
      },
    ],
  },

  // 3. How it works: the 4-step tailoring process
  process: {
    titleLine: "HOW OUR TAILORING",
    titleAccent: "PROCESS WORKS.",
    intro:
      "From choosing your Italian cloth to receiving a master-tailored garment at your doorstep in four seamless steps.",
    phaseLabel: "PHASE {step}",
    footerLabel: "Precision Guaranteed",
    steps: [
      {
        step: "01",
        title: "Cloth & Styling Selection",
        subtitle: "Over 200+ Luxury Fabrics",
        description:
          "Select your preferred fabric from our curated library of Italian Super 150s wools, Egyptian Giza cottons, and Belgian linens. Choose collar shape, cuff architecture, button style, and custom embroidery.",
      },
      {
        step: "02",
        title: "40-Point Fit Algorithm",
        subtitle: "2-Minute Digital Fitting",
        description:
          "Enter your simple height, weight, and fit preferences. Our proprietary 40-point measurement vector system calculates your precise chest, shoulder slope, arm pitch, and waist dimensions without a tailor visit.",
      },
      {
        step: "03",
        title: "Master Atelier Handcraft",
        subtitle: "Individual 1-of-1 Pattern Drafting",
        description:
          "Your order is never pulled from stock. A bespoke paper pattern is drafted specifically for your posture, hand-cut by master cutters, and sewn using single-needle 22 SPI construction.",
      },
      {
        step: "04",
        title: "Insured Delivery & 100% Fit Guarantee",
        subtitle: "Complimentary Alterations Included",
        description:
          "Your garment arrives steamed in our luxury packaging. If any adjustment is needed, we cover full alteration costs or provide a complimentary remake within 30 days.",
      },
    ],
  },

  // 4. Craftsmanship blueprint: interactive hallmarks
  anatomy: {
    titleLine: "ANATOMY OF A",
    titleAccent: "SUITOHOLIC GARMENT.",
    intro:
      "Select any hallmark below to inspect the micro-tailoring standards enforced across every bespoke shirt and suit.",
    metricTemplate: "STANDARD: {metric}",
    features: [
      {
        id: "split-yoke",
        number: "01",
        title: "Split Yoke Construction",
        subtitle: "Ergonomic 45° Diagonal Bias Cut",
        description:
          "Unlike mass-market shirts with a single flat piece of fabric across the upper back, our master cutters divide the yoke into two symmetrical halves cut at a 45-degree diagonal bias. This allows the natural weave of the cotton to stretch and move with your shoulder blades, preventing tightness across the back during movement.",
        image: "/about_craft_split_yoke.jpg",
        metric: "45° Diagonal Bias",
        detailBadge: "ERGONOMIC DRAPE",
      },
      {
        id: "floating-canvas",
        number: "02",
        title: "Hand-Basted Floating Canvas",
        subtitle: "Natural Horsehair & Linen Architecture",
        description:
          "We strictly reject thermal chemical glues and fused synthetic backings. Instead, our tailors hand-stitch loose layers of natural horsehair and linen canvas between the cloth layers. Over time, your natural body heat molds the floating canvas to your exact chest contours for a bespoke silhouette that only improves with age.",
        image: "/about_craft_floating_canvas.jpg",
        metric: "100% Natural Canvas",
        detailBadge: "BREATHABLE MEMORY",
      },
      {
        id: "stitch-density",
        number: "03",
        title: "22 Stitches-Per-Inch Seaming",
        subtitle: "Ultra-Fine Single-Needle French Seams",
        description:
          "Standard industrial dress shirts settle for 12 to 14 loose stitches per inch. Suitoholic enforces an exacting 22 SPI standard executed with single-needle French seams. The outcome is an exceptionally strong, wafer-thin seam line that lays perfectly flat against the skin and resists puckering after laundering.",
        image: "/about_craft_buttons_shell.jpg",
        metric: "22 SPI Micro-Stitch",
        detailBadge: "SINGLE-NEEDLE CRAFT",
      },
      {
        id: "mop-buttons",
        number: "04",
        title: "Australian Mother-of-Pearl",
        subtitle: "Hand Cross-Stitched with Thread Shanks",
        description:
          "Every button is precision-carved from genuine deep-sea Australian mother-of-pearl oyster shell, characterized by its natural iridescence and cool tactile weight. Each button is hand cross-stitched with a raised thread shank, allowing it to glide smoothly through buttonholes without pulling the fabric.",
        image: "/about_craft_buttons_shell.jpg",
        metric: "4.0mm Genuine Shell",
        detailBadge: "PACIFIC PEARL",
      },
      {
        id: "french-cuff",
        number: "05",
        title: "Dual-Use Convertible Cuffs",
        subtitle: "Precision Mitered Edges & Swiss Interlining",
        description:
          "Constructed with lightweight floating Swiss interlining that retains a crisp, elegant roll without ever feeling stiff or cardboard-like. Designed with convertible dual buttonholes so you can wear them with mother-of-pearl buttons for daytime business or insert formal cufflinks for black-tie galas.",
        image: "/about_craft_cuff_link.jpg",
        metric: "Dual Convertible",
        detailBadge: "FORMAL VERSATILITY",
      },
    ],
  },

  // 5. Heritage chronicle: interactive milestones
  heritage: {
    titleLine: "TWO DECADES OF",
    titleAccent: "SARTORIAL LEADERSHIP.",
    intro:
      "From our first bespoke cutting table to dressing leaders across 42 countries. Select a milestone below to explore our historical archives.",
    benchmarkTemplate: "ARCHIVAL BENCHMARK: {label}",
    archiveLabel: "Suitoholic Archive",
    milestones: [
      {
        year: "2003",
        tag: "THE INCEPTION",
        location: "New Delhi Atelier",
        title: "The First Cutting Bench",
        subtitle: "Reclaiming the uncompromising art of individual pattern drafting.",
        story:
          "Suitoholic was founded by master bespoke cutters trained in heritage tailoring. Frustrated by the shortcuts of industrial ready-to-wear sizing, they committed to a singular standard: every single garment must begin from a fresh individual paper pattern drafted by hand to the client's unique physique and shoulder pitch.",
        image: "/about_heritage_2003_archive.jpg",
        photoCaption: "Master Tailor Bespoke Cutting Bench • Est. 2003",
        metricLabel: "ESTABLISHED",
        metricValue: "NEW DELHI, INDIA",
      },
      {
        year: "2009",
        tag: "PROVENANCE",
        location: "Biella, Italy & Nile Delta",
        title: "Direct Textile Mill Alliances",
        subtitle: "Securing exclusive access to the world's purest natural fibers.",
        story:
          "To guarantee uncompromising cloth quality, we bypassed commercial fabric wholesalers to establish direct procurement agreements with multi-generational weaving mills in Biella, Northern Italy (for Super 150s worsted wool) and agricultural cooperatives in Egypt's Nile Delta (for authentic 140s Extra-Long Staple Giza cotton).",
        image: "/about_heritage_mill_loom.jpg",
        photoCaption: "Historic Biella Woolen Looms • Piedmont, Italy",
        metricLabel: "TEXTILE INTEGRITY",
        metricValue: "100% TRACEABLE",
      },
      {
        year: "2016",
        tag: "DIGITAL BESPOKE",
        location: "Research & Design Atelier",
        title: "40-Point Anatomical Master Fit",
        subtitle: "Savile Row precision engineered into an intuitive digital fitting room.",
        story:
          "Drawing from over a decade of bespoke cutting records, our tailors mapped 40 individual body measurement vectors. This allowed clients across the globe to achieve true Savile Row drape and proportion online in under two minutes, eliminating the requirement for multiple in-person fittings.",
        image: "/about_hero_cutting_table.jpg",
        photoCaption: "40-Point Vector Pattern Architecture",
        metricLabel: "FIT PRECISION",
        metricValue: "40 VECTORS",
      },
      {
        year: "2023",
        tag: "20-YEAR MILESTONE",
        location: "Global Sartorial Presence",
        title: "Two Decades of Craftsmanship",
        subtitle: "Over 150,000 bespoke garments delivered across 42 countries.",
        story:
          "Celebrating twenty years of sartorial leadership, Suitoholic has dressed heads of state, corporate leaders, and menswear connoisseurs worldwide. Maintaining a 99.4% first-fit accuracy rate, we cemented our reputation as one of the world's most trusted bespoke institutions.",
        image: "/about_craft_floating_canvas.jpg",
        photoCaption: "Hand-Basted Floating Canvas Craftsmanship",
        metricLabel: "GLOBAL CLIENTELE",
        metricValue: "42 COUNTRIES",
      },
      {
        year: "Today",
        tag: "SUSTAINABLE LUXURY",
        location: "Flagship Salons Worldwide",
        title: "The Zero-Waste Sartorial House",
        subtitle: "100% on-demand garment creation with zero warehouse overproduction.",
        story:
          "We remain fiercely dedicated to ethical on-demand craft. We manufacture zero mass-market stock, produce zero deadstock fabric waste, and craft exclusively with biodegradable natural fibers—demonstrating that true luxury is sustainable by design.",
        image: "/about_atelier_salon_cta.jpg",
        photoCaption: "Bespoke Flagship Fitting Salon & Atelier",
        metricLabel: "PRODUCTION MODEL",
        metricValue: "100% ON-DEMAND",
      },
    ],
  },

  // 6. Concierge & flagship services (icon keys listed at the top of this file)
  concierge: {
    title: "TAILORING CONCIERGE & APPOINTMENTS",
    services: [
      {
        icon: "scissors",
        title: "Flagship Studio Fitting",
        description:
          "Experience personal one-on-one master draper consultations at our flagship studio. Try fabric swatches, drape sample canvases, and configure your bespoke wardrobe.",
        note: "Mon–Sat: 10:00 AM – 8:30 PM",
      },
      {
        icon: "crown",
        title: "Wedding & Executive Ensembles",
        description:
          "Dedicated sartorial wardrobe curation for grooms, black-tie celebrations, and executive leadership teams with private group fitting sessions.",
        note: "Custom Monograms & Silk Linings",
      },
      {
        icon: "shieldCheck",
        title: "30-Day Fit Guarantee",
        description:
          "Every online custom order is backed by our full fit pledge. If any adjustment is needed, we cover local alteration costs or remake the garment free of charge.",
        note: "Zero Risk • Doorstep Remake",
      },
    ],
  },

  // 7. Atelier salon invitation (closing call to action)
  cta: {
    titleLine: "EXPERIENCE TRUE",
    titleAccent: "BESPOKE LUXURY.",
    description:
      "Step into our digital fitting room. Customize your collar shape, cuff style, pocket architecture, and bespoke monogram in under two minutes — tailored by master artisans and delivered with our 100% Fit Guarantee.",
    primaryButtonLabel: "START YOUR CUSTOM FIT",
    primaryButtonHref: "/custom-shirt",
    secondaryButtonLabel: "EXPLORE COLLECTION",
    secondaryButtonHref: "/shop",
    image: "/about_atelier_salon_cta.jpg",
    imageAlt: "Suitoholic Bespoke Sartorial Salon & Fitting Lounge",
  },
};

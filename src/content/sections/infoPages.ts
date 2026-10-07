// Simple text pages served at /<slug> (linked from the footer and header).
// Body formatting: separate paragraphs with a blank line; start a line with "## " for a
// heading and "- " for a bullet point. Starter copy — review before going live.
// showContactForm adds a contact form whose messages appear in Admin → Inquiries.
export const infoPages = {
  pages: [
    {
      slug: "contact",
      eyebrow: "CONCIERGE",
      title: "CONTACT US",
      intro: "Our atelier concierge is here to help with fittings, orders and bespoke requests.",
      body: "## Visit the Atelier\nAppointments are available Monday to Saturday, 11am – 8pm.\n\n## Write to Us\nSend us a message using the form below and our team will reply within one working day.",
      showContactForm: true,
    },
    {
      slug: "returns",
      eyebrow: "CUSTOMER CARE",
      title: "RETURNS & EXCHANGES",
      intro: "Every bespoke piece is covered by our 30-day fit guarantee.",
      body: "## 30-Day Fit Guarantee\nIf your garment doesn't fit as promised, we will alter or remake it free of charge within 30 days of delivery.\n\n## How to Request an Alteration\n- Contact our concierge with your order number\n- Share a photo and describe the fit concern\n- We arrange pickup and return the corrected garment\n\n## Exceptions\nMonogrammed and fully bespoke garments are made to your measurements and can't be returned for a refund, but remain covered by the fit guarantee.",
      showContactForm: false,
    },
    {
      slug: "shipping",
      eyebrow: "CUSTOMER CARE",
      title: "SHIPPING POLICY",
      intro: "Hand-crafted to order and dispatched with care.",
      body: "## Production Time\nBespoke garments are cut and sewn to order and dispatched within 7–10 working days.\n\n## Delivery\nWe ship across India with tracked courier partners. You can follow your order on the Track Order page.",
      showContactForm: false,
    },
    {
      slug: "privacy",
      eyebrow: "LEGAL",
      title: "PRIVACY POLICY",
      intro: "How we collect and use your information.",
      body: "## Information We Collect\nWe collect the details you provide when placing an order or subscribing: your name, contact details, shipping address and body measurements.\n\n## How We Use It\nWe use your information only to tailor and deliver your order, provide customer support and, if you subscribe, send our newsletter.\n\n## Contact\nFor any privacy request, please contact our concierge.",
      showContactForm: false,
    },
    {
      slug: "terms",
      eyebrow: "LEGAL",
      title: "TERMS & CONDITIONS",
      intro: "The terms that apply when you shop with Suitoholic.",
      body: "## Orders\nAn order is confirmed once our team has verified your measurements.\n\n## Pricing\nAll prices are in Indian Rupees and inclusive of applicable taxes.",
      showContactForm: false,
    },
    {
      slug: "fabric-care",
      eyebrow: "CUSTOMER CARE",
      title: "FABRIC CARE",
      intro: "Keep your tailored pieces looking their best.",
      body: "## Shirts\n- Wash cold, inside out\n- Hang to dry and iron while slightly damp\n- Remove collar stays before washing\n\n## Suits & Blazers\n- Dry clean only, sparingly\n- Rest on a shaped hanger between wears",
      showContactForm: false,
    },
    {
      slug: "faq",
      eyebrow: "CUSTOMER CARE",
      title: "FREQUENTLY ASKED QUESTIONS",
      intro: "Answers to common questions about bespoke ordering.",
      body: "## How do I choose my size?\nUse the 6-step customizer on any product page; it calculates collar and shoulder from your chest size.\n\n## How long does a bespoke order take?\nMost orders are dispatched within 7–10 working days.\n\n## Can I change my order?\nContact our concierge as soon as possible — changes are possible until cutting begins.",
      showContactForm: false,
    },
  ],
  contactForm: {
    heading: "SEND A MESSAGE",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone (optional)",
    messageLabel: "Message",
    submitLabel: "SEND MESSAGE",
    sendingLabel: "SENDING…",
    successMessage: "Thank you — our concierge will be in touch shortly.",
  },
};

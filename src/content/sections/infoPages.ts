// Simple text pages served at /<slug> (linked from the footer and header).
// Body formatting: separate paragraphs with a blank line; start a line with "## " for a
// heading, "### " for a subheading, and "- " for a bullet point.
// showContactForm adds a contact form whose messages appear in Admin → Inquiries.

export const infoPages = {
  pages: [
    {
      slug: "returns",
      eyebrow: "CUSTOMER CARE",
      title: "RETURN & EXCHANGE POLICY",
      intro: "At Suitoholic, we want you to receive the right product and the right fit.",
      body: `Returns or exchanges are accepted only in the following cases:

- **Wrong Product Delivered:** If you receive a product different from the one you ordered.
- **Size Issue:** If the delivered product has a size-related issue, subject to our exchange policy and product eligibility.

Please contact us within 7 days of delivery to request a return or exchange. The product must be unused, unwashed, unworn and returned with its original tags and packaging.

## Please Note
- Returns or exchanges are not accepted for change of mind, personal preference, or reasons other than the above, except where required under applicable law.
- Customized or made-to-order products are not eligible for exchange due to customer-provided incorrect measurements or change of preference.
- If you receive a damaged, defective or incorrect product, please contact us with photographs so we can review and assist you.

For return or exchange assistance, contact us at **+91 6353994123** or **infosuitoholic@gmail.com**.`,
      showContactForm: false,
    },
    {
      slug: "shipping",
      eyebrow: "CUSTOMER CARE",
      title: "SHIPPING POLICY",
      intro: "The following delivery estimates are proposed and must be confirmed against Suitoholic's actual production and courier timelines.",
      body: `## Order processing
- **Ready-made orders:** proposed dispatch within 2–5 business days after order confirmation.
- **Customized orders:** proposed dispatch within 7–15 business days, depending on customization and production requirements.

## Delivery
After dispatch, courier delivery is estimated at 3–7 business days, depending on the destination, courier service, and circumstances. These are estimates, not guaranteed delivery dates.

Shipping charges, if any, will be displayed during checkout or communicated before order confirmation. Tracking details will be shared when available.

Please ensure your shipping address and contact number are correct. Delays may occur due to weather, courier disruptions, holidays, remote-area delivery, or other circumstances outside our control.

For shipping assistance, contact **+91 6353994123** or email **infosuitoholic@gmail.com**.`,
      showContactForm: false,
    },
    {
      slug: "fabric-care",
      eyebrow: "CUSTOMER CARE",
      title: "FABRIC CARE GUIDE",
      intro: "Our garments are tailored from the world's finest natural fibers—pure 2-ply Egyptian Giza cotton, artisanal twills, and French flax linen. Proper care preserves their supple hand-feel, rich drape, and crisp structure for decades.",
      body: `## 1. Egyptian Giza Cotton & Royal Twill Shirts
Pure long-staple Egyptian cotton is celebrated for its silk-like softness, natural breathability, and enduring strength:
- **Washing:** Machine wash on a gentle cycle in cold or lukewarm water (max 30°C / 85°F). Always unbutton the shirt completely, turn it inside out, and wash with similar colors.
- **Detergent:** Use a mild liquid detergent free of harsh optical brighteners, chlorine bleach, or industrial enzymes. Never use chlorine bleach on luxury cotton.
- **Collar Stays:** Always remove removable collar stays before laundering. This prevents collar edge wear and maintains the crisp shape of your collar points.
- **Drying:** Never tumble dry bespoke shirts on high heat, as high heat weakens natural cotton fibers and causes premature shrinkage. Hang immediately on a contoured wooden or padded hanger in the shade.
- **Ironing:** Iron while the cotton is still slightly damp using medium-high heat with steam. Press the collar points gently from the outer tips inward toward the center to avoid bunching and creases.

## 2. Pure French Flax Linen & Linen Blends
Pure linen is a natural, resilient fiber that grows softer, more supple, and more characterful with every wash:
- **Washing:** Hand wash or use a gentle machine cycle in cold water with mild detergent. Avoid crowding linen with heavy garments.
- **Drying:** Smooth out collars, cuffs, and front seams by hand while damp. Hang to dry in a shaded, well-ventilated space.
- **Pressing:** Linen possesses an effortless, relaxed natural texture. If pressing for a crisp finish, iron on high heat with generous steam while the fabric is damp. Avoid pressing linen completely bone-dry.

## 3. Luxury Satin Twill & Silk-Touch Textures
Lustrous satin twills feature an ultra-smooth floating weave that reflects ambient light:
- **Washing:** Wash gently in cold water with minimal agitation. Do not wring, twist, or scrub aggressively against the sateen surface.
- **Ironing:** Always iron on the reverse (inner) side using low-to-medium heat. Use a pressing cloth to preserve the natural silk-touch sheen and prevent surface shine marks.

## 4. Caring for Collars, Cuffs & Monograms
- **Collar & Cuff Structures:** Our bespoke collars and cuffs use premium interlinings. Never scrub collar edges with stiff bristle brushes.
- **Embroidered Monograms:** To keep embroidered monogram initials sharp and dimensional, iron the cuff from the inside over a soft terry towel.
- **Buttons:** Hand-turned mother-of-pearl buttons are natural and heat-resistant, but avoid heavy direct clamp pressing from commercial dry-cleaning laundries.

## 5. Storage, Rotation & Travel Tips
- **Hangers:** Always use contoured wooden hangers that support the shoulder slope. Button the top collar button to preserve the roll of the collar.
- **Resting:** Allow your luxury shirts to rest for at least 24 hours between wears so the natural cotton fibers can breathe and recover their natural shape.
- **Garment Bags:** Store off-season shirts in breathable cotton garment bags, avoiding sealed plastic dry-cleaner bags that trap moisture.`,
      showContactForm: false,
    },
    {
      slug: "terms",
      eyebrow: "LEGAL",
      title: "TERMS & CONDITIONS",
      intro: "By accessing or shopping on suitoholic.shop, you agree to the site's applicable terms. Please read them carefully.",
      body: `## Website use and orders
- Please provide accurate contact, address, and order information.
- Orders are subject to product availability, payment verification, and confirmation by Suitoholic.
- Prices, product details, and offers may be updated. The price and terms applicable to a confirmed order will be communicated through the checkout or order confirmation process.

## Product and customization
We aim to display product colours, textures, and details accurately. Actual appearance may vary due to screen settings, lighting, or manufacturing variations. Customers are responsible for reviewing and submitting customization and measurement details carefully.

## Shipping, returns and payment
Shipping and return/exchange terms are described in the corresponding policies on this website. Payment options available at checkout will apply to the order.

## Intellectual property
Website content, photographs, branding, designs, text, and graphics may be protected by intellectual-property laws and may not be copied or used without permission, except where permitted by law.

## Legal rights and changes
Nothing in these terms is intended to exclude or restrict consumer rights or remedies that cannot lawfully be excluded. Suitoholic may update website content or these terms; changes will be posted on the website.

For questions, contact **infosuitoholic@gmail.com** or **+91 6353994123**.`,
      showContactForm: false,
    },
    {
      slug: "privacy",
      eyebrow: "LEGAL",
      title: "PRIVACY POLICY",
      intro: "Suitoholic respects your privacy. This policy describes how information may be collected and used when you visit or shop at suitoholic.shop.",
      body: `## Information we may collect
- Contact and account information, such as name, phone number, email address, and shipping or billing address.
- Order details, product preferences, and measurements or fit information that you choose to provide.
- Payment-related information handled by payment providers. We may receive transaction status and limited details, but payment credentials may be processed directly by the payment provider.
- Device, browser, website usage, and cookie information, where enabled.

## How we use information
- To process, deliver, and support orders; provide sizing or customization; and manage returns, exchanges, and customer enquiries.
- To communicate order updates, service information, or promotional messages where permitted.
- To improve our website, services, customer experience, security, and compliance with applicable law.

## Sharing information
We may share relevant information with service providers such as payment processors, delivery partners, hosting providers, and customer-support or website tools, as needed to operate our services. We do not intend to sell personal information.

## Security, choices and contact
We take reasonable steps to protect information, but no online system can be guaranteed to be completely secure. You may contact us to request access, correction, or deletion where applicable, subject to legal and operational requirements. Cookies or similar technologies may be used.

**Privacy contact:** infosuitoholic@gmail.com | +91 6353994123`,
      showContactForm: false,
    },
    {
      slug: "faq",
      eyebrow: "HELP & SUPPORT",
      title: "FREQUENTLY ASKED QUESTIONS",
      intro: "Frequently asked questions about ordering, sizing, delivery, customization, and returns at Suitoholic.",
      body: `## What is Suitoholic?
Suitoholic is a clothing and tailoring brand focused on premium fabrics, craftsmanship, and fit, with online shopping and fitting options available through suitoholic.shop.

## How do I choose my size?
Simply select your favourite shirt on Suitoholic.shop and follow our simple 6-step sizing process to find the perfect fit according to your body type, height and preferences.

## Can I customize my fit?
Where customization is offered, follow the options available on the product page and submit the requested details carefully.

## How long does delivery take?
Proposed estimates: ready-made orders dispatch in 2–5 business days, customized orders in 7–15 business days, followed by estimated courier delivery of 3–7 business days.

## Can I return or exchange an item?
Returns or exchanges are accepted only for wrong products delivered or eligible size issues, within 7 days of delivery, subject to the conditions in our Return & Exchange Policy. Customized products may have different conditions. Please read the full policy and contact us for assistance.

## What if my order is damaged or incorrect?
Contact us as soon as possible with your order details and clear photos. Our team will review the issue and guide you through the appropriate resolution, subject to applicable law.

## How do I track my order?
Tracking details will be shared once your order is dispatched, when tracking is available.

## Do you deliver across India?
Delivery availability is shown during checkout or confirmed by our team, depending on the destination.

## Will product colours look exactly the same?
Colours may look slightly different due to screen display, lighting, or photography.

## How can I contact Suitoholic?
- **Phone / WhatsApp:** +91 6353994123
- **Email:** infosuitoholic@gmail.com
- **Website:** suitoholic.shop`,
      showContactForm: false,
    },
    {
      slug: "about-us",
      eyebrow: "OUR STORY",
      title: "ABOUT US",
      intro: "A Better Fit Starts Here.",
      body: `Established in 2003, Suitoholic brings more than two decades of tailoring experience, craftsmanship, and a commitment to quality and fit.

Our journey began with a focus on premium tailoring and personal service. We believe clothing should feel as good as it looks, and that the right fit makes all the difference.

With suitoholic.shop, we are bringing that experience into a convenient online journey—helping customers explore premium clothing and fitting options while keeping the spirit of personalized service at the heart of our brand.

At Suitoholic, we combine craftsmanship, thoughtful details, and a customer-first approach to make finding your fit easier.

## Suitoholic — A Better Fit Starts Here.
- **Website:** suitoholic.shop
- **Phone / WhatsApp:** +91 6353994123
- **Email:** infosuitoholic@gmail.com`,
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

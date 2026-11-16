// Simple text pages served at /<slug> (linked from the footer and header).
// Body formatting: separate paragraphs with a blank line; start a line with "## " for a
// heading, "### " for a subheading, and "- " for a bullet point.
// showContactForm adds a contact form whose messages appear in Admin → Inquiries.

export const infoPages = {
  pages: [
    {
      slug: "returns",
      eyebrow: "CUSTOMER CARE",
      title: "RETURNS & EXCHANGES",
      intro: "At Suitoholic, your satisfaction and sartorial confidence are our highest priorities. Every piece is crafted with meticulous care and backed by our commitment to quality.",
      body: `## 1. 7-Day Return & Exchange Window
We offer a 7-day return and exchange policy from the date your order is delivered to your address. Within this period, you may request an exchange for size, collar, or fit adjustments, or initiate a return for refund, provided your order meets our return eligibility criteria.

## 2. Eligibility & Garment Condition
To qualify for a return or exchange, items must satisfy the following conditions:
- The garment must be completely unused, unworn, unwashed, unaltered, and in its original pristine condition.
- All original brand tags, woven neck labels, spare button bags, and packaging must remain completely intact.
- Items with broken security seals, marks of perfume, deodorant, stains, or signs of laundering cannot be accepted for a return or refund.

## 3. Our 100% Bespoke Fit Guarantee
Because every bespoke and made-to-measure shirt at Suitoholic is individually drafted and stitched to your unique measurements, we stand firmly behind your fit:
- If your bespoke piece requires any minor sizing, sleeve, or waist adjustment, our master atelier provides **Complimentary Fit Alterations** within 30 days of delivery.
- Simply contact our concierge team with your order details and photos describing the fit adjustment needed.
- We will arrange a reverse pickup, perform the tailoring corrections at our Vapi atelier, and deliver the perfected garment back to you.

## 4. One-Time Exchange Policy
Each eligible order is entitled to a **one-time exchange** for a different size, sleeve length, or fabric (subject to cloth stock availability).
- Once approved, our team coordinates a reverse courier pickup from your address.
- A standard reverse logistics and inspection fee of **₹300** applies to cover courier charges and processing.

## 5. Inspection & Refund Timelines
- Returned parcels undergo a thorough quality and craftsmanship inspection at our atelier within **24 to 48 hours** of receipt.
- Once approved, refunds are initiated within **5 to 7 business days**.
- **Prepaid Orders (UPI, Cards, Net Banking):** The refund amount is credited directly back to your original payment source.
- **Cash on Delivery (COD) Orders:** Our concierge will request your preferred bank account or UPI ID for direct transfer.
- Original shipping fees paid at the time of purchase are non-refundable.

## 6. Non-Returnable & Final Sale Items
The following items cannot be returned or refunded:
- Monogrammed garments with custom-embroidered initials (these remain fully covered under our Complimentary Fit Alteration Guarantee).
- Items purchased during Final Archive Sale or clearance events marked as Non-Returnable.

## 7. How to Initiate a Return or Exchange
To start a request, please reach out to our concierge with your **Order Number** and email/phone:
- **WhatsApp & Phone:** +91 99799 38022 (Monday – Saturday, 10:00 AM – 8:30 PM)
- **Email:** infosuitoholic@gmail.com
- **Studio Address:** Suitoholic, Near Upasana School, Behind Gunjan Cinema, GIDC, Vapi, Gujarat - 396195`,
      showContactForm: false,
    },
    {
      slug: "shipping",
      eyebrow: "CUSTOMER CARE",
      title: "SHIPPING POLICY",
      intro: "Suitoholic delivers bespoke craftsmanship and sartorial luxury directly to your doorstep across India with tracked express logistics.",
      body: `## 1. Order Processing & Crafting Timeline
Every garment at Suitoholic is tailored to the highest standards of master cutting and bespoke finishing:
- **Bespoke Made-to-Measure Orders:** Please allow **3 to 7 business days** for master pattern drafting, precision cutting, single-needle stitching, and multi-point hand inspection before dispatch.
- **Curated In-Stock Essentials:** Quality-checked, steam-pressed, and dispatched within **24 to 48 business hours** (Monday through Saturday, excluding public holidays).
- Once your order is dispatched from our atelier, a shipment confirmation containing your live AWB tracking link is immediately sent via email, WhatsApp, and SMS.

## 2. Shipping Coverage & Partner Couriers
- We ship to over 19,000+ pin codes across all states and union territories in India.
- We partner exclusively with premium express courier networks—including Blue Dart, Delhivery, DTDC, and Express Cargo—to ensure prompt, insured transit.
- Currently, Suitoholic ships exclusively within India. For international inquiries, please contact our concierge directly.

## 3. Shipping Charges
- **Standard Express Shipping:** We offer **Free Express Shipping** on all prepaid orders across India.
- **Cash on Delivery (COD):** Available for serviceable pin codes with convenient advance partial-payment support.

## 4. Estimated Transit & Delivery Timelines
Delivery times from the date of dispatch:
- **Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad):** 2 to 4 business days.
- **Tier 2 & Tier 3 Cities:** 4 to 6 business days.
- **Remote, Hill & North-East Locations:** 5 to 7 business days.
*Please note that external transit delays caused by regional weather disruptions, festive courier backlogs, or remote accessibility may occasionally extend delivery timelines.*

## 5. Live Tracking Your Shipment
- As soon as your order is handed over to the courier, an active tracking link is generated.
- You can follow live shipment progress 24/7 on our dedicated **Track Order** page (/track-order).
- Please allow up to 12–24 hours for the carrier's portal to reflect real-time waypoint updates.

## 6. Damaged, Tampered, or Incomplete Packages
- All Suitoholic parcels are securely packed in heavy-duty, tamper-evident bespoke packaging.
- If the outer box or seal appears torn, damaged, or opened upon delivery, please **do not accept the package** or record an unboxing video before opening.
- Notify our concierge team within **24 hours** at **+91 99799 38022** or **infosuitoholic@gmail.com** with photos of the damaged parcel so we can immediately arrange a replacement.

## 7. Return to Origin (RTO) & Delivery Attempts
- Our courier partners make up to 3 delivery attempts and will attempt to call your registered phone number.
- In the event that a shipment is returned to our atelier due to an incorrect/incomplete address, recipient unavailability, or refusal, an **RTO charge of ₹300** applies to cover round-trip logistics for re-dispatch.`,
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
      intro: "Please review these Terms and Conditions carefully. They govern your access to and use of our bespoke tailoring services, digital customizer, and purchases made through suitoholic.com.",
      body: `## 1. General Agreement & About Us
This website (suitoholic.com) is owned and operated by **Suitoholic Atelier**, having its registered workshop and studio at:
Suitoholic, Near Upasana School, Behind Gunjan Cinema, GIDC, Vapi, Gujarat - 396195, India.
By accessing our website, browsing our collections, or placing an order through our digital customizer, you agree to be bound by these Terms & Conditions and our published policies.

## 2. User Eligibility & Account Accuracy
- You must be at least 18 years of age or accessing under the supervision of a parent or legal guardian to make purchases.
- You agree to provide truthful, accurate, and complete information regarding your contact details, delivery addresses, and body measurement submissions.
- Suitoholic reserves the right to refuse service, terminate accounts, or cancel orders at our discretion if fraudulent or unlawful activity is suspected.

## 3. Bespoke Tailoring & Sizing Specifications
- Every bespoke garment is individually cut and stitched according to the chest size, body type (Lean, Regular, Tummy), height, collar style, and cuff choices submitted by the patron.
- In artisanal tailoring, allowable hand-crafting tolerances of up to ±0.5 inches are standard across industry practices.
- While we make every effort to display fabric colors, textures, and stripe weaves accurately, slight variations may exist between screen displays and physical woven textiles due to monitor color calibration and ambient lighting.

## 4. Pricing, Taxes & Payment Methods
- All product and service prices on suitoholic.com are listed in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST).
- We reserve the right to modify pricing, special commissions, or fabric availability without prior notice.
- Payments are processed via encrypted, RBI-compliant, PCI-DSS certified payment gateways. We accept UPI, Credit Cards, Debit Cards, Net Banking, and Cash on Delivery (COD).

## 5. Order Confirmation, Cutting & Modifications
- An order is considered confirmed once payment authorization is received or COD verification is completed.
- Because bespoke orders involve custom fabric cutting specifically for your order, requests for design modifications, monogram changes, or cancellations must be communicated within **24 hours of placing your order** before master cutting commences.

## 6. Intellectual Property Protection
- All text, graphics, logos, icons, lookbook imagery, customizer interfaces, bespoke pattern software, and branding appearing on suitoholic.com are the exclusive intellectual property of Suitoholic.
- No content may be copied, reproduced, scraped, republished, or exploited for commercial purposes without prior written authorization from Suitoholic.

## 7. Limitation of Liability
- Suitoholic shall not be liable for any indirect, incidental, or consequential damages resulting from courier transit delays, third-party logistics failures, or improper garment maintenance contrary to our Fabric Care Guide.
- Our total liability for any claim arising from an order shall not exceed the amount actually paid by you for the specific garment in question.

## 8. Governing Law & Jurisdiction
- These Terms & Conditions are governed by and construed in accordance with the laws of India.
- Any disputes or legal claims arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in **Vapi / Valsad District, Gujarat**.

## 9. Customer Support & Contact
For inquiries regarding our terms, please contact our concierge:
- **Phone & WhatsApp:** +91 99799 38022 (Monday – Saturday, 10:00 AM – 8:30 PM)
- **Email:** infosuitoholic@gmail.com
- **Studio Address:** Suitoholic, Near Upasana School, Behind Gunjan Cinema, GIDC, Vapi, Gujarat - 396195`,
      showContactForm: false,
    },
    {
      slug: "privacy",
      eyebrow: "LEGAL",
      title: "PRIVACY POLICY",
      intro: "At Suitoholic, we treat your personal privacy and sartorial measurement data with the same uncompromising care, precision, and confidentiality that we apply to our handcrafted garments.",
      body: `## 1. Information We Collect
We collect information necessary to deliver exceptional bespoke tailoring and customer service:
- **Personal Information:** Name, email address, telephone/WhatsApp number, shipping address, and billing address.
- **Bespoke Measurement Profiles:** Chest size, stomach/waist measurement, body shape (Lean Fit, Regular Fit, Tummy Fit), height proportion, collar style, cuff preferences, and monogram initials.
- **Payment Information:** All digital payments are processed through certified, RBI-compliant payment gateways. Suitoholic does not collect, handle, or store raw credit card numbers, CVVs, or net banking passwords on our servers.
- **Technical & Browsing Data:** IP address, browser type, device information, and essential session cookies to remember your bag selections and customizer state.

## 2. How We Use Your Information
We use the information collected strictly for legitimate sartorial and operational purposes:
- To individually draft, cut, stitch, and deliver your bespoke garments to your exact measurements.
- To communicate order confirmations, provide real-time WhatsApp/SMS shipping updates, and assist with fit consultations.
- To maintain your secure bespoke measurement profile for effortless one-click future reorders.
- To send occasional atelier journals, new luxury cloth releases, and seasonal updates (only if you subscribe; you may unsubscribe at any time with one click).

## 3. Strict Non-Disclosure & Data Protection
- **We never sell, rent, trade, or monetize your personal details or measurement profiles with third-party advertising companies or marketing data brokers.**
- Your data is shared strictly with essential operational service partners who are bound by stringent confidentiality agreements:
  - **Logistics Partners:** Trusted courier partners (Blue Dart, Delhivery) solely for delivering your orders to your address.
  - **Payment Gateways:** Certified payment processors for executing secure financial transactions.

## 4. Cookies & Web Tracking
- **Essential Cookies:** Required for basic site navigation, maintaining shopping bag contents, and user session authentication.
- **Performance Cookies:** Help us analyze site loading speed, popular fabric searches, and checkout fluidity to optimize user experience.
- You can manage or disable cookies via your browser settings, though certain customizer features may be affected.

## 5. Security of Your Personal Information
- We implement industry-standard 256-bit SSL/TLS encryption for all data transmitted between your browser and our servers.
- Our databases are maintained in secure cloud environments with restricted administrative access, regular security audits, and firewall defenses.

## 6. Your Rights & Data Control
- You have the right to review, update, or request the deletion of your personal account information and saved measurement profiles at any time.
- To request a copy of your stored data or request complete data deletion, please contact our concierge at infosuitoholic@gmail.com.

## 7. Policy Updates & Grievance Redressal
- We may periodically update this Privacy Policy to reflect evolving regulatory standards or service enhancements. The latest revision date is always posted at the top of this document.
- If you have questions, concerns, or grievances regarding our privacy practices, please contact our Grievance Officer:
  - **Atelier:** Suitoholic Atelier, Near Upasana School, Behind Gunjan Cinema, GIDC, Vapi, Gujarat - 396195
  - **Phone:** +91 99799 38022
  - **Email:** infosuitoholic@gmail.com`,
      showContactForm: false,
    },
    {
      slug: "faq",
      eyebrow: "CUSTOMER CARE",
      title: "FREQUENTLY ASKED QUESTIONS",
      intro: "Answers to common questions about bespoke ordering, measuring, fabrics, and deliveries.",
      body: `## How do I choose my size?
Use the 6-step customizer on any product page. It intelligently calculates ideal proportions based on your chest size, posture/body type (Lean, Regular, Tummy), and height.

## How long does a bespoke order take?
Every bespoke piece is crafted to order with single-needle tailoring and dispatched within 3 to 7 working days.

## Can I change my order details after placing it?
Please contact our concierge within 24 hours of placing your order. We can adjust measurements, sleeve styles, or monograms before cutting begins.

## What is your 100% Fit Guarantee?
If your shirt requires any fit adjustment upon arrival, we provide complimentary tailoring alterations within 30 days of delivery.`,
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

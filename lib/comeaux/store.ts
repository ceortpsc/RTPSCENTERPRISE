export const STORE = {
  name: "Comeaux Clinical Supply & Print Co.",
  shortName: "Comeaux Clinical",
  tagline: "Clinical essentials. Personalized with care.",
  founder: "Alzor Comeaux, LVN",
  founderDescriptor: "Wound-care nursing background",
  supportEmail: "support@comeauxclinicalsupply.com",
  currency: "USD",
  locale: "en-US",
  routeBase: "/comeaux-supply",
  copyrightOwner: "Comeaux Clinical Supply & Print Co."
} as const;

export type Product = {
  sku: string;
  slug: string;
  name: string;
  category: "scrubs" | "undergarments" | "badges" | "medical-supplies" | "print-services";
  description: string;
  quality: string;
  priceCents: number;
  quantityOnHand: number;
  customizable: boolean;
  regulated: boolean;
  fulfillmentClass: "stock" | "made-to-order" | "print-job";
};

export const PRODUCTS: Product[] = [
  {
    sku: "CCS-SCR-JOG-NVY-001",
    slug: "clinical-flex-jogger-scrub-set",
    name: "Clinical Flex Jogger Scrub Set",
    category: "scrubs",
    description: "Two-piece stretch scrub set with multi-pocket top and jogger-style pant.",
    quality: "Professional uniform grade; reinforced seams; colorfast care labeling required from supplier.",
    priceCents: 6499,
    quantityOnHand: 48,
    customizable: true,
    regulated: false,
    fulfillmentClass: "stock"
  },
  {
    sku: "CCS-UND-LSL-CRM-001",
    slug: "soft-layer-underscrub-top",
    name: "Soft Layer Underscrub Top",
    category: "undergarments",
    description: "Long-sleeve layering top intended for wear beneath uniforms.",
    quality: "Soft-touch stretch fabric; finished seams; supplier fiber-content and care label retained.",
    priceCents: 2699,
    quantityOnHand: 72,
    customizable: false,
    regulated: false,
    fulfillmentClass: "stock"
  },
  {
    sku: "CCS-BDG-ACR-CST-001",
    slug: "custom-clinical-name-badge",
    name: "Custom Clinical Name Badge",
    category: "badges",
    description: "Personalized professional name badge with configurable name, title, credentials and approved logo.",
    quality: "Proof-before-production workflow; high-resolution print/engrave output; durable fastener options.",
    priceCents: 1899,
    quantityOnHand: 250,
    customizable: true,
    regulated: false,
    fulfillmentClass: "made-to-order"
  },
  {
    sku: "CCS-MED-GZE-STR-001",
    slug: "sterile-gauze-pad-pack",
    name: "Sterile Gauze Pad Pack",
    category: "medical-supplies",
    description: "Factory-sealed sterile gauze pads sold according to manufacturer labeling.",
    quality: "Lot/expiration traceability required; tamper-evident packaging; no repackaging or therapeutic claims.",
    priceCents: 1299,
    quantityOnHand: 96,
    customizable: false,
    regulated: true,
    fulfillmentClass: "stock"
  },
  {
    sku: "CCS-PRN-DTF-CST-001",
    slug: "custom-apparel-print-service",
    name: "Custom Apparel Print Service",
    category: "print-services",
    description: "Upload-ready garment decoration workflow for approved customer-owned artwork.",
    quality: "Preflight review, proof approval, production record, print-job QC and rights-attestation required.",
    priceCents: 2400,
    quantityOnHand: 9999,
    customizable: true,
    regulated: false,
    fulfillmentClass: "print-job"
  }
];

export type PolicySlug = "privacy" | "terms" | "final-sale" | "shipping" | "medical-disclaimer";

export const POLICIES: Record<PolicySlug, { title: string; updated: string; body: string[] }> = {
  privacy: {
    title: "Privacy Notice",
    updated: "September 11, 2026",
    body: [
      "We collect information needed to operate the storefront, fulfill orders, prevent fraud, provide customer service, process payments through authorized providers, maintain tax and accounting records, and improve site performance.",
      "Payment-card credentials should be tokenized by the selected payment provider and should not be stored in this application database. Access to customer and employee information is role-limited, logged, and reviewed.",
      "Google services may receive limited data when you choose Google Sign-In, Google Pay, reCAPTCHA, analytics, or other Google-powered features. Their handling of information is governed by the applicable Google terms and privacy notices in addition to this notice.",
      "Do not submit patient charts, diagnoses, treatment notes, insurance identifiers, or other protected health information through ordinary storefront forms. This store is a retail operation, not a patient-care portal."
    ]
  },
  terms: {
    title: "Terms of Service",
    updated: "September 11, 2026",
    body: [
      "Products are offered subject to availability, pricing verification, lawful sale, supplier restrictions, and successful payment/fraud review.",
      "Customers must provide accurate order, shipping, customization, and contact information. Orders involving custom artwork require the customer to confirm that they own or are authorized to use the submitted intellectual property.",
      "Product photographs, descriptions, brand assets, templates, software, site copy, and original designs remain protected by applicable copyright, trademark, contract, and other intellectual-property laws.",
      "Medical-product descriptions are informational retail descriptions and do not create a clinician-patient relationship, diagnosis, prescription, or treatment recommendation."
    ]
  },
  "final-sale": {
    title: "Final Sale / No Exchange Policy",
    updated: "September 11, 2026",
    body: [
      "Customized, embroidered, engraved, printed, altered, clearance, opened hygiene-sensitive, and made-to-order goods are final sale and are not eligible for refund or exchange after production begins, except where required by law.",
      "Factory-defective, damaged-in-transit, materially misdescribed, or incorrectly fulfilled items remain subject to applicable legal remedies and carrier/vendor claim procedures.",
      "A final-sale policy does not override mandatory rights, charge corrections, shipment-delay refunds, product recalls, or other remedies required by federal, state, or local law.",
      "Customers should inspect customization proofs carefully. Approval of a proof authorizes production of the approved spelling, layout, credential line, logo placement, color, and size selections."
    ]
  },
  shipping: {
    title: "Shipping & Fulfillment Policy",
    updated: "September 11, 2026",
    body: [
      "Stock, made-to-order, and print-service items use separate production and shipment windows. The checkout flow must display a supportable estimated shipment window before payment is finalized.",
      "If an order cannot ship within the promised period, the customer must receive any delay notice, consent choice, cancellation option, or refund required by applicable law.",
      "Tracking events, carrier references, package status, address changes, delivery exceptions, and fulfillment scans should be written to the shipment audit ledger.",
      "Risk review may delay fulfillment when transaction signals indicate suspected fraud, identity misuse, payment mismatch, abnormal velocity, or other material risk."
    ]
  },
  "medical-disclaimer": {
    title: "Medical Product Disclaimer",
    updated: "September 11, 2026",
    body: [
      "Comeaux Clinical Supply & Print Co. is an online retail and customization business. Store content is not medical advice and is not a substitute for instructions from a licensed clinician or the product manufacturer.",
      "Use medical supplies only for their lawful, labeled intended purpose and follow manufacturer warnings, contraindications, storage directions, lot/expiration information, and recall notices.",
      "The catalog must not list prescription-only drugs, controlled substances, or products requiring a prescription or professional authorization unless the business has separately implemented and verified every license, credential, distribution, and regulatory requirement.",
      "The founder's nursing credentials identify professional background only and must not be used to imply that a retail purchase includes individualized clinical evaluation or treatment."
    ]
  }
};

export const formatMoney = (cents: number) =>
  new Intl.NumberFormat(STORE.locale, { style: "currency", currency: STORE.currency }).format(cents / 100);

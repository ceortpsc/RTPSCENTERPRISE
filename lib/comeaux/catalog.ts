export type BrandTier = "house" | "premium" | "mid-tier" | "budget" | "specialty";
export type CatalogStatus = "active" | "authorization-hold";
export type PriceKind = "retail" | "market-reference" | "starting-at";
export type StoreCategory = "scrubs" | "undergarments" | "badges" | "medical-supplies" | "print-services";

export type Product = {
  sku: string;
  slug: string;
  name: string;
  brand: string;
  brandTier: BrandTier;
  category: StoreCategory;
  productType: string;
  fitType: string;
  fabricTypes: string[];
  description: string;
  quality: string;
  priceCents: number;
  priceKind: PriceKind;
  priceCheckedAt: string;
  quantityOnHand: number;
  customizable: boolean;
  regulated: boolean;
  fulfillmentClass: "stock" | "made-to-order" | "print-job";
  catalogStatus: CatalogStatus;
  resellerAuthorizationRequired: boolean;
  googleSyncEnabled: boolean;
  imageUrl: string;
  imageAlt: string;
  imageSource: "house-artwork" | "supplied-reference";
  sourceUrl?: string;
  tags: string[];
};

export const TAXONOMY = {
  brandTiers: ["House", "Premium", "Mid-Tier", "Budget", "Specialty"],
  fitTypes: ["Modern Fit", "Classic Fit", "Athletic Fit", "Plus Size", "Unisex", "Layering", "Custom / N-A"],
  fabricTypes: ["4-way stretch", "Moisture-wicking", "Antimicrobial", "Cotton blend", "Recycled fabric", "Soft-touch stretch", "Medical gauze", "Rigid badge substrate", "Print substrate"],
  productTypes: ["Tops", "Pants", "Joggers", "Jackets", "Sets", "Lab Coats", "Underscrubs", "Name Badges", "Wound Care", "Print Services"]
} as const;

export const BRAND_REGISTRY = [
  ["Comeaux Clinical","house","Store pricing","private-label essentials, customization"],
  ["FIGS","premium","$60–$120 reference range","modern fit, performance"],
  ["Jaanuu","premium","$40–$90 reference range","fashion-forward, antimicrobial lines"],
  ["Fabletics Scrubs","premium","Product-specific reference pricing","athletic, extended sizing"],
  ["Barco / Grey's Anatomy","mid-tier","$25–$45 reference range","soft fabric, hospital wear"],
  ["Healing Hands","mid-tier","$25–$40 reference range","stretch, comfort"],
  ["Koi","mid-tier","$30–$50 reference range","nursing, fashion"],
  ["Med Couture","mid-tier","$20–$40 reference range","lightweight, breathable"],
  ["Barco One","specialty","Product-specific reference pricing","performance, recycled-fabric lines"],
  ["Cherokee","budget","$18–$35 reference range","bulk, uniform programs"],
  ["Dickies Medical","budget","Supplier quote required","durability, hospital uniforms"],
  ["WonderWink","budget","Supplier quote required","student programs, color selection"],
  ["Landau","budget","Supplier quote required","classic uniforms, bulk programs"],
  ["WonderWink Plus","specialty","Supplier quote required","extended sizing"],
  ["Koi Next Gen","specialty","Supplier quote required","boutique, modern styling"]
].map(([brand,tier,range,specialties]) => ({ brand, tier, range, specialties: specialties.split(", ") }));

const house = (p: Omit<Product, "brand"|"brandTier"|"catalogStatus"|"resellerAuthorizationRequired"|"imageSource"|"priceCheckedAt">): Product => ({
  ...p, brand: "Comeaux Clinical", brandTier: "house", catalogStatus: "active", resellerAuthorizationRequired: false,
  imageSource: "house-artwork", priceCheckedAt: "2026-09-11"
});

const ref = (p: Omit<Product, "catalogStatus"|"resellerAuthorizationRequired"|"googleSyncEnabled"|"quantityOnHand"|"customizable"|"regulated"|"fulfillmentClass"|"imageSource"|"priceKind"|"priceCheckedAt">): Product => ({
  ...p, catalogStatus: "authorization-hold", resellerAuthorizationRequired: true, googleSyncEnabled: false,
  quantityOnHand: 0, customizable: false, regulated: false, fulfillmentClass: "stock", imageSource: "supplied-reference",
  priceKind: "market-reference", priceCheckedAt: "2026-09-11"
});

export const PRODUCTS: Product[] = [
  house({sku:"CCS-SCR-JOG-NVY-001",slug:"clinical-flex-jogger-scrub-set",name:"Clinical Flex Jogger Scrub Set",category:"scrubs",productType:"Sets",fitType:"Athletic Fit",fabricTypes:["4-way stretch","Moisture-wicking"],description:"Two-piece stretch scrub set with multi-pocket top and jogger-style pant.",quality:"Professional uniform grade; reinforced seams; supplier fiber-content and care labeling retained.",priceCents:6499,priceKind:"retail",quantityOnHand:48,customizable:true,regulated:false,fulfillmentClass:"stock",googleSyncEnabled:true,imageUrl:"/comeaux/products/clinical-flex-jogger.svg",imageAlt:"Comeaux Clinical navy jogger scrub set",tags:["scrubs","set","jogger","customizable"]}),
  house({sku:"CCS-UND-LSL-CRM-001",slug:"soft-layer-underscrub-top",name:"Soft Layer Underscrub Top",category:"undergarments",productType:"Underscrubs",fitType:"Layering",fabricTypes:["Soft-touch stretch"],description:"Long-sleeve layering top intended for wear beneath uniforms.",quality:"Soft-touch stretch fabric; finished seams; supplier fiber-content and care label retained.",priceCents:2699,priceKind:"retail",quantityOnHand:72,customizable:false,regulated:false,fulfillmentClass:"stock",googleSyncEnabled:true,imageUrl:"/comeaux/products/underscrub.svg",imageAlt:"Cream long-sleeve underscrub top",tags:["underscrub","layering","uniform"]}),
  house({sku:"CCS-BDG-ACR-CST-001",slug:"custom-clinical-name-badge",name:"Custom Clinical Name Badge",category:"badges",productType:"Name Badges",fitType:"Custom / N-A",fabricTypes:["Rigid badge substrate"],description:"Personalized professional name badge with configurable name, title, credentials and approved logo.",quality:"Proof-before-production workflow; high-resolution print or engraving output; durable fastener options.",priceCents:1899,priceKind:"starting-at",quantityOnHand:250,customizable:true,regulated:false,fulfillmentClass:"made-to-order",googleSyncEnabled:true,imageUrl:"/comeaux/products/name-badge.svg",imageAlt:"Custom Comeaux Clinical professional name badge",tags:["badge","engraving","custom","credentials"]}),
  house({sku:"CCS-MED-GZE-STR-001",slug:"sterile-gauze-pad-pack",name:"Sterile Gauze Pad Pack",category:"medical-supplies",productType:"Wound Care",fitType:"Custom / N-A",fabricTypes:["Medical gauze"],description:"Factory-sealed sterile gauze pads sold according to manufacturer labeling.",quality:"Lot and expiration traceability required; tamper-evident packaging; no repackaging or therapeutic claims.",priceCents:1299,priceKind:"retail",quantityOnHand:96,customizable:false,regulated:true,fulfillmentClass:"stock",googleSyncEnabled:false,imageUrl:"/comeaux/products/gauze.svg",imageAlt:"Factory-sealed sterile gauze pad package",tags:["medical supplies","wound care","gauze","lot tracked"]}),
  house({sku:"CCS-PRN-DTF-CST-001",slug:"custom-apparel-print-service",name:"Custom Apparel Print Service",category:"print-services",productType:"Print Services",fitType:"Custom / N-A",fabricTypes:["Print substrate"],description:"Upload-ready garment decoration workflow for approved customer-owned artwork.",quality:"Preflight review, proof approval, production record, print-job QC and rights attestation required.",priceCents:2400,priceKind:"starting-at",quantityOnHand:9999,customizable:true,regulated:false,fulfillmentClass:"print-job",googleSyncEnabled:false,imageUrl:"/comeaux/products/print-service.svg",imageAlt:"Custom apparel print and decoration service",tags:["printing","DTF","custom","proof approval"]}),
  ref({sku:"CCS-REF-FIGS-CARGO-SET-W-001",slug:"figs-cargo-scrub-set-women",name:"FIGS The Cargo Scrub Set for Women",brand:"FIGS",brandTier:"premium",category:"scrubs",productType:"Sets",fitType:"Modern Fit",fabricTypes:["4-way stretch"],description:"Premium scrub-set reference listing with a modern, performance-oriented fit.",quality:"Verify authorized supply, exact fiber content, sizing, color and warranty before activation.",priceCents:9400,imageUrl:"https://th.bing.com/th?id=OPHS.KF%2BzKVYzOy8duw474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for FIGS The Cargo Scrub Set for Women",sourceUrl:"https://th.bing.com/th?id=OPHS.KF%2BzKVYzOy8duw474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["premium","set","modern fit","reference catalog"]}),
  ref({sku:"CCS-REF-JAN-RHENA-TOP-001",slug:"jaanuu-rhena-essential-v-neck-top",name:"Jaanuu Rhena Essential 1-Pocket V-Neck Scrub Top for Women",brand:"Jaanuu",brandTier:"premium",category:"scrubs",productType:"Tops",fitType:"Modern Fit",fabricTypes:["Antimicrobial"],description:"Fashion-forward V-neck scrub-top reference listing.",quality:"Verify antimicrobial claims, supplier authorization and manufacturer specifications before sale.",priceCents:4200,imageUrl:"https://th.bing.com/th?id=OPHS.%2BkXCBmGV0rmD4w474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Jaanuu Rhena Essential scrub top",sourceUrl:"https://th.bing.com/th?id=OPHS.%2BkXCBmGV0rmD4w474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["premium","top","modern fit","reference catalog"]}),
  ref({sku:"CCS-REF-FBL-DAILY-JKT-001",slug:"fabletics-daily-scrub-jacket",name:"Fabletics Women's Daily Scrub Jacket with 3 Pockets",brand:"Fabletics Scrubs",brandTier:"premium",category:"scrubs",productType:"Jackets",fitType:"Athletic Fit",fabricTypes:["Moisture-wicking"],description:"Athletic-inspired three-pocket scrub-jacket reference listing.",quality:"Verify authorized distribution, current sizing and fabric claims before activation.",priceCents:8995,imageUrl:"https://th.bing.com/th?id=OPHS.envI2KO%2BSigZLQ474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Fabletics Women's Daily Scrub Jacket",sourceUrl:"https://th.bing.com/th?id=OPHS.envI2KO%2BSigZLQ474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["premium","jacket","athletic fit","extended sizing","reference catalog"]}),
  ref({sku:"CCS-REF-BAR-GA-CORA-TOP-001",slug:"barco-greys-anatomy-cora-top",name:"BARCO Grey's Anatomy Cora Scrub Top for Women",brand:"Barco / Grey's Anatomy",brandTier:"mid-tier",category:"scrubs",productType:"Tops",fitType:"Modern Fit",fabricTypes:["Soft-touch stretch"],description:"Crossover V-neck scrub-top reference listing with a fitted-back silhouette.",quality:"Verify authorized supply and current manufacturer specifications before activation.",priceCents:3099,imageUrl:"https://th.bing.com/th?id=OPHS.wCAgOYMLlKf0nw474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for BARCO Grey's Anatomy Cora scrub top",sourceUrl:"https://th.bing.com/th?id=OPHS.wCAgOYMLlKf0nw474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["mid-tier","top","soft fabric","reference catalog"]}),
  ref({sku:"CCS-REF-HH-2278-TOP-001",slug:"healing-hands-2278-v-neck-top",name:"Healing Hands Scrubs Top 3 Pocket V-Neck 2278",brand:"Healing Hands",brandTier:"mid-tier",category:"scrubs",productType:"Tops",fitType:"Modern Fit",fabricTypes:["4-way stretch"],description:"Three-pocket V-neck scrub-top reference listing positioned for daily clinical wear.",quality:"Verify authorized supply, fiber content, sizing and manufacturer care instructions before sale.",priceCents:2722,imageUrl:"https://th.bing.com/th?id=OPHS.CxjkjkiwkXlv4A474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Healing Hands 2278 V-neck scrub top",sourceUrl:"https://th.bing.com/th?id=OPHS.CxjkjkiwkXlv4A474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["mid-tier","top","stretch","reference catalog"]}),
  ref({sku:"CCS-REF-KOI-731-PANT-001",slug:"koi-basics-731-scrub-pants",name:"Koi Basics Koi731 Scrub Pants for Women",brand:"Koi",brandTier:"mid-tier",category:"scrubs",productType:"Pants",fitType:"Classic Fit",fabricTypes:["Cotton blend"],description:"Women's scrub-pant reference listing positioned for comfort and everyday clinical wear.",quality:"Exact fabric composition and fit must be verified against authorized supplier data.",priceCents:3380,imageUrl:"https://th.bing.com/th?id=OPHS.a8ykYIwFWfAsYA474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Koi Basics Koi731 scrub pants",sourceUrl:"https://th.bing.com/th?id=OPHS.a8ykYIwFWfAsYA474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["mid-tier","pants","classic fit","reference catalog"]}),
  ref({sku:"CCS-REF-MC-LUMA-TOP-001",slug:"med-couture-luma-v-neck-top",name:"Med Couture Luma V-Neck One Pocket Scrub Top",brand:"Med Couture",brandTier:"mid-tier",category:"scrubs",productType:"Tops",fitType:"Modern Fit",fabricTypes:["Moisture-wicking"],description:"Lightweight one-pocket V-neck scrub-top reference listing.",quality:"Verify authorized supplier, exact color/size availability and manufacturer specifications.",priceCents:2499,imageUrl:"https://th.bing.com/th?id=OPHS.7dcZm3028MPqig474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Med Couture Luma scrub top",sourceUrl:"https://th.bing.com/th?id=OPHS.7dcZm3028MPqig474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["mid-tier","top","lightweight","reference catalog"]}),
  ref({sku:"CCS-REF-BAR1-STRIDE-PANT-001",slug:"barco-one-stride-pants",name:"Barco One Stride Scrub Pants for Women",brand:"Barco One",brandTier:"specialty",category:"scrubs",productType:"Pants",fitType:"Athletic Fit",fabricTypes:["Moisture-wicking","Recycled fabric"],description:"Performance-oriented women's scrub-pant reference listing.",quality:"Verify recycled-fabric and performance claims from current manufacturer data before activation.",priceCents:3699,imageUrl:"https://th.bing.com/th?id=OPHS.Tpr2%2BqSlftLxJw474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Barco One Stride scrub pants",sourceUrl:"https://th.bing.com/th?id=OPHS.Tpr2%2BqSlftLxJw474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["specialty","pants","athletic fit","sustainable","reference catalog"]}),
  ref({sku:"CCS-REF-CHR-WSET-001",slug:"cherokee-womens-v-neck-scrub-set",name:"Cherokee Scrub Set for Women V-Neck Top and Mid Rise Tapered Pants",brand:"Cherokee",brandTier:"budget",category:"scrubs",productType:"Sets",fitType:"Classic Fit",fabricTypes:["Cotton blend"],description:"Women's V-neck scrub-set reference listing suited to uniform-program and onboarding use.",quality:"Verify authorized supplier, current fabric details, sizing and color inventory before sale.",priceCents:3698,imageUrl:"https://th.bing.com/th?id=OPHS.gP51kflZBGIdTw474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Cherokee women's V-neck scrub set",sourceUrl:"https://th.bing.com/th?id=OPHS.gP51kflZBGIdTw474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["budget","set","bulk","uniform program","reference catalog"]}),
  ref({sku:"CCS-REF-CHR-4100-PANT-001",slug:"cherokee-4100-unisex-cargo-pants",name:"Cherokee 4100 Unisex Drawstring Cargo Scrub Pants",brand:"Cherokee",brandTier:"budget",category:"scrubs",productType:"Pants",fitType:"Unisex",fabricTypes:["Cotton blend"],description:"Unisex drawstring cargo scrub-pant reference listing for high-volume uniform use.",quality:"Verify authorized supplier, exact materials, colors and size matrix before activation.",priceCents:2199,imageUrl:"https://th.bing.com/th?id=OPHS.2g9DNn4Ju28VeQ474C474&o=5&pid=21.1&w=400&h=400&r=0",imageAlt:"Reference image for Cherokee 4100 unisex cargo scrub pants",sourceUrl:"https://th.bing.com/th?id=OPHS.2g9DNn4Ju28VeQ474C474&o=5&pid=21.1&w=400&h=400&r=0",tags:["budget","pants","unisex","bulk","reference catalog"]})
];

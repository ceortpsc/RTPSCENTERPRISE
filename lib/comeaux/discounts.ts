export type CredentialKind = "RN" | "LVN" | "APRN" | "CNA" | "MA";
export type VerificationStatus = "unverified" | "pending" | "verified" | "expired" | "rejected";

export const TEXAS_CARE_DISCOUNT = {
  name: "Nurses of Texas & Care Team Savings",
  shortName: "Texas Care Team Savings",
  defaultDiscountBps: 1000,
  defaultDiscountPercent: 10,
  stackable: false,
  verificationValidityDays: 365,
  disclaimer:
    "Independent retail discount program. Not affiliated with, endorsed by, or operated by the Texas Board of Nursing, Texas Health and Human Services, TULIP, Nursys, or the State of Texas."
} as const;

export const CREDENTIALS: Record<CredentialKind, {
  label: string;
  audience: "nurse" | "care-team";
  regulator: string;
  source: string;
  verificationUrl: string;
  notes: string;
}> = {
  RN: {
    label: "Registered Nurse (RN)",
    audience: "nurse",
    regulator: "Texas Board of Nursing",
    source: "Texas BON primary-source license verification",
    verificationUrl: "https://txbn.boardsofnursing.org/licenselookup",
    notes: "Verify active Texas RN licensure and expiration/status before granting the discount."
  },
  LVN: {
    label: "Licensed Vocational Nurse (LVN)",
    audience: "nurse",
    regulator: "Texas Board of Nursing",
    source: "Texas BON primary-source license verification",
    verificationUrl: "https://txbn.boardsofnursing.org/licenselookup",
    notes: "Verify active Texas LVN licensure and expiration/status before granting the discount."
  },
  APRN: {
    label: "Advanced Practice Registered Nurse (APRN)",
    audience: "nurse",
    regulator: "Texas Board of Nursing",
    source: "Texas BON primary-source license verification",
    verificationUrl: "https://txbn.boardsofnursing.org/licenselookup",
    notes: "Verify active Texas APRN authorization/licensure status before granting the discount."
  },
  CNA: {
    label: "Certified Nurse Aide (CNA)",
    audience: "care-team",
    regulator: "Texas Health and Human Services",
    source: "Texas Nurse Aide Registry / TULIP employability search",
    verificationUrl: "https://tulip.hhs.texas.gov/",
    notes: "Use the HHSC/TULIP Nurse Aide Registry employability search. Do not treat CNA certification as BON nursing licensure."
  },
  MA: {
    label: "Medication Aide (MA / commonly called CMA)",
    audience: "care-team",
    regulator: "Texas Health and Human Services",
    source: "Texas Medication Aide permit / TULIP",
    verificationUrl: "https://tulip.hhs.texas.gov/",
    notes: "Texas HHSC uses Medication Aide (MA) terminology. Verify current permit status through TULIP/HHSC."
  }
};

export const PROMO_RULES = {
  maxAutomaticPercent: 20,
  allowStackingWithCredentialDiscount: false,
  excludedCategories: ["print-services"],
  finalSaleStillApplies: true,
  oneCredentialEntitlementPerCustomer: true
} as const;

export const PROMOTION_TEMPLATES = [
  {
    code: "TXCARE-FIRST15",
    name: "New Verified Member",
    audience: "verified-care-team",
    discountPercent: 15,
    oneTimePerCustomer: true,
    activeByDefault: false,
    description: "Optional first eligible order promotion after successful Texas credential verification."
  },
  {
    code: "TX-NURSE-WEEK20",
    name: "Texas Nurse Appreciation Sale",
    audience: "nurse",
    discountPercent: 20,
    oneTimePerCustomer: false,
    activeByDefault: false,
    description: "Seasonal RN/LVN/APRN promotion template. Admin must set dates before activation."
  },
  {
    code: "TX-CNA-MA15",
    name: "CNA & Medication Aide Appreciation",
    audience: "care-team",
    discountPercent: 15,
    oneTimePerCustomer: false,
    activeByDefault: false,
    description: "Seasonal Texas CNA and Medication Aide promotion template. Admin must set dates before activation."
  },
  {
    code: "TXCARE-UNIFORM15",
    name: "Care Team Uniform Bundle",
    audience: "verified-care-team",
    discountPercent: 15,
    oneTimePerCustomer: false,
    activeByDefault: false,
    description: "Optional bundle-sale template for eligible uniform merchandise; order rules should enforce the configured minimum quantity."
  }
] as const;

export function discountAmountCents(subtotalCents: number, bps = TEXAS_CARE_DISCOUNT.defaultDiscountBps) {
  return Math.floor((subtotalCents * bps) / 10_000);
}

export function maskedCredential(value: string) {
  const clean = value.trim();
  if (clean.length <= 4) return "••••";
  return `${"•".repeat(Math.min(clean.length - 4, 8))}${clean.slice(-4)}`;
}
